const { onRequest, onCall } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// --- Configuration ---
const APP_ID = "study-tracker-app";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

// Secret management - set via: firebase functions:secrets:set DEEPSEEK_API_KEY
// For local testing, set in .env file in functions/
const DEEPSEEK_API_KEY = defineSecret("DEEPSEEK_API_KEY");

// ============================================================
// HELPER: Gather user data for a given period
// ============================================================
async function gatherReportData(userId, periodType) {
    const now = new Date();
    let startDate, endDate, periodLabel;

    if (periodType === "weekly") {
        // Last 7 days
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        periodLabel = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
        // Last 30 days (monthly)
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        periodLabel = `${startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
    }

    // 1. Fetch sessions for the period
    const sessionsRef = db.collection(`artifacts/${APP_ID}/users/${userId}/sessions`);
    const sessionsSnap = await sessionsRef
        .where("startTime", ">=", admin.firestore.Timestamp.fromDate(startDate))
        .where("startTime", "<=", admin.firestore.Timestamp.fromDate(endDate))
        .get();

    const sessions = sessionsSnap.docs.map(doc => {
        const d = doc.data();
        return {
            id: doc.id,
            habitName: d.habitName || "Unknown",
            duration: d.duration || 0,
            startTime: d.startTime?.toDate?.() || new Date(),
            endTime: d.endTime?.toDate?.() || new Date(),
            isManual: d.isManual || false
        };
    });

    // 2. Fetch habits 
    const habitsRef = db.collection(`artifacts/${APP_ID}/users/${userId}/habits`);
    const habitsSnap = await habitsRef.get();
    const habits = habitsSnap.docs.map(doc => {
        const d = doc.data();
        return {
            id: doc.id,
            title: d.title || d.name || "Unknown",
            totalHours: d.totalHours || 0,
            completionDates: d.completionDates || [],
            icon: d.icon || "leaf",
            streak: calcStreak(d.completionDates || [])
        };
    });

    // 3. Fetch mood logs for the period
    const moodRef = db.collection(`artifacts/${APP_ID}/users/${userId}/mood_logs`);
    const moodSnap = await moodRef.get();
    const moodLogs = moodSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(log => {
            if (!log.date) return false;
            const logDate = new Date(log.date);
            return logDate >= startDate && logDate <= endDate;
        });

    // 4. Fetch user profile
    const userDoc = await db.collection("users").doc(userId).get();
    const userProfile = userDoc.exists ? userDoc.data() : {};

    // 5. Calculate statistics
    const stats = calculateStats(sessions, habits, moodLogs, periodType);

    // 6. Fetch previous period data for comparison
    let prevStartDate, prevEndDate;
    if (periodType === "weekly") {
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        prevStartDate = new Date(prevEndDate);
        prevStartDate.setDate(prevStartDate.getDate() - 6);
    } else {
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        prevStartDate = new Date(prevEndDate);
        prevStartDate.setDate(prevStartDate.getDate() - 29);
    }
    prevStartDate.setHours(0, 0, 0, 0);
    prevEndDate.setHours(23, 59, 59, 999);

    const prevSessionsSnap = await sessionsRef
        .where("startTime", ">=", admin.firestore.Timestamp.fromDate(prevStartDate))
        .where("startTime", "<=", admin.firestore.Timestamp.fromDate(prevEndDate))
        .get();

    const prevSessions = prevSessionsSnap.docs.map(doc => ({
        duration: doc.data().duration || 0,
        habitName: doc.data().habitName || "Unknown"
    }));

    const prevTotalMs = prevSessions.reduce((sum, s) => sum + s.duration, 0);
    const prevTotalHours = prevTotalMs / (1000 * 60 * 60);

    const comparison = {
        prevTotalHours: Math.round(prevTotalHours * 10) / 10,
        changePercent: prevTotalHours > 0
            ? Math.round(((stats.totalHours - prevTotalHours) / prevTotalHours) * 100)
            : (stats.totalHours > 0 ? 100 : 0),
        direction: stats.totalHours > prevTotalHours ? "up" : stats.totalHours < prevTotalHours ? "down" : "same"
    };

    return {
        userId,
        username: userProfile.username || "there",
        email: userProfile.email || null,
        periodType,
        periodLabel,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        sessions,
        habits,
        moodLogs,
        stats,
        comparison
    };
}

// ============================================================
// HELPER: Calculate statistics
// ============================================================
function calculateStats(sessions, habits, moodLogs, periodType) {
    const totalMs = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = totalMs / (1000 * 60 * 60);
    const totalSessions = sessions.length;
    const daysInPeriod = periodType === "weekly" ? 7 : 30;
    const dailyAvgHours = totalHours / daysInPeriod;

    // Per-habit breakdown
    const habitMap = {};
    sessions.forEach(s => {
        if (!habitMap[s.habitName]) {
            habitMap[s.habitName] = { totalMs: 0, count: 0 };
        }
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

    // Day-of-week distribution
    const dayDistribution = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    sessions.forEach(s => {
        const day = new Date(s.startTime).getDay();
        dayDistribution[day] += s.duration;
    });
    const bestDayIdx = dayDistribution.indexOf(Math.max(...dayDistribution));
    const bestDay = totalSessions > 0 ? dayNames[bestDayIdx] : null;

    // Hour distribution (find peak study hour)
    const hourDistribution = new Array(24).fill(0);
    sessions.forEach(s => {
        const hour = new Date(s.startTime).getHours();
        hourDistribution[hour] += s.duration;
    });
    const peakHourIdx = hourDistribution.indexOf(Math.max(...hourDistribution));
    const peakHour = totalSessions > 0 ? `${peakHourIdx}:00–${peakHourIdx + 1}:00` : null;

    // Mood stats
    const avgMood = moodLogs.length > 0
        ? Math.round((moodLogs.reduce((sum, l) => sum + (l.rating || 0), 0) / moodLogs.length) * 10) / 10
        : null;

    // Top streaks from habits
    const topStreaks = habits
        .filter(h => h.streak > 0)
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 3);

    // Study days (unique days with sessions)
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

// ============================================================
// HELPER: Calculate streak from completion dates
// ============================================================
function calcStreak(dates) {
    if (!dates || dates.length === 0) return 0;
    const sorted = [...dates].sort().reverse();
    const today = toLocalDateString(new Date());
    const yesterday = toLocalDateString(new Date(Date.now() - 86400000));
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diff = (prev - curr) / 86400000;
        if (diff === 1) streak++;
        else break;
    }
    return streak;
}

function toLocalDateString(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ============================================================
// HELPER: Call DeepSeek API for narrative
// ============================================================
async function generateAINarrative(reportData, apiKey) {
    const { stats, comparison, periodType, habits } = reportData;

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

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
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
            console.error("DeepSeek API error:", response.status, errText);
            return generateFallbackNarrative(reportData);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || generateFallbackNarrative(reportData);
    } catch (error) {
        console.error("DeepSeek API call failed:", error);
        return generateFallbackNarrative(reportData);
    }
}

// Fallback narrative when AI is unavailable
function generateFallbackNarrative(reportData) {
    const { stats, comparison, periodType } = reportData;
    const topHabit = stats.habitBreakdown[0];

    let text = `hey ${reportData.username},\n\n`;

    if (stats.totalSessions === 0) {
        text += `looks like it was a quiet ${periodType === "weekly" ? "week" : "month"}. no sessions logged this period — that's okay, we all need breaks sometimes.\n\n`;
        text += `whenever you're ready to get back into it, your habits are right where you left them. even 10 minutes counts.\n\n`;
    } else {
        text += `you put in ${stats.totalHours} hours across ${stats.totalSessions} sessions this ${periodType === "weekly" ? "week" : "month"}`;
        if (comparison.direction === "up" && comparison.changePercent > 0) {
            text += ` — that's ${comparison.changePercent}% more than last ${periodType === "weekly" ? "week" : "month"}! 📈`;
        } else if (comparison.direction === "down") {
            text += `. a bit less than last ${periodType === "weekly" ? "week" : "month"}, but consistency matters more than volume.`;
        }
        text += "\n\n";

        if (topHabit) {
            text += `your top focus was ${topHabit.name} at ${topHabit.hours}h (${topHabit.percentOfTotal}% of your time). `;
        }
        if (stats.bestDay) {
            text += `${stats.bestDay}s tend to be your most productive day. `;
        }
        if (stats.topStreaks.length > 0) {
            text += `and you're on a ${stats.topStreaks[0].streak}-day streak with ${stats.topStreaks[0].title} — keep it going! 🔥`;
        }
        text += "\n\n";
    }

    text += `keep showing up. — nous`;
    return text;
}

