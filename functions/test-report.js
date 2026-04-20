/**
 * Standalone test for report generation & DeepSeek API integration.
 * Run: node test-report.js
 * 
 * This tests the AI narrative generation and HTML email rendering
 * WITHOUT requiring Firebase emulators.
 */

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-62f463e71ae3402d9aa3b06bc25db0d2";

// Mock report data (simulates what we'd gather from Firestore)
const mockReportData = {
    userId: "test-user-123",
    username: "noah",
    email: "test@example.com",
    periodType: "weekly",
    periodLabel: "Apr 13 – Apr 20, 2026",
    startDate: "2026-04-13T00:00:00.000Z",
    endDate: "2026-04-20T23:59:59.999Z",
    sessions: [
        { habitName: "Anatomy", duration: 7200000, startTime: new Date("2026-04-14T09:00:00") },
        { habitName: "Anatomy", duration: 5400000, startTime: new Date("2026-04-15T10:00:00") },
        { habitName: "BJJ", duration: 5400000, startTime: new Date("2026-04-14T18:00:00") },
        { habitName: "BJJ", duration: 3600000, startTime: new Date("2026-04-16T18:00:00") },
        { habitName: "Coding", duration: 10800000, startTime: new Date("2026-04-15T14:00:00") },
        { habitName: "Coding", duration: 7200000, startTime: new Date("2026-04-17T09:00:00") },
        { habitName: "Meditation", duration: 1800000, startTime: new Date("2026-04-14T07:00:00") },
        { habitName: "Meditation", duration: 1800000, startTime: new Date("2026-04-15T07:00:00") },
        { habitName: "Meditation", duration: 1800000, startTime: new Date("2026-04-16T07:00:00") },
        { habitName: "Meditation", duration: 1800000, startTime: new Date("2026-04-17T07:00:00") },
        { habitName: "Reading", duration: 3600000, startTime: new Date("2026-04-18T21:00:00") },
    ],
    habits: [
        { id: "1", title: "Anatomy", totalHours: 45.2, completionDates: ["2026-04-14", "2026-04-15"], streak: 2 },
        { id: "2", title: "BJJ", totalHours: 32.1, completionDates: ["2026-04-14", "2026-04-16"], streak: 0 },
        { id: "3", title: "Coding", totalHours: 120.5, completionDates: ["2026-04-15", "2026-04-17"], streak: 1 },
        { id: "4", title: "Meditation", totalHours: 15.0, completionDates: ["2026-04-14", "2026-04-15", "2026-04-16", "2026-04-17", "2026-04-18", "2026-04-19", "2026-04-20"], streak: 7 },
        { id: "5", title: "Reading", totalHours: 8.3, completionDates: ["2026-04-18"], streak: 1 },
    ],
    moodLogs: [
        { date: "2026-04-14", rating: 7 },
        { date: "2026-04-15", rating: 8 },
        { date: "2026-04-16", rating: 6 },
        { date: "2026-04-17", rating: 9 },
        { date: "2026-04-18", rating: 7 },
    ],
    stats: null, // Will be calculated
    comparison: null // Will be set
};

