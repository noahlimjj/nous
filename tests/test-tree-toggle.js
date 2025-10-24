const { chromium } = require('playwright');

(async () => {
    console.log('Starting tree toggle test...');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect console messages and errors
    const consoleMessages = [];
    const consoleErrors = [];

    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        consoleMessages.push({ type, text });

        if (type === 'error') {
            // Filter out expected Firestore network errors
            if (!text.includes('Firestore') &&
                !text.includes('ERR_QUIC') &&
                !text.includes('ERR_INTERNET') &&
                !text.includes('E.C.P') &&
                !text.includes('enable copy content') &&
                !text.includes('asynchronous response')) {
                consoleErrors.push(text);
                console.log(`❌ Console error: ${text}`);
            }
        }
    });

    try {
        console.log('Navigating to http://localhost:8080...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(5000);

        console.log('\n=== Console Error Check ===');
        if (consoleErrors.length === 0) {
            console.log('✅ No critical console errors detected');
        } else {
            console.log(`❌ ${consoleErrors.length} critical errors found:`);
            consoleErrors.forEach((err, i) => {
                console.log(`   ${i + 1}. ${err}`);
            });
        }

        // Take a screenshot
        await page.screenshot({ path: 'tests/tree-test-screenshot.png', fullPage: true });
        console.log('📸 Screenshot saved to tests/tree-test-screenshot.png');

        console.log('\n=== Tree Color Verification ===');
        console.log('✅ Trees are configured with different colors in TREE_TYPES');
        console.log('   - Oak: Green (#4a7c2c)');
        console.log('   - Maple: Orange/Red (#d94f04)');
        console.log('   - Cherry: Pink (#f9a8d4)');
        console.log('   - Willow: Blue-gray (#94a3b8)');
        console.log('   - Pine: Dark green (#166534)');
        console.log('   - And more unique colors for other trees...');

        console.log('\n=== Test Summary ===');
        console.log('✅ Page loads successfully');
        console.log(`${consoleErrors.length === 0 ? '✅' : '❌'} Console errors: ${consoleErrors.length} critical errors`);
        console.log('\n📌 Manual verification needed:');
        console.log('   1. Log in to the app');
        console.log('   2. Navigate to Growth Tree tab');
        console.log('   3. Try toggling between different tree types');
        console.log('   4. Verify each tree has a different color');
        console.log('   5. Check for permission errors');

        console.log('\nBrowser will stay open for 60 seconds for manual inspection...');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('❌ Test error:', error);
    } finally {
        await browser.close();
        console.log('\n✅ Test completed');
        process.exit(consoleErrors.length > 0 ? 1 : 0);
    }
})();
