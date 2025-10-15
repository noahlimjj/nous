const { test, expect } = require('@playwright/test');

test.describe('Timer/Stopwatch Toggle Feature', () => {
    let page;
    let testUserId;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto('http://localhost:8080');

        // Wait for app to load and sign in as guest
        await page.waitForSelector('text=sign in as guest', { timeout: 10000 });
        await page.click('text=sign in as guest');

        // Wait for habits page to load
        await page.waitForSelector('text=add habit', { timeout: 10000 });

        console.log('✓ Logged in as guest');
    });

    test.afterEach(async () => {
        if (page) {
            await page.close();
        }
    });

    test('should toggle between stopwatch and timer mode for habits', async () => {
        // Add a new habit
        await page.fill('input[placeholder="e.g., Morning Run"]', 'Test Timer Habit');
        await page.click('button:has-text("add habit")');
        await page.waitForTimeout(1000);

        console.log('✓ Added test habit');

        // Check that the habit is displayed with default stopwatch mode
        await page.waitForSelector('text=Test Timer Habit', { timeout: 5000 });
        const stopwatchButton = await page.locator('button:has-text("stopwatch")').first();
        await expect(stopwatchButton).toBeVisible();

        console.log('✓ Default mode is stopwatch');

        // Toggle to timer mode
        await stopwatchButton.click();
        await page.waitForTimeout(500);

        // Verify it switched to countdown mode
        const countdownButton = await page.locator('button:has-text("countdown")').first();
        await expect(countdownButton).toBeVisible();

        console.log('✓ Switched to countdown mode');

        // Check that duration selector is visible
        const durationSelect = await page.locator('select').first();
        await expect(durationSelect).toBeVisible();
        await expect(durationSelect).toBeEnabled();

        console.log('✓ Duration selector is visible');

        // Change duration to 10 minutes
        await durationSelect.selectOption({ value: String(10 * 60 * 1000) });
        await page.waitForTimeout(500);

        console.log('✓ Changed duration to 10 minutes');

        // Toggle back to stopwatch mode
        await countdownButton.click();
        await page.waitForTimeout(500);

        // Verify it switched back to stopwatch
        await expect(stopwatchButton).toBeVisible();

        console.log('✓ Switched back to stopwatch mode');
    });

    test('should display countdown timer correctly when running in timer mode', async () => {
        // Add a new habit
        await page.fill('input[placeholder="e.g., Morning Run"]', 'Countdown Test');
        await page.click('button:has-text("add habit")');
        await page.waitForTimeout(1000);

        // Switch to timer mode
        const stopwatchButton = await page.locator('button:has-text("stopwatch")').first();
        await stopwatchButton.click();
        await page.waitForTimeout(500);

        // Set to 5 minutes
        const durationSelect = await page.locator('select').first();
        await durationSelect.selectOption({ value: String(5 * 60 * 1000) });
        await page.waitForTimeout(500);

        console.log('✓ Set timer to 5 minutes');

        // Start the timer
        const playButton = await page.locator('button').filter({ has: page.locator('svg[stroke="currentColor"]') }).first();
        await playButton.click();
        await page.waitForTimeout(1000);

        console.log('✓ Started countdown timer');

        // Check that timer is counting down (should show less than 5 minutes)
        const timerDisplay = await page.locator('.timer-display.running').first();
        await expect(timerDisplay).toBeVisible();

        const timerText = await timerDisplay.textContent();
        console.log('Timer display:', timerText);

        // Timer should show time close to 5:00
        expect(timerText).toMatch(/4:5[0-9]/);

        console.log('✓ Timer is counting down');

        // Pause the timer
        const pauseButton = await page.locator('button').filter({ has: page.locator('svg[stroke="currentColor"]') }).nth(1);
        await pauseButton.click();
        await page.waitForTimeout(500);

        console.log('✓ Paused timer');

        // Stop the timer
        const stopButton = await page.locator('button').filter({ has: page.locator('svg[stroke="currentColor"]') }).nth(2);
        await stopButton.click();
        await page.waitForTimeout(1000);

        console.log('✓ Stopped timer - session should be saved');

        // Verify session was saved in recent sessions
        await expect(page.locator('text=recent sessions')).toBeVisible();
    });

    test('should display stopwatch correctly when running in stopwatch mode', async () => {
        // Add a new habit
        await page.fill('input[placeholder="e.g., Morning Run"]', 'Stopwatch Test');
        await page.click('button:has-text("add habit")');
        await page.waitForTimeout(1000);

        // Start the timer (default is stopwatch mode)
        const playButton = await page.locator('button').filter({ has: page.locator('svg[stroke="currentColor"]') }).first();
        await playButton.click();
        await page.waitForTimeout(2000);

        console.log('✓ Started stopwatch');

        // Check that timer is counting up
        const timerDisplay = await page.locator('.timer-display.running').first();
        await expect(timerDisplay).toBeVisible();

        const timerText = await timerDisplay.textContent();
        console.log('Timer display:', timerText);

        // Timer should show time close to 0:01 or 0:02
        expect(timerText).toMatch(/0:0[12]/);

        console.log('✓ Stopwatch is counting up');

        // Stop the timer
        const pauseButton = await page.locator('button').filter({ has: page.locator('svg[stroke="currentColor"]') }).nth(1);
        await pauseButton.click();
        await page.waitForTimeout(500);

        const stopButton = await page.locator('button').filter({ has: page.locator('svg[stroke="currentColor"]') }).nth(2);
        await stopButton.click();
        await page.waitForTimeout(1000);

        console.log('✓ Stopped stopwatch - session should be saved');
    });
});