// Calculate stats (same logic as Cloud Function)
function calculateStats(sessions, habits, moodLogs, periodType) {
    const totalMs = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = totalMs / (1000 * 60 * 60);
    const totalSessions = sessions.length;
    const daysInPeriod = periodType === "weekly" ? 7 : 30;
    const dailyAvgHours = totalHours / daysInPeriod;

    const habitMap = {};
    sessions.forEach(s => {
        if (!habitMap[s.habitName]) habitMap[s.habitName] = { totalMs: 0, count: 0 };
        habitMap[s.habitName].totalMs += s.duration;
        habitMap[s.habitName].count += 1;
    });

    const habitBreakdown = Object.entries(habitMap)
        .map(([name, data]) => ({
            name,
            hours: Math.round((data.totalMs / (1000 * 60 * 60)) * 10) / 10,
            sessions: data.count,
            percentOfTotal: totalMs > 0 ? Math.round((data.totalMs / totalMs) * 100) : 0
        }))
        .sort((a, b) => b.hours - a.hours);

    const dayDistribution = [0, 0, 0, 0, 0, 0, 0];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    sessions.forEach(s => {
        const day = new Date(s.startTime).getDay();
        dayDistribution[day] += s.duration;
    });
    const bestDayIdx = dayDistribution.indexOf(Math.max(...dayDistribution));
    const bestDay = totalSessions > 0 ? dayNames[bestDayIdx] : null;

    const hourDistribution = new Array(24).fill(0);
    sessions.forEach(s => {
        const hour = new Date(s.startTime).getHours();
        hourDistribution[hour] += s.duration;
    });
    const peakHourIdx = hourDistribution.indexOf(Math.max(...hourDistribution));
    const peakHour = totalSessions > 0 ? `${peakHourIdx}:00–${peakHourIdx + 1}:00` : null;

    const avgMood = moodLogs.length > 0
        ? Math.round((moodLogs.reduce((sum, l) => sum + (l.rating || 0), 0) / moodLogs.length) * 10) / 10
        : null;

    const topStreaks = habits
        .filter(h => h.streak > 0)
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 3);

    const studyDays = new Set(sessions.map(s => new Date(s.startTime).toDateString())).size;

    return {
        totalHours: Math.round(totalHours * 10) / 10,
        totalSessions,
        dailyAvgHours: Math.round(dailyAvgHours * 10) / 10,
        habitBreakdown,
        bestDay,
        peakHour,
        avgMood,
        topStreaks,
        studyDays,
        daysInPeriod
    };
}

// Call DeepSeek API
async function testDeepSeekAPI(reportData) {
    const { stats, comparison, periodType } = reportData;

    const prompt = `You are a warm, encouraging study coach writing a brief ${periodType} progress report for a student named "${reportData.username}".

Here is their data for this period (${reportData.periodLabel}):

STUDY STATS:
- Total study time: ${stats.totalHours} hours across ${stats.totalSessions} sessions
- Daily average: ${stats.dailyAvgHours} hours/day
- Active study days: ${stats.studyDays} out of ${stats.daysInPeriod} days
- Best study day: ${stats.bestDay || "N/A"}
- Peak study hour: ${stats.peakHour || "N/A"}

HABIT BREAKDOWN:
${stats.habitBreakdown.map(h => `- ${h.name}: ${h.hours}h (${h.sessions} sessions, ${h.percentOfTotal}%)`).join("\n")}

COMPARISON VS PREVIOUS ${periodType.toUpperCase()}:
- Previous period: ${comparison.prevTotalHours}h → This period: ${stats.totalHours}h
- Change: ${comparison.changePercent > 0 ? "+" : ""}${comparison.changePercent}% (${comparison.direction})

ACTIVE STREAKS:
${stats.topStreaks.length > 0 ? stats.topStreaks.map(s => `- ${s.title}: ${s.streak}-day streak 🔥`).join("\n") : "No active streaks"}

MOOD:
${stats.avgMood ? `Average mood: ${stats.avgMood}/10` : "No mood data this period"}

Write a SHORT, personal email body (3-4 paragraphs, ~150 words max). Be specific with their data. Use a conversational, warm tone. Include:
1. A warm greeting and highlight of their top achievement this period
2. A specific, data-backed observation (trend, peak hours, consistency, etc.)
3. One actionable suggestion for next ${periodType === "weekly" ? "week" : "month"}
4. An encouraging sign-off

Do NOT use generic platitudes. Reference their actual numbers and habit names. Keep it brief and scannable.
Use lowercase text to match the app's aesthetic. No markdown formatting — just plain text with line breaks.`;

    console.log("\n🤖 Calling DeepSeek API...");
    console.log(`   URL: ${DEEPSEEK_API_URL}`);
    console.log(`   Key: ${DEEPSEEK_API_KEY.substring(0, 8)}...${DEEPSEEK_API_KEY.substring(DEEPSEEK_API_KEY.length - 4)}`);

    const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a helpful, warm study coach. Write in lowercase to match the app's mindful aesthetic. Be concise and data-driven." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error(`\n❌ DeepSeek API Error: HTTP ${response.status}`);
        console.error(errText);
        return null;
    }

    const data = await response.json();
    const narrative = data.choices?.[0]?.message?.content;

    console.log(`\n✅ DeepSeek API Response (${data.usage?.total_tokens || "?"} tokens):`);
    console.log("─".repeat(60));
    console.log(narrative);
    console.log("─".repeat(60));

    return narrative;
}

