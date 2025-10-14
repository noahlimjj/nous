const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 400
    });
    const page = await browser.newPage();

    const logs = [];
    page.on('console', msg => {
        const text = msg.text();
        logs.push(text);
        if (text.includes('Save button') || text.includes('handleRenameHabit') || text.includes('Habit document')) {
            console.log('🔍', text);
        }
    });
    page.on('pageerror', err => console.log('❌ ERROR:', err.message));

    try {
        console.log('=== Loading page ===');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        console.log('=== Logging in as guest ===');
        await page.click('button:has-text("continue as guest")');
        await page.waitForTimeout(3000);

        // Handle username modal
        console.log('=== Checking for username modal ===');
        const usernameInput = await page.$('input#username');
        if (usernameInput) {
            console.log('Username modal found, filling it in...');
            const username = 'testuser_' + Date.now();
            await usernameInput.fill(username);
            await page.click('button[type="submit"]:has-text("continue")');
            await page.waitForTimeout(3000);
        }

        console.log('=== Waiting for habits page ===');
        await page.waitForSelector('h2:has-text("my habits")');
        console.log('✓ On habits page');

        await page.waitForTimeout(2000);

        console.log('=== Checking for existing habits ===');
        let habits = await page.$$('h3.text-xl.text-gray-700');
        console.log(`Found ${habits.length} habits`);

        if (habits.length === 0) {
            console.log('Creating test habit...');
            await page.fill('input[placeholder*="Morning Run"]', 'My Test Habit');
            await page.click('button[type="submit"]:has-text("add habit")');
            await page.waitForTimeout(3000);
            habits = await page.$$('h3.text-xl.text-gray-700');
            console.log(`Now have ${habits.length} habits`);
        }

        const originalName = await habits[0].textContent();
        console.log(`Original name: "${originalName.trim()}"`);

        console.log('\n=== TESTING RENAME ===');
        console.log('1. Clicking pencil icon...');
        await page.click('button[title="Rename habit"]');
        await page.waitForTimeout(1000);

        const editInput = await page.$('input.border-blue-400');
        if (!editInput) {
            throw new Error('Edit input not found');
        }
        console.log('2. ✓ Edit input found');

        const newName = 'RENAMED_' + Date.now();
        console.log(`3. Typing new name: "${newName}"`);
        await editInput.click({ clickCount: 3 });
        await editInput.fill(newName);
        await page.waitForTimeout(500);

        console.log('4. Clicking save button...');
        logs.length = 0;
        await page.click('button[title="Save"]');
        console.log('   Clicked!');

        console.log('5. Waiting for update...');
        await page.waitForTimeout(5000);

        console.log('\n=== LOGS ===');
        const relevantLogs = logs.filter(log =>
            log.includes('Save') ||
            log.includes('handleRename') ||
            log.includes('Updating') ||
            log.includes('Error') ||
            log.includes('Habit document')
        );
        relevantLogs.forEach(log => console.log('  ', log));

        console.log('\n=== RESULT ===');
        const updatedNames = await page.$$eval('h3.text-xl.text-gray-700',
            els => els.map(el => el.textContent.trim())
        );
        console.log('Current names:', updatedNames);

        if (updatedNames.includes(newName)) {
            console.log('\n✅✅✅ SUCCESS! Rename works correctly! ✅✅✅\n');
        } else {
            console.log('\n❌❌❌ FAILED! Name was not updated ❌❌❌');
            console.log('Expected:', newName);
            console.log('Got:', updatedNames);
            console.log('\nAll console logs:');
            logs.forEach(log => console.log('  ', log));
        }

        console.log('\nKeeping browser open...');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log(error.stack);
    } finally {
        await browser.close();
    }
})();
