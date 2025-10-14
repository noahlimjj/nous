const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for console messages and errors
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    try {
        console.log('Navigating to localhost:8080...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Check if we need to login
        const loginButton = await page.$('button:has-text("sign in with google")');
        if (loginButton) {
            console.log('Login required - please login manually');
            await page.waitForTimeout(30000); // Wait for manual login
        }

        // Wait for habits to load
        console.log('Waiting for habits to load...');
        await page.waitForSelector('h2:has-text("my habits")', { timeout: 10000 });
        await page.waitForTimeout(2000);

        // Check if there are any habits
        const habitCards = await page.$$('.bg-white.p-4.rounded-lg.shadow-sm');
        console.log(`Found ${habitCards.length} habits`);

        if (habitCards.length === 0) {
            console.log('No habits found. Adding a test habit...');
            await page.fill('input[placeholder*="Morning Run"]', 'Test Habit');
            await page.click('button:has-text("add habit")');
            await page.waitForTimeout(2000);
        }

        // Test 1: Check if pencil icon exists
        console.log('\nTest 1: Checking for pencil (rename) icons...');
        const pencilIcons = await page.$$('button[title="Rename habit"]');
        console.log(`Found ${pencilIcons.length} pencil icons`);

        // Test 2: Check if arrow buttons exist
        console.log('\nTest 2: Checking for reorder arrow buttons...');
        const upArrows = await page.$$('button[title="Move up"]');
        const downArrows = await page.$$('button[title="Move down"]');
        console.log(`Found ${upArrows.length} up arrows and ${downArrows.length} down arrows`);

        // Test 3: Try clicking rename
        if (pencilIcons.length > 0) {
            console.log('\nTest 3: Testing rename functionality...');
            await pencilIcons[0].click();
            await page.waitForTimeout(1000);

            const editInput = await page.$('input[type="text"].border-blue-400');
            if (editInput) {
                console.log('✓ Edit mode activated successfully');
                const inputValue = await editInput.inputValue();
                console.log(`  Current value: "${inputValue}"`);

                // Cancel edit
                await page.keyboard.press('Escape');
                await page.waitForTimeout(500);
                console.log('  Cancelled edit');
            } else {
                console.log('✗ Edit input not found after clicking pencil');
            }
        }

        // Test 4: Check for JavaScript errors
        console.log('\nTest 4: Checking for JavaScript errors in console...');
        console.log('(Check browser console above for any errors)');

        console.log('\n=== Test Complete ===');
        console.log('Keeping browser open for manual inspection...');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
