const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors = [];
    const logs = [];

    page.on('console', msg => {
        const text = msg.text();
        logs.push(text);
        console.log(`[${msg.type().toUpperCase()}]`, text);
    });

    page.on('pageerror', err => {
        errors.push(err.message);
        console.log('🔥 ERROR:', err.message);
    });

    try {
        console.log('Loading page...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(3000);

        // Check if we need to login
        const loginButton = await page.$('button:has-text("sign in with google")');
        if (loginButton) {
            console.log('⚠️  Login required - please login manually');
            console.log('Waiting 30 seconds...');
            await page.waitForTimeout(30000);
        }

        // Wait for habits page
        await page.waitForSelector('h2:has-text("my habits")', { timeout: 15000 });
        console.log('✓ Page loaded\n');

        // Find rename buttons
        const renameButtons = await page.$$('button[title="Rename habit"]');
        console.log(`Found ${renameButtons.length} rename buttons`);

        if (renameButtons.length === 0) {
            console.log('⚠️  No habits found. Add a habit first.');
            await page.fill('input[placeholder*="Morning Run"]', 'Test Habit');
            await page.click('button:has-text("add habit")');
            await page.waitForTimeout(3000);
        }

        // Try to rename
        console.log('\n=== Testing Rename ===');
        const pencilButtons = await page.$$('button[title="Rename habit"]');

        if (pencilButtons.length > 0) {
            console.log('1. Clicking pencil icon...');
            await pencilButtons[0].click();
            await page.waitForTimeout(500);

            const editInput = await page.$('input.border-blue-400');
            if (editInput) {
                console.log('2. ✓ Edit mode activated');

                const currentValue = await editInput.inputValue();
                console.log(`   Current value: "${currentValue}"`);

                const newName = 'Renamed Habit ' + Date.now();
                console.log(`3. Typing new name: "${newName}"`);
                await editInput.fill(newName);
                await page.waitForTimeout(500);

                console.log('4. Clicking checkmark button...');
                const checkButton = await page.$('button[title="Save"]');
                if (checkButton) {
                    await checkButton.click();
                    console.log('5. Clicked checkmark');

                    // Wait for update
                    await page.waitForTimeout(2000);

                    // Check if name changed
                    const habitNames = await page.$$eval('h3.text-xl', els => els.map(el => el.textContent));
                    console.log('6. Current habit names:', habitNames);

                    if (habitNames.includes(newName)) {
                        console.log('✅ SUCCESS: Habit renamed!');
                    } else {
                        console.log('❌ FAILED: Name not updated');
                    }
                } else {
                    console.log('❌ Checkmark button not found');
                }
            } else {
                console.log('❌ Edit input not found');
            }
        }

        if (errors.length > 0) {
            console.log('\n🔥 ERRORS DETECTED:');
            errors.forEach(err => console.log('  -', err));
        }

        console.log('\nKeeping browser open for inspection...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('Test crashed:', error);
    } finally {
        await browser.close();
    }
})();