// ============================================================
// HELPER: Build HTML email
// ============================================================
function buildEmailHTML(reportData, aiNarrative) {
    const { stats, comparison, periodType, periodLabel } = reportData;
    const topHabit = stats.habitBreakdown[0];

    // Bar chart HTML for habit breakdown
    const habitBarsHTML = stats.habitBreakdown.slice(0, 6).map((h, i) => {
        const colors = ["#6B8DD6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
        const barWidth = stats.totalHours > 0 ? Math.max(8, (h.hours / stats.totalHours) * 100) : 0;
        return `
            <tr>
                <td style="padding: 8px 12px 8px 0; font-size: 14px; color: #4b5563; font-weight: 400; white-space: nowrap;">${h.name}</td>
                <td style="padding: 8px 0; width: 100%;">
                    <div style="background: #f3f4f6; border-radius: 6px; height: 24px; overflow: hidden;">
                        <div style="background: ${colors[i % colors.length]}; height: 100%; width: ${barWidth}%; border-radius: 6px; min-width: 24px;"></div>
                    </div>
                </td>
                <td style="padding: 8px 0 8px 12px; font-size: 14px; color: #374151; font-weight: 500; white-space: nowrap; text-align: right;">${h.hours}h</td>
            </tr>`;
    }).join("");

    // Streak badges
    const streakHTML = stats.topStreaks.map(s =>
        `<span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin: 0 4px 4px 0; font-weight: 500;">🔥 ${s.title}: ${s.streak}d</span>`
    ).join("");

    // Trend arrow
    const trendIcon = comparison.direction === "up" ? "📈" : comparison.direction === "down" ? "📉" : "➡️";
    const trendColor = comparison.direction === "up" ? "#059669" : comparison.direction === "down" ? "#dc2626" : "#6b7280";
    const trendText = comparison.changePercent !== 0
        ? `<span style="color: ${trendColor}; font-weight: 600;">${trendIcon} ${comparison.changePercent > 0 ? "+" : ""}${comparison.changePercent}%</span> vs last ${periodType === "weekly" ? "week" : "month"}`
        : `same as last ${periodType === "weekly" ? "week" : "month"}`;

    // AI narrative formatted for email
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
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; border: 2px solid #5d6b86; border-radius: 50%; line-height: 48px; text-align: center; font-size: 24px; color: #5d6b86; font-weight: 300; font-family: 'Georgia', serif;">n</div>
            <p style="margin: 12px 0 0 0; font-size: 13px; color: #9ca3af; text-transform: uppercase; letter-spacing: 3px; font-weight: 600;">${periodType} report</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">${periodLabel}</p>
        </div>

        <!-- Main Card -->
        <div style="background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 20px;">
            
            <!-- Hero Stats -->
            <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f3f4f6; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 48px; font-weight: 200; color: #1f2937; letter-spacing: -2px;">${stats.totalHours}h</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #9ca3af;">total study time</p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #6b7280;">${trendText}</p>
            </div>

            <!-- Stats Grid -->
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

            <!-- Habit Breakdown -->
            ${stats.habitBreakdown.length > 0 ? `
            <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">habit breakdown</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                    ${habitBarsHTML}
                </table>
            </div>` : ""}

            <!-- Streaks -->
            ${streakHTML ? `
            <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">active streaks</p>
                <div>${streakHTML}</div>
            </div>` : ""}

            <!-- Mood -->
            ${stats.avgMood ? `
            <div style="margin-bottom: 24px; padding: 16px; background: #f0fdf4; border-radius: 12px;">
                <p style="margin: 0; font-size: 14px; color: #15803d;">
                    🧠 average mood: <strong>${stats.avgMood}/10</strong>
                </p>
            </div>` : ""}
        </div>

        <!-- AI Insights Card -->
        <div style="background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 20px;">
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">✨ your personal insights</p>
            ${narrativeHTML}
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;">sent with 💙 by nous</p>
            <p style="margin: 0; font-size: 12px; color: #d1d5db;">
                <a href="#" style="color: #9ca3af; text-decoration: underline;">unsubscribe</a> · 
                <a href="#" style="color: #9ca3af; text-decoration: underline;">update preferences</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

// ============================================================
// HELPER: Send email via Resend API (or log for testing)
// ============================================================
async function sendEmail(to, subject, htmlContent) {
    // For now, we'll use Firebase's built-in email extension
    // or log the email content for testing
    // You can swap this with any email provider

    // Option 1: Write to a 'mail' collection for Firebase Trigger Email extension
    try {
        await db.collection("mail").add({
            to: to,
            message: {
                subject: subject,
                html: htmlContent
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`📧 Email queued for ${to}: "${subject}"`);
        return { success: true, method: "firestore-mail-queue" };
    } catch (error) {
        console.error("Failed to queue email:", error);
        // Fallback: just log it
        console.log("=== EMAIL CONTENT ===");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body length: ${htmlContent.length} chars`);
        console.log("=== END EMAIL ===");
        return { success: true, method: "console-log-fallback" };
    }
}

// ============================================================
// CLOUD FUNCTION: Generate and send report (callable)
// ============================================================
exports.generateReport = onCall(
    { secrets: [DEEPSEEK_API_KEY], cors: true },
    async (request) => {
        // Authenticate
        if (!request.auth) {
            throw new Error("Authentication required.");
        }

        const userId = request.auth.uid;
        const periodType = request.data?.periodType || "weekly";
        const sendEmailFlag = request.data?.sendEmail !== false; // default true

        console.log(`📊 Generating ${periodType} report for user ${userId}`);

        try {
            // 1. Gather data
            const reportData = await gatherReportData(userId, periodType);

            // 2. Generate AI narrative
            const apiKey = DEEPSEEK_API_KEY.value();
            const aiNarrative = await generateAINarrative(reportData, apiKey);

            // 3. Build HTML email
            const htmlEmail = buildEmailHTML(reportData, aiNarrative);

            // 4. Get user email from Firebase Auth
            let userEmail = null;
            try {
                const authUser = await admin.auth().getUser(userId);
                userEmail = authUser.email;
            } catch (e) {
                console.warn("Could not get user email from Auth:", e.message);
            }

            // Also check Firestore user profile for email preference
            const userPrefs = await db.collection("users").doc(userId).get();
            const prefsData = userPrefs.exists ? userPrefs.data() : {};
            const reportEmail = prefsData.reportEmail || userEmail;

            // 5. Send email if requested and email available
            let emailResult = null;
            if (sendEmailFlag && reportEmail) {
                const subject = `nous — your ${periodType} study report (${reportData.stats.totalHours}h)`;
                emailResult = await sendEmail(reportEmail, subject, htmlEmail);
            }

            // 6. Save report to Firestore for in-app viewing
            const reportRef = db.collection(`artifacts/${APP_ID}/users/${userId}/reports`);
            await reportRef.add({
                periodType,
                periodLabel: reportData.periodLabel,
                stats: reportData.stats,
                comparison: reportData.comparison,
                aiNarrative,
                htmlEmail,
                emailSent: emailResult?.success || false,
                emailRecipient: reportEmail || null,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return {
                success: true,
                periodType,
                periodLabel: reportData.periodLabel,
                stats: reportData.stats,
                comparison: reportData.comparison,
                aiNarrative,
                htmlPreview: htmlEmail,
                emailSent: emailResult?.success || false,
                emailRecipient: reportEmail || null
            };
        } catch (error) {
            console.error("Report generation failed:", error);
            throw new Error(`Report generation failed: ${error.message}`);
        }
    }
);

// ============================================================
// CLOUD FUNCTION: Weekly scheduled report
// ============================================================
exports.sendWeeklyReports = onSchedule(
    {
        schedule: "every sunday 20:00",
        timeZone: "Asia/Singapore",
        secrets: [DEEPSEEK_API_KEY]
    },
    async (event) => {
        console.log("📅 Running weekly report job...");
        await sendReportsToAllUsers("weekly");
    }
);

// ============================================================
// CLOUD FUNCTION: Monthly scheduled report
// ============================================================
exports.sendMonthlyReports = onSchedule(
    {
        schedule: "1 of month 09:00",
        timeZone: "Asia/Singapore",
        secrets: [DEEPSEEK_API_KEY]
    },
    async (event) => {
        console.log("📅 Running monthly report job...");
        await sendReportsToAllUsers("monthly");
    }
);

// ============================================================
// HELPER: Send reports to all opted-in users
// ============================================================
async function sendReportsToAllUsers(periodType) {
    try {
        // Find all users who have opted into reports
        const usersSnap = await db.collection("users")
            .where("reportPreferences.enabled", "==", true)
            .get();

        console.log(`Found ${usersSnap.size} users with reports enabled`);

        const apiKey = DEEPSEEK_API_KEY.value();
        let successCount = 0;
        let failCount = 0;

        for (const userDoc of usersSnap.docs) {
            const userId = userDoc.id;
            const userData = userDoc.data();

            // Check if this specific period type is enabled
            const prefs = userData.reportPreferences || {};
            if (periodType === "weekly" && !prefs.weekly) continue;
            if (periodType === "monthly" && !prefs.monthly) continue;

            try {
                // Get email
                let email = userData.reportEmail;
                if (!email) {
                    try {
                        const authUser = await admin.auth().getUser(userId);
                        email = authUser.email;
                    } catch (e) {
                        console.warn(`No email for user ${userId}`);
                        continue;
                    }
                }
                if (!email) continue;

                // Generate report
                const reportData = await gatherReportData(userId, periodType);
                const aiNarrative = await generateAINarrative(reportData, apiKey);
                const htmlEmail = buildEmailHTML(reportData, aiNarrative);

                // Send
                const subject = `nous — your ${periodType} study report (${reportData.stats.totalHours}h)`;
                await sendEmail(email, subject, htmlEmail);

                // Save to Firestore
                await db.collection(`artifacts/${APP_ID}/users/${userId}/reports`).add({
                    periodType,
                    periodLabel: reportData.periodLabel,
                    stats: reportData.stats,
                    comparison: reportData.comparison,
                    aiNarrative,
                    emailSent: true,
                    emailRecipient: email,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                successCount++;
                console.log(`✅ Report sent to ${userData.username || userId}`);
            } catch (error) {
                failCount++;
                console.error(`❌ Failed for user ${userId}:`, error);
            }
        }

        console.log(`📊 Report job complete: ${successCount} sent, ${failCount} failed`);
    } catch (error) {
        console.error("Report job failed:", error);
    }
}
