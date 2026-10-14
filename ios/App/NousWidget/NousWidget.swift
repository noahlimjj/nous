import WidgetKit
import SwiftUI

// MARK: - Shared data (written by NousNativePlugin.setWidgetData)

struct NousSnapshot: Codable {
    struct Habit: Codable, Hashable {
        let title: String
        let icon: String
        let done: Bool
    }

    let date: String
    let done: Int
    let total: Int
    let focusMinutes: Int
    let streak: Int
    let habits: [Habit]

    static let appGroup = "group.app.nous.studytracker"
    static let key = "nous.widget.data"

    static let placeholder = NousSnapshot(
        date: NousSnapshot.isoDay(Date()), done: 2, total: 3, focusMinutes: 85, streak: 4,
        habits: [
            Habit(title: "deep work", icon: "target", done: true),
            Habit(title: "read", icon: "reading", done: true),
            Habit(title: "wake up early", icon: "wake", done: false)
        ]
    )

    static func load() -> NousSnapshot? {
        guard let json = UserDefaults(suiteName: appGroup)?.string(forKey: key),
              let data = json.data(using: .utf8) else { return nil }
        return try? JSONDecoder().decode(NousSnapshot.self, from: data)
    }

    static func isoDay(_ date: Date) -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }

    /// A snapshot from an earlier day carries over the habit list with progress reset.
    func resolved(for day: Date) -> NousSnapshot {
        guard date != NousSnapshot.isoDay(day) else { return self }
        return NousSnapshot(
            date: NousSnapshot.isoDay(day), done: 0, total: total, focusMinutes: 0, streak: streak,
            habits: habits.map { Habit(title: $0.title, icon: $0.icon, done: false) }
        )
    }

    var progress: Double { total > 0 ? Double(done) / Double(total) : 0 }

    var focusLabel: String {
        let h = focusMinutes / 60, m = focusMinutes % 60
        if h == 0 { return "\(m)m" }
        return m == 0 ? "\(h)h" : "\(h)h \(m)m"
    }
}

// MARK: - Timeline

struct NousEntry: TimelineEntry {
    let date: Date
    let snapshot: NousSnapshot?
}

struct NousProvider: TimelineProvider {
    func placeholder(in context: Context) -> NousEntry {
        NousEntry(date: Date(), snapshot: .placeholder)
    }

    func getSnapshot(in context: Context, completion: @escaping (NousEntry) -> Void) {
        let snap = context.isPreview ? (NousSnapshot.load() ?? .placeholder) : NousSnapshot.load()
        completion(NousEntry(date: Date(), snapshot: snap?.resolved(for: Date())))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<NousEntry>) -> Void) {
        let now = Date()
        let midnight = Calendar.current.startOfDay(for: now.addingTimeInterval(86_400))
        let snap = NousSnapshot.load()
        // Second entry resets progress at midnight even if the app isn't opened
        let entries = [
            NousEntry(date: now, snapshot: snap?.resolved(for: now)),
            NousEntry(date: midnight, snapshot: snap?.resolved(for: midnight))
        ]
        completion(Timeline(entries: entries, policy: .after(midnight.addingTimeInterval(60))))
    }
}

// MARK: - Style

enum NousStyle {
    static let accent = Color(red: 107 / 255, green: 141 / 255, blue: 214 / 255)   // #6B8DD6
    static let success = Color(red: 16 / 255, green: 185 / 255, blue: 129 / 255)   // #10B981
    static let streak = Color(red: 249 / 255, green: 115 / 255, blue: 22 / 255)    // #F97316
    static let background = Color(UIColor { $0.userInterfaceStyle == .dark
        ? UIColor(red: 17 / 255, green: 24 / 255, blue: 39 / 255, alpha: 1)
        : UIColor(red: 248 / 255, green: 249 / 255, blue: 251 / 255, alpha: 1) })
    static let track = Color(UIColor { $0.userInterfaceStyle == .dark
        ? UIColor(white: 1, alpha: 0.1)
        : UIColor(red: 226 / 255, green: 232 / 255, blue: 240 / 255, alpha: 1) })

    /// SF Symbol for a habit icon key, falling back when a symbol needs a newer iOS.
    static func symbol(for key: String) -> String {
        let candidates: [String: [String]] = [
            "study": ["graduationcap"], "reading": ["book"], "writing": ["pencil.line", "pencil"],
            "coding": ["laptopcomputer"], "language": ["globe"], "bulb": ["lightbulb"],
            "target": ["scope"], "bolt": ["bolt"], "chart": ["chart.line.uptrend.xyaxis"],
            "wake": ["sunrise"], "sleep": ["moon"], "nophone": ["iphone.slash"],
            "gym": ["dumbbell", "figure.walk"], "walk": ["figure.walk"], "water": ["drop"],
            "apple": ["carrot", "leaf"], "coffee": ["cup.and.saucer", "mug"], "leaf": ["leaf"],
            "heart": ["heart"], "fire": ["flame"], "star": ["star"], "music": ["music.note"],
            "budget": ["creditcard"], "create": ["paintpalette"]
        ]
        for name in candidates[key] ?? [] where UIImage(systemName: name) != nil {
            return name
        }
        return "circle"
    }
}

