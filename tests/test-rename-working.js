const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 300
    });
    const page = await browser.newPage();

    const logs = [];
    page.on('console', msg => {
        const text = msg.text();
        logs.push(text);
        console.log('[CONSOLE]', text);
    });
    page.on('pageerror', err => console.log('[ERROR]', err.message));

    try {
        console.log('=== Loading page ===');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        console.log('\n=== Logging in as guest ===');
        const guestButton = await page.$('button:has-text("continue as guest")');
        if (guestButton) {
            await guestButton.click();
            console.log('Clicked guest login');
            await page.waitForTimeout(3000);
        }

        console.log('\n=== Waiting for habits page ===');
        await page.waitForSelector('h2:has-text("my habits")', { timeout: 10000 });
        console.log('✓ Habits page loaded');

        await page.waitForTimeout(2000);

        console.log('\n=== Checking for habits ===');
        let habitNames = await page.$$eval('h3.text-xl.text-gray-700', els => els.map(el => el.textContent.trim()));
        console.log('Current habits:', habitNames);

        if (habitNames.length === 0) {
            console.log('No habits, creating test habit...');
            await page.fill('input[placeholder*="Morning Run"]', 'Test Habit');
            await page.click('button:has-text("add habit")');
            await page.waitForTimeout(3000);
            habitNames = await page.$$eval('h3.text-xl.text-gray-700', els => els.map(el => el.textContent.trim()));
            console.log('After creating:', habitNames);
        }

        console.log('\n=== Finding rename button ===');
        const renameButtons = await page.$$('button[title="Rename habit"]');
        console.log(`Found ${renameButtons.length} rename buttons`);

        console.log('\n=== Clicking rename button ===');
        await renameButtons[0].click();
        await page.waitForTimeout(1000);

        const editInput = await page.$('input.border-blue-400');
        if (!editInput) {
            throw new Error('Edit input not found');
        }
        console.log('✓ Edit mode activated');

        const currentValue = await editInput.inputValue();
        console.log('Current value:', currentValue);

        console.log('\n=== Entering new name ===');
        const newName = 'RENAMED_' + Date.now();
        console.log('New name:', newName);

        await editInput.click({ clickCount: 3 }); // Select all
        await editInput.fill(newName);
        await page.waitForTimeout(500);

        console.log('Value after typing:', await editInput.inputValue());

        console.log('\n=== Clicking save button ===');
        logs.length = 0; // Clear to see logs from save

        const saveButton = await page.$('button[title="Save"]');
        await saveButton.click();
        console.log('Save button clicked');

        await page.waitForTimeout(4000);

        console.log('\n=== Logs from save ===');
        logs.forEach(log => console.log('  ', log));

        console.log('\n=== Checking if name updated ===');
        const updatedNames = await page.$$eval('h3.text-xl.text-gray-700', els => els.map(el => el.textContent.trim()));
        console.log('Names after save:', updatedNames);

        if (updatedNames.includes(newName)) {
            console.log('\n✅✅✅ SUCCESS! Habit renamed to:', newName);
        } else {
            console.log('\n❌❌❌ FAILED! Name not updated');
            console.log('Expected:', newName);
            console.log('Got:', updatedNames);

            // Check if still in edit mode
            const stillEditing = await page.$('input.border-blue-400');
            if (stillEditing) {
                console.log('⚠️  Still in edit mode - save may not have worked');
            }
        }

        console.log('\n=== Keeping browser open ===');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
