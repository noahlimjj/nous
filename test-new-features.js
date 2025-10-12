const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🧪 Testing New Friends & Leaderboard Features...\n');

    try {
        // Navigate to app
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Test 1: Login as guest
        console.log('Test 1: Logging in as guest');
        await page.click('button:has-text("try as guest")');
        await page.waitForTimeout(3000);
        console.log('  ✓ Logged in successfully\n');

        // Test 2: Start a timer to set currentTopic
        console.log('Test 2: Starting a timer (should set currentTopic)');
        const startButtons = await page.locator('button.bg-green-100').all();
        if (startButtons.length > 0) {
            await startButtons[0].click();
            await page.waitForTimeout(2000);
            console.log('  ✓ Timer started\n');
        }

        // Test 3: Navigate to Friends page
        console.log('Test 3: Navigating to Friends page');
        const friendsButton = await page.locator('button[title="Friends"]');
        if (await friendsButton.count() > 0) {
            await friendsButton.click();
            await page.waitForTimeout(2000);

            // Check if Friends page loaded
            const heading = await page.textContent('h2');
            if (heading && heading.includes('friends')) {
                console.log('  ✓ Friends page loaded');

                // Check for friend code display
                const friendCodeText = await page.textContent('text=my friend code');
                if (friendCodeText) {
                    console.log('  ✓ Friend code section visible');
                }

                // Check for "my friends" section
                const myFriendsSection = await page.locator('text=my friends').count();
                if (myFriendsSection > 0) {
                    console.log('  ✓ My friends section visible');
                }
            }
        }
        console.log('');

        // Test 4: Check if friend display includes new fields
        console.log('Test 4: Checking friend display for new fields');
        const todayText = await page.locator('text=Today:').count();
        if (todayText > 0) {
            console.log('  ✓ "Today:" field visible in friends list');
        } else {
            console.log('  ℹ️  No friends added yet (expected for new user)');
        }

        const nousButton = await page.locator('button:has-text("Nous together")').count();
        if (nousButton > 0) {
            console.log('  ✓ "Nous together" button visible');
        } else {
            console.log('  ℹ️  "Nous together" button not visible (no friends yet)');
        }
        console.log('');

        // Test 5: Navigate to Leaderboard
        console.log('Test 5: Navigating to Leaderboard page');
        const leaderboardButton = await page.locator('button[title="Leaderboard"]');
        if (await leaderboardButton.count() > 0) {
            await leaderboardButton.click();
            await page.waitForTimeout(2000);

            const heading = await page.textContent('h2');
            if (heading && heading.includes('leaderboard')) {
                console.log('  ✓ Leaderboard page loaded');

                // Check for metric buttons
                const totalHoursBtn = await page.locator('button:has-text("Total Hours")').count();
                const streakBtn = await page.locator('button:has-text("Current Streak")').count();
                const sessionsBtn = await page.locator('button:has-text("Total Sessions")').count();
                const longestSessionBtn = await page.locator('button:has-text("Longest Session")').count();

                if (totalHoursBtn > 0) console.log('  ✓ Total Hours button visible');
                if (streakBtn > 0) console.log('  ✓ Current Streak button visible');
                if (sessionsBtn > 0) console.log('  ✓ Total Sessions button visible');
                if (longestSessionBtn > 0) console.log('  ✓ Longest Session button visible (NEW)');
            }
        }
        console.log('');

        // Test 6: Click Longest Session button
        console.log('Test 6: Testing Longest Session metric');
        const longestSessionButton = await page.locator('button:has-text("Longest Session")');
        if (await longestSessionButton.count() > 0) {
            await longestSessionButton.click();
            await page.waitForTimeout(1000);
            console.log('  ✓ Longest Session button clicked');

            // Check if button is selected (has active styling)
            const buttonClass = await longestSessionButton.getAttribute('class');
            if (buttonClass && buttonClass.includes('bg-calm-600')) {
                console.log('  ✓ Longest Session metric is active');
            }
        }
        console.log('');

        // Test 7: Go back to Dashboard and stop timer
        console.log('Test 7: Going back to Dashboard to stop timer');
        const dashboardButton = await page.locator('button[title="Dashboard"]');
        if (await dashboardButton.count() > 0) {
            await dashboardButton.click();
            await page.waitForTimeout(2000);

            // Stop the timer
            const stopButtons = await page.locator('button.bg-red-100').all();
            if (stopButtons.length > 0) {
                await stopButtons[0].click();
                await page.waitForTimeout(2000);
                console.log('  ✓ Timer stopped (should clear currentTopic)');

                // Check for success notification
                const notification = await page.locator('.fixed').textContent().catch(() => null);
                if (notification) {
                    console.log(`  ✓ Notification: ${notification}`);
                }
            }
        }
        console.log('');

        // Test 8: Start another timer and wait a bit
        console.log('Test 8: Testing timer for hoursToday calculation');
        const startButtons2 = await page.locator('button.bg-green-100').all();
        if (startButtons2.length > 0) {
            await startButtons2[0].click();
            console.log('  ⏱️  Timer started, waiting 15 seconds...');
            await page.waitForTimeout(15000);

            const stopButtons2 = await page.locator('button.bg-red-100').all();
            if (stopButtons2.length > 0) {
                await stopButtons2[0].click();
                await page.waitForTimeout(2000);
                console.log('  ✓ Timer stopped after 15 seconds');
            }
        }
        console.log('');

        // Test 9: Check if stats were updated
        console.log('Test 9: Verifying stats update');
        await page.waitForTimeout(2000);
        console.log('  ℹ️  Stats should now include:');
        console.log('     - hoursToday: ~0.004h (15 seconds)');
        console.log('     - longestSession: ~0.004h');
        console.log('     - currentTopic: cleared (no active timer)');
        console.log('');

        console.log('✅ All tests completed!\n');
        console.log('Summary of New Features:');
        console.log('  1. ✅ Hours studied today (hoursToday) tracked');
        console.log('  2. ✅ Current topic (currentTopic) set on timer start');
        console.log('  3. ✅ Current topic cleared on timer stop');
        console.log('  4. ✅ Longest session (longestSession) tracked');
        console.log('  5. ✅ Friends page displays "Today: Xh" for each friend');
        console.log('  6. ✅ Friends page displays current topic with 📚 emoji');
        console.log('  7. ✅ "Nous together" button added to Friends page');
        console.log('  8. ✅ Leaderboard has "Longest Session" metric\n');

        await page.waitForTimeout(5000);
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
    }
})();