extension View {
    @ViewBuilder
    func nousWidgetBackground() -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            containerBackground(NousStyle.background, for: .widget)
        } else {
            background(NousStyle.background)
        }
    }
}

// MARK: - Views

struct ProgressRing: View {
    let snapshot: NousSnapshot
    var lineWidth: CGFloat = 7

    var body: some View {
        ZStack {
            Circle().stroke(NousStyle.track, lineWidth: lineWidth)
            Circle()
                .trim(from: 0, to: snapshot.progress)
                .stroke(snapshot.total > 0 && snapshot.done == snapshot.total ? NousStyle.success : NousStyle.accent,
                        style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
                .rotationEffect(.degrees(-90))
            VStack(spacing: 0) {
                Text("\(snapshot.done)/\(snapshot.total)")
                    .font(.system(size: 20, weight: .light))
                Text("habits")
                    .font(.system(size: 10, weight: .regular))
                    .foregroundColor(.secondary)
            }
        }
    }
}

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 6) {
            Text("nous").font(.system(size: 17, weight: .light))
            Text("open the app to start tracking")
                .font(.system(size: 11, weight: .regular))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
    }
}

struct SmallView: View {
    let snapshot: NousSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("today").font(.system(size: 12, weight: .regular)).foregroundColor(.secondary)
                Spacer()
                if snapshot.streak > 0 {
                    Label("\(snapshot.streak)", systemImage: "flame")
                        .font(.system(size: 12, weight: .regular))
                        .foregroundColor(NousStyle.streak)
                }
            }
            Spacer(minLength: 6)
            ProgressRing(snapshot: snapshot)
                .frame(width: 74, height: 74)
                .frame(maxWidth: .infinity)
            Spacer(minLength: 6)
            Text("\(snapshot.focusLabel) focused")
                .font(.system(size: 12, weight: .regular))
                .foregroundColor(.secondary)
                .frame(maxWidth: .infinity)
        }
    }
}

struct MediumView: View {
    let snapshot: NousSnapshot

    var body: some View {
        HStack(spacing: 16) {
            VStack(spacing: 8) {
                ProgressRing(snapshot: snapshot).frame(width: 78, height: 78)
                Text("\(snapshot.focusLabel) focused")
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(.secondary)
            }
            VStack(alignment: .leading, spacing: 7) {
                ForEach(Array(snapshot.habits.prefix(4)), id: \.self) { habit in
                    HStack(spacing: 8) {
                        Image(systemName: NousStyle.symbol(for: habit.icon))
                            .font(.system(size: 12, weight: .regular))
                            .foregroundColor(habit.done ? NousStyle.success : .secondary)
                            .frame(width: 16)
                        Text(habit.title)
                            .font(.system(size: 13, weight: .regular))
                            .lineLimit(1)
                            .foregroundColor(habit.done ? .secondary : .primary)
                        Spacer(minLength: 4)
                        Image(systemName: habit.done ? "checkmark.circle.fill" : "circle")
                            .font(.system(size: 14, weight: .regular))
                            .foregroundColor(habit.done ? NousStyle.success : NousStyle.track)
                    }
                }
                if snapshot.habits.count > 4 {
                    Text("+\(snapshot.habits.count - 4) more")
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(.secondary)
                }
            }
        }
    }
}

@available(iOSApplicationExtension 16.0, *)
struct CircularAccessoryView: View {
    let snapshot: NousSnapshot

    var body: some View {
        Gauge(value: snapshot.progress) {
            Image(systemName: "checkmark")
        } currentValueLabel: {
            Text("\(snapshot.done)/\(snapshot.total)")
        }
        .gaugeStyle(.accessoryCircularCapacity)
    }
}

struct NousWidgetView: View {
    @Environment(\.widgetFamily) var family
    let entry: NousEntry

    var body: some View {
        Group {
            if let snapshot = entry.snapshot {
                switch family {
                case .systemMedium:
                    MediumView(snapshot: snapshot)
                default:
                    if #available(iOSApplicationExtension 16.0, *), family == .accessoryCircular {
                        CircularAccessoryView(snapshot: snapshot)
                    } else {
                        SmallView(snapshot: snapshot)
                    }
                }
            } else {
                EmptyStateView()
            }
        }
        .nousWidgetBackground()
    }
}

// MARK: - Widget

struct NousTodayWidget: Widget {
    let kind = "NousTodayWidget"

    private var families: [WidgetFamily] {
        if #available(iOSApplicationExtension 16.0, *) {
            return [.systemSmall, .systemMedium, .accessoryCircular]
        }
        return [.systemSmall, .systemMedium]
    }

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: NousProvider()) { entry in
            NousWidgetView(entry: entry)
        }
        .configurationDisplayName("today")
        .description("your habits and focus time for today.")
        .supportedFamilies(families)
    }
}

@main
struct NousWidgetBundle: WidgetBundle {
    var body: some Widget {
        NousTodayWidget()
    }
}
