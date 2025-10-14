const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🔍 Checking shared timer status...\n');

    try {
        // Go to the app
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Check if we're on login page or dashboard
        const loginButton = await page.locator('button:has-text("continue as guest")').count();

        if (loginButton > 0) {
            console.log('📝 Logging in as guest...');
            await page.click('button:has-text("continue as guest")');
            await page.waitForTimeout(3000);
        }

        // Wait for page to load
        await page.waitForTimeout(2000);

        // Execute debug script in browser context
        const result = await page.evaluate(async () => {
            const db = window.db;
            const userId = window.userId;

            if (!db || !userId) {
                return { error: 'Not logged in', db: !!db, userId: !!userId };
            }

            try {
                // Check ALL shared timers
                const allTimersQuery = window.query(
                    window.collection(db, 'sharedTimers'),
                    window.where('participants', 'array-contains', userId)
                );

                const allTimersSnapshot = await window.getDocs(allTimersQuery);
                const allTimers = [];

                allTimersSnapshot.forEach((doc) => {
                    const data = doc.data();
                    allTimers.push({
                        id: doc.id,
                        status: data.status,
                        participants: data.participants,
                        participantNames: data.participantNames,
                        isPaused: data.isPaused,
                        habitName: data.habitName,
                        createdBy: data.createdBy
                    });
                });

                // Check active timers
                const activeTimersQuery = window.query(
                    window.collection(db, 'sharedTimers'),
                    window.where('participants', 'array-contains', userId),
                    window.where('status', '==', 'active')
                );

                const activeTimersSnapshot = await window.getDocs(activeTimersQuery);

                return {
                    userId,
                    totalTimers: allTimers.length,
                    activeTimers: activeTimersSnapshot.size,
                    timers: allTimers
                };
            } catch (error) {
                return { error: error.message, stack: error.stack };
            }
        });

        console.log('📊 Results:\n');
        console.log(JSON.stringify(result, null, 2));

        if (result.error) {
            console.log('\n❌ Error:', result.error);
        } else {
            console.log(`\n✓ User ID: ${result.userId}`);
            console.log(`✓ Total shared timers: ${result.totalTimers}`);
            console.log(`✓ Active timers: ${result.activeTimers}`);

            if (result.timers && result.timers.length > 0) {
                console.log('\n📋 Timer details:');
                result.timers.forEach((timer, i) => {
                    console.log(`\n  Timer ${i + 1}:`);
                    console.log(`    Status: ${timer.status}`);
                    console.log(`    Participants: ${timer.participants.join(', ')}`);
                    console.log(`    Names: ${timer.participantNames?.join(', ')}`);
                    console.log(`    Is Paused: ${timer.isPaused}`);
                });
            }

            if (result.activeTimers === 0 && result.totalTimers > 0) {
                console.log('\n⚠️  You have timers but none are ACTIVE.');
                console.log('   The timer might have been stopped already.');
            }
        }

        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Test error:', error);
    } finally {
        await browser.close();
    }
})();
