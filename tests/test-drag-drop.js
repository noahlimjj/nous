const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.log('ERROR:', err.message));

    try {
        console.log('Loading page...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(3000);

        // Check if we need to login
        const loginButton = await page.$('button:has-text("sign in with google")');
        if (loginButton) {
            console.log('⚠️  Login required - please login manually in the browser');
            console.log('Waiting 30 seconds for manual login...');
            await page.waitForTimeout(30000);
        }

        // Wait for page to load
        await page.waitForSelector('h2:has-text("my habits")', { timeout: 10000 });
        console.log('✓ Page loaded');

        // Check for habits
        const habitCards = await page.$$('div[draggable="true"]');
        console.log(`✓ Found ${habitCards.length} draggable habit cards`);

        if (habitCards.length < 2) {
            console.log('⚠️  Need at least 2 habits to test drag-and-drop');
            console.log('   Adding test habits...');

            for (let i = 0; i < 2; i++) {
                await page.fill('input[placeholder*="Morning Run"]', `Test Habit ${i + 1}`);
                await page.click('button:has-text("add habit")');
                await page.waitForTimeout(1000);
            }

            await page.waitForTimeout(2000);
        }

        // Check for drag handles
        const dragHandles = await page.$$('div[title="Drag to reorder"]');
        console.log(`✓ Found ${dragHandles.length} drag handles`);

        // Check for rename functionality
        const renameButtons = await page.$$('button[title="Rename habit"]');
        console.log(`✓ Found ${renameButtons.length} rename buttons`);

        if (renameButtons.length > 0) {
            console.log('\nTesting rename functionality...');
            await renameButtons[0].click();
            await page.waitForTimeout(500);

            const editInput = await page.$('input.border-blue-400');
            if (editInput) {
                console.log('✓ Rename edit mode works');
                await page.keyboard.press('Escape');
            } else {
                console.log('✗ Rename edit mode failed');
            }
        }

        console.log('\n=== Manual Testing Instructions ===');
        console.log('1. Drag a habit by its grip icon (⋮⋮) to reorder');
        console.log('2. Click the pencil icon to rename a habit');
        console.log('3. The dragged item should become semi-transparent');
        console.log('4. Drop zones should show a dashed blue border');
        console.log('\nKeeping browser open for 60 seconds for manual testing...');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
