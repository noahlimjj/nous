const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 500 // Slow down actions to see what's happening
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect all console output
    const consoleLogs = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleLogs.push({ type: msg.type(), text });
        console.log(`[${msg.type().toUpperCase()}]`, text);
    });

    page.on('pageerror', err => {
        console.log('🔥 PAGE ERROR:', err.message);
        consoleLogs.push({ type: 'error', text: err.message });
    });

    try {
        console.log('=== STEP 1: Loading page ===');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(3000);

        console.log('\n=== STEP 2: Checking login status ===');
        const loginButton = await page.$('button:has-text("sign in with google")');
        if (loginButton) {
            console.log('⚠️  Not logged in. Please login manually.');
            console.log('Waiting 45 seconds for you to login...');
            await page.waitForTimeout(45000);
        } else {
            console.log('✓ Already logged in');
        }

        console.log('\n=== STEP 3: Waiting for habits page ===');
        try {
            await page.waitForSelector('h2:has-text("my habits")', { timeout: 10000 });
            console.log('✓ Habits page loaded');
        } catch (e) {
            console.log('❌ Could not find habits page');
            console.log('Current URL:', page.url());
            const h2s = await page.$$eval('h2', els => els.map(el => el.textContent));
            console.log('H2 tags found:', h2s);
            throw e;
        }

        await page.waitForTimeout(2000);

        console.log('\n=== STEP 4: Checking for habits ===');
        let habitNames = await page.$$eval('h3.text-xl', els => els.map(el => el.textContent));
        console.log('Current habits:', habitNames);

        if (habitNames.length === 0) {
            console.log('No habits found. Creating one...');
            await page.fill('input[placeholder*="Morning Run"]', 'Original Name');
            await page.click('button:has-text("add habit")');
            await page.waitForTimeout(3000);
            habitNames = await page.$$eval('h3.text-xl', els => els.map(el => el.textContent));
            console.log('After creating habit:', habitNames);
        }

        console.log('\n=== STEP 5: Finding rename button ===');
        const renameButtons = await page.$$('button[title="Rename habit"]');
        console.log(`Found ${renameButtons.length} rename buttons`);

        if (renameButtons.length === 0) {
            console.log('❌ No rename buttons found!');
            const allButtons = await page.$$eval('button', buttons =>
                buttons.map(b => ({ title: b.getAttribute('title'), text: b.textContent }))
            );
            console.log('All buttons:', allButtons);
            throw new Error('No rename buttons');
        }

        console.log('\n=== STEP 6: Clicking first rename button ===');
        await renameButtons[0].click();
        await page.waitForTimeout(1000);

        console.log('\n=== STEP 7: Checking edit mode activated ===');
        const editInput = await page.$('input.border-blue-400');
        if (!editInput) {
            console.log('❌ Edit input not found!');
            const allInputs = await page.$$eval('input', inputs =>
                inputs.map(i => ({
                    type: i.type,
                    className: i.className,
                    value: i.value
                }))
            );
            console.log('All inputs:', allInputs);
            throw new Error('Edit input not found');
        }
        console.log('✓ Edit input found');

        const currentValue = await editInput.inputValue();
        console.log('Current value:', currentValue);

        console.log('\n=== STEP 8: Typing new name ===');
        const newName = 'RENAMED_' + Date.now();
        console.log('New name will be:', newName);

        // Clear and type new name
        await editInput.click();
        await editInput.fill('');
        await editInput.type(newName);
        await page.waitForTimeout(500);

        const typedValue = await editInput.inputValue();
        console.log('Value after typing:', typedValue);

        console.log('\n=== STEP 9: Looking for save button ===');
        const saveButton = await page.$('button[title="Save"]');
        if (!saveButton) {
            console.log('❌ Save button not found!');
            const editButtons = await page.$$eval('button', buttons =>
                buttons.map(b => ({
                    title: b.getAttribute('title'),
                    className: b.className
                }))
            );
            console.log('All buttons near edit:', editButtons);
            throw new Error('Save button not found');
        }
        console.log('✓ Save button found');

        console.log('\n=== STEP 10: Clicking save button ===');
        consoleLogs.length = 0; // Clear logs to see what happens on click
        await saveButton.click();
        console.log('Save button clicked');

        console.log('\n=== STEP 11: Waiting for update ===');
        await page.waitForTimeout(3000);

        console.log('\n=== STEP 12: Checking console logs ===');
        console.log('Console logs after save click:');
        consoleLogs.forEach(log => {
            console.log(`  [${log.type}] ${log.text}`);
        });

        console.log('\n=== STEP 13: Verifying name changed ===');
        const updatedNames = await page.$$eval('h3.text-xl', els => els.map(el => el.textContent));
        console.log('Names after save:', updatedNames);

        if (updatedNames.includes(newName)) {
            console.log('✅ SUCCESS! Habit was renamed to:', newName);
        } else {
            console.log('❌ FAILED! Name was not updated');
            console.log('Expected:', newName);
            console.log('Got:', updatedNames);
        }

        console.log('\n=== Keeping browser open for inspection ===');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('Stack:', error.stack);
    } finally {
        await browser.close();
    }
})();
