import Foundation
import Capacitor
import UserNotifications
import WidgetKit

/// Native bridge used by the web app (HabitsTab.js) for the home-screen widget
/// snapshot and locally scheduled reminders.
@objc(NousNativePlugin)
public class NousNativePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NousNativePlugin"
    public let jsName = "NousNative"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setWidgetData", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestNotificationPermission", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getNotificationPermission", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "scheduleReminders", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancelReminders", returnType: CAPPluginReturnPromise)
    ]

    static let appGroup = "group.app.nous.studytracker"
    static let widgetDataKey = "nous.widget.data"
    static let reminderPrefix = "nous.reminder."

    /// Stores today's progress snapshot (a JSON string) for the widget and refreshes it.
    @objc func setWidgetData(_ call: CAPPluginCall) {
        guard let json = call.getString("json") else {
            call.reject("Missing json")
            return
        }
        guard let defaults = UserDefaults(suiteName: Self.appGroup) else {
            call.reject("App group unavailable")
            return
        }
        defaults.set(json, forKey: Self.widgetDataKey)
        WidgetCenter.shared.reloadAllTimelines()
        call.resolve()
    }

    @objc func requestNotificationPermission(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            call.resolve(["granted": granted])
        }
    }

    @objc func getNotificationPermission(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            let status: String
            switch settings.authorizationStatus {
            case .authorized, .provisional, .ephemeral: status = "granted"
            case .denied: status = "denied"
            default: status = "prompt"
            }
            call.resolve(["status": status])
        }
    }

    /// Replaces every pending Nous reminder with `items`: [{ id, at (epoch ms), title, body }].
    @objc func scheduleReminders(_ call: CAPPluginCall) {
        let items = call.getArray("items", JSObject.self) ?? []
        let center = UNUserNotificationCenter.current()
        removePendingReminders(center) {
            var scheduled = 0
            for item in items {
                guard let id = item["id"] as? String,
                      let at = (item["at"] as? NSNumber)?.doubleValue else { continue }
                let date = Date(timeIntervalSince1970: at / 1000)
                guard date > Date() else { continue }

                let content = UNMutableNotificationContent()
                content.title = item["title"] as? String ?? "nous"
                content.body = item["body"] as? String ?? ""
                content.sound = .default

                let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
                let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
                center.add(UNNotificationRequest(identifier: Self.reminderPrefix + id, content: content, trigger: trigger))
                scheduled += 1
            }
            call.resolve(["scheduled": scheduled])
        }
    }

    @objc func cancelReminders(_ call: CAPPluginCall) {
        removePendingReminders(UNUserNotificationCenter.current()) {
            call.resolve()
        }
    }

    private func removePendingReminders(_ center: UNUserNotificationCenter, then completion: @escaping () -> Void) {
        center.getPendingNotificationRequests { requests in
            let ids = requests.map(\.identifier).filter { $0.hasPrefix(Self.reminderPrefix) }
            center.removePendingNotificationRequests(withIdentifiers: ids)
            completion()
        }
    }
}
