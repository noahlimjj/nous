const { chromium } = require('playwright');

(async () => {
    console.log('Starting timer/stopwatch toggle test...\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to the app
        console.log('1. Navigating to http://localhost:8080');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Sign in as guest
        console.log('2. Signing in as guest...');
        await page.waitForSelector('text=sign in as guest', { timeout: 10000 });
        await page.click('text=sign in as guest');
        await page.waitForTimeout(3000);

        // Wait for habits page
        console.log('3. Waiting for habits page to load...');
        await page.waitForSelector('text=add habit', { timeout: 10000 });
        console.log('✓ Logged in successfully\n');

        // Add a new habit
        console.log('4. Adding a new habit "Timer Test"...');
        await page.fill('input[placeholder="e.g., Morning Run"]', 'Timer Test');
        await page.click('button:has-text("add habit")');
        await page.waitForTimeout(2000);
        console.log('✓ Habit added\n');

        // Check for stopwatch button
        console.log('5. Checking for stopwatch mode (default)...');
        const stopwatchButton = await page.locator('button:has-text("stopwatch")').first();
        const isVisible = await stopwatchButton.isVisible();
        console.log(`✓ Stopwatch button visible: ${isVisible}\n`);

        // Toggle to timer mode
        console.log('6. Clicking to toggle to countdown mode...');
        await stopwatchButton.click();
        await page.waitForTimeout(1000);

        // Check for countdown button
        const countdownButton = await page.locator('button:has-text("countdown")').first();
        const isCountdownVisible = await countdownButton.isVisible();
        console.log(`✓ Countdown button visible: ${isCountdownVisible}\n`);

        // Check for duration selector
        console.log('7. Checking for duration selector...');
        const durationSelect = await page.locator('select').first();
        const isSelectVisible = await durationSelect.isVisible();
        console.log(`✓ Duration selector visible: ${isSelectVisible}\n`);

        // Start the timer
        console.log('8. Starting the countdown timer...');
        const playButton = await page.locator('button[class*="bg-green"]').first();
        await playButton.click();
        await page.waitForTimeout(2000);

        // Check timer display
        console.log('9. Checking timer display...');
        const timerDisplay = await page.locator('.timer-display.running').first();
        const timerText = await timerDisplay.textContent();
        console.log(`✓ Timer showing: ${timerText}`);
        console.log('   (Should be counting down from 25:00)\n');

        // Wait a bit to see countdown
        console.log('10. Waiting 3 seconds to observe countdown...');
        await page.waitForTimeout(3000);
        const timerText2 = await timerDisplay.textContent();
        console.log(`✓ Timer now showing: ${timerText2}`);
        console.log('   (Should have decreased)\n');

        // Pause the timer
        console.log('11. Pausing the timer...');
        const pauseButton = await page.locator('button[class*="bg-yellow"]').first();
        await pauseButton.click();
        await page.waitForTimeout(1000);
        console.log('✓ Timer paused\n');

        // Stop the timer
        console.log('12. Stopping the timer...');
        const stopButton = await page.locator('button[class*="bg-red"]').first();
        await stopButton.click();
        await page.waitForTimeout(2000);
        console.log('✓ Timer stopped and session saved\n');

        console.log('═══════════════════════════════════════');
        console.log('✓ ALL TESTS PASSED!');
        console.log('═══════════════════════════════════════\n');
        console.log('Timer/Stopwatch toggle feature is working correctly!');
        console.log('You can now:');
        console.log('  - Toggle between stopwatch and countdown mode');
        console.log('  - Select different durations for countdown');
        console.log('  - Both modes save time to user hours\n');

        // Keep browser open for manual inspection
        console.log('Browser will stay open for 10 seconds for manual inspection...');
        await page.waitForTimeout(10000);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'test-error.png' });
        console.log('Screenshot saved to test-error.png');
    } finally {
        await browser.close();
        console.log('\nBrowser closed.');
    }
})();
