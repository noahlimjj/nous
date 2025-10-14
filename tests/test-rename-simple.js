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
        if (text.includes('Save button') || text.includes('handleRenameHabit') || text.includes('Updating habit')) {
            console.log('🔍', text);
        }
    });
    page.on('pageerror', err => console.log('❌', err.message));

    try {
        console.log('Loading page and logging in as guest...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        await page.click('button:has-text("continue as guest")');
        await page.waitForTimeout(3000);

        console.log('Waiting for habits page...');
        await page.waitForSelector('h2:has-text("my habits")');

        // Close welcome modal if it exists
        const modalClose = await page.$('button:has-text("got it")');
        if (modalClose) {
            console.log('Closing welcome modal...');
            await modalClose.click();
            await page.waitForTimeout(1000);
        }

        console.log('Checking for habits...');
        let habits = await page.$$('h3.text-xl.text-gray-700');
        console.log(`Found ${habits.length} habits`);

        if (habits.length === 0) {
            console.log('Creating a test habit...');
            await page.fill('input[placeholder*="Morning Run"]', 'My Test Habit');
            await page.click('button[type="submit"]:has-text("add habit")');
            await page.waitForTimeout(3000);
            habits = await page.$$('h3.text-xl.text-gray-700');
            console.log(`Now have ${habits.length} habits`);
        }

        const habitName = await habits[0].textContent();
        console.log(`\nOriginal habit name: "${habitName.trim()}"`);

        console.log('\n=== STARTING RENAME TEST ===');

        console.log('1. Clicking pencil icon...');
        await page.click('button[title="Rename habit"]');
        await page.waitForTimeout(800);

        console.log('2. Checking for edit input...');
        const editInput = await page.$('input.border-blue-400');
        if (!editInput) {
            console.log('❌ Edit input not found!');
            throw new Error('Edit input not found');
        }
        console.log('✓ Edit input found');

        const newName = 'RENAMED_TEST_' + Date.now();
        console.log(`3. Typing new name: "${newName}"`);
        await editInput.click({ clickCount: 3 });
        await editInput.fill(newName);
        await page.waitForTimeout(500);

        console.log('4. Clicking save button...');
        logs.length = 0; // Clear logs
        await page.click('button[title="Save"]');
        console.log('   Save button clicked!');

        console.log('5. Waiting for update...');
        await page.waitForTimeout(4000);

        console.log('\n=== CONSOLE LOGS FROM SAVE ===');
        logs.forEach(log => console.log('   ', log));

        console.log('\n6. Checking if name changed...');
        const updatedHabits = await page.$$eval('h3.text-xl.text-gray-700',
            els => els.map(el => el.textContent.trim())
        );
        console.log('   Current names:', updatedHabits);

        if (updatedHabits.includes(newName)) {
            console.log('\n✅✅✅ SUCCESS! Rename works! ✅✅✅');
        } else {
            console.log('\n❌❌❌ FAILED! Name not updated ❌❌❌');
            console.log('Expected:', newName);
            console.log('Got:', updatedHabits);
        }

        console.log('\nKeeping browser open for inspection...');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await browser.close();
    }
})();