// Build HTML email (same as Cloud Function)
function buildEmailHTML(reportData, aiNarrative) {
    const { stats, comparison, periodType, periodLabel } = reportData;

    const habitBarsHTML = stats.habitBreakdown.slice(0, 6).map((h, i) => {
        const colors = ["#6B8DD6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
        const barWidth = stats.totalHours > 0 ? Math.max(8, (h.hours / stats.totalHours) * 100) : 0;
        return `<tr>
            <td style="padding: 8px 12px 8px 0; font-size: 14px; color: #4b5563; font-weight: 400; white-space: nowrap;">${h.name}</td>
            <td style="padding: 8px 0; width: 100%;">
                <div style="background: #f3f4f6; border-radius: 6px; height: 24px; overflow: hidden;">
                    <div style="background: ${colors[i % colors.length]}; height: 100%; width: ${barWidth}%; border-radius: 6px; min-width: 24px;"></div>
                </div>
            </td>
            <td style="padding: 8px 0 8px 12px; font-size: 14px; color: #374151; font-weight: 500; white-space: nowrap; text-align: right;">${h.hours}h</td>
        </tr>`;
    }).join("");

    const streakHTML = stats.topStreaks.map(s =>
        `<span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin: 0 4px 4px 0; font-weight: 500;">🔥 ${s.title}: ${s.streak}d</span>`
    ).join("");

    const trendIcon = comparison.direction === "up" ? "📈" : comparison.direction === "down" ? "📉" : "➡️";
    const trendColor = comparison.direction === "up" ? "#059669" : comparison.direction === "down" ? "#dc2626" : "#6b7280";
    const trendText = comparison.changePercent !== 0
        ? `<span style="color: ${trendColor}; font-weight: 600;">${trendIcon} ${comparison.changePercent > 0 ? "+" : ""}${comparison.changePercent}%</span> vs last ${periodType === "weekly" ? "week" : "month"}`
        : `same as last ${periodType === "weekly" ? "week" : "month"}`;

    const narrativeHTML = aiNarrative
        .split("\n\n")
        .map(p => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.7; color: #374151;">${p.replace(/\n/g, "<br>")}</p>`)
        .join("");

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>nous — ${periodType} report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; border: 2px solid #5d6b86; border-radius: 50%; line-height: 48px; text-align: center; font-size: 24px; color: #5d6b86; font-weight: 300; font-family: 'Georgia', serif;">n</div>
            <p style="margin: 12px 0 0 0; font-size: 13px; color: #9ca3af; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">${periodType} report</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">${periodLabel}</p>
        </div>
        <div style="background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 20px;">
            <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f3f4f6; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 48px; font-weight: 200; color: #1f2937; letter-spacing: -2px;">${stats.totalHours}h</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #9ca3af;">total study time</p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280;">${trendText}</p>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                    <td style="text-align: center; padding: 12px;">
                        <p style="margin: 0; font-size: 28px; font-weight: 300; color: #1f2937;">${stats.totalSessions}</p>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">sessions</p>
                    </td>
                    <td style="text-align: center; padding: 12px; border-left: 1px solid #f3f4f6; border-right: 1px solid #f3f4f6;">
                        <p style="margin: 0; font-size: 28px; font-weight: 300; color: #1f2937;">${stats.dailyAvgHours}h</p>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">daily avg</p>
                    </td>
                    <td style="text-align: center; padding: 12px;">
                        <p style="margin: 0; font-size: 28px; font-weight: 300; color: #1f2937;">${stats.studyDays}/${stats.daysInPeriod}</p>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">active days</p>
                    </td>
                </tr>
            </table>
            ${stats.habitBreakdown.length > 0 ? `
            <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">habit breakdown</p>
                <table width="100%" cellpadding="0" cellspacing="0">${habitBarsHTML}</table>
            </div>` : ""}
            ${streakHTML ? `<div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">active streaks</p>
                <div>${streakHTML}</div>
            </div>` : ""}
            ${stats.avgMood ? `<div style="margin-bottom: 24px; padding: 16px; background: #f0fdf4; border-radius: 12px;">
                <p style="margin: 0; font-size: 14px; color: #15803d;">🧠 average mood: <strong>${stats.avgMood}/10</strong></p>
            </div>` : ""}
        </div>
        <div style="background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 20px;">
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">✨ your personal insights</p>
            ${narrativeHTML}
        </div>
        <div style="text-align: center; padding: 20px;">
            <p style="margin: 0; font-size: 13px; color: #9ca3af;">sent with 💙 by nous</p>
        </div>
    </div>
</body>
</html>`;
}

// ============================================================
// MAIN TEST
// ============================================================
async function main() {
    console.log("═".repeat(60));
    console.log("  NOUS REPORT GENERATOR — LOCAL TEST");
    console.log("═".repeat(60));

    // Step 1: Calculate stats from mock data
    console.log("\n📊 Step 1: Calculating statistics...");
    const stats = calculateStats(
        mockReportData.sessions,
        mockReportData.habits,
        mockReportData.moodLogs,
        "weekly"
    );
    mockReportData.stats = stats;
    mockReportData.comparison = {
        prevTotalHours: 10.5,
        changePercent: Math.round(((stats.totalHours - 10.5) / 10.5) * 100),
        direction: stats.totalHours > 10.5 ? "up" : "down"
    };

    console.log(`   Total hours: ${stats.totalHours}h`);
    console.log(`   Total sessions: ${stats.totalSessions}`);
    console.log(`   Daily average: ${stats.dailyAvgHours}h`);
    console.log(`   Active days: ${stats.studyDays}/${stats.daysInPeriod}`);
    console.log(`   Best day: ${stats.bestDay}`);
    console.log(`   Peak hour: ${stats.peakHour}`);
    console.log(`   Avg mood: ${stats.avgMood}/10`);
    console.log(`   Top streaks: ${stats.topStreaks.map(s => `${s.title}(${s.streak}d)`).join(", ")}`);
    console.log(`   Habits: ${stats.habitBreakdown.map(h => `${h.name}: ${h.hours}h`).join(", ")}`);
    console.log(`   Comparison: ${mockReportData.comparison.changePercent}% ${mockReportData.comparison.direction}`);

    // Step 2: Test DeepSeek API
    console.log("\n🤖 Step 2: Testing DeepSeek API...");
    let aiNarrative;
    try {
        aiNarrative = await testDeepSeekAPI(mockReportData);
        if (!aiNarrative) {
            console.log("⚠️  AI unavailable, using fallback narrative");
            aiNarrative = generateFallbackNarrative(mockReportData);
        }
    } catch (error) {
        console.error("❌ DeepSeek error:", error.message);
        aiNarrative = generateFallbackNarrative(mockReportData);
    }

    // Step 3: Build HTML email
    console.log("\n📧 Step 3: Building HTML email...");
    const html = buildEmailHTML(mockReportData, aiNarrative);
    console.log(`   HTML length: ${html.length} characters`);

    // Step 4: Save email to file for preview
    const fs = require("fs");
    const outputPath = __dirname + "/test-report-output.html";
    fs.writeFileSync(outputPath, html);
    console.log(`\n✅ Email saved to: ${outputPath}`);
    console.log("   Open this file in a browser to preview the email!");

    console.log("\n" + "═".repeat(60));
    console.log("  TEST COMPLETE");
    console.log("═".repeat(60));
}

function generateFallbackNarrative(reportData) {
    const { stats, comparison } = reportData;
    const topHabit = stats.habitBreakdown[0];
    let text = `hey ${reportData.username},\n\n`;
    text += `you put in ${stats.totalHours} hours across ${stats.totalSessions} sessions this week`;
    if (comparison.direction === "up") text += ` — that's ${comparison.changePercent}% more than last week! 📈`;
    text += "\n\n";
    if (topHabit) text += `your top focus was ${topHabit.name} at ${topHabit.hours}h. `;
    if (stats.topStreaks.length > 0) text += `you're on a ${stats.topStreaks[0].streak}-day streak with ${stats.topStreaks[0].title} — keep it going! 🔥`;
    text += "\n\nkeep showing up. — nous";
    return text;
}

main().catch(console.error);
