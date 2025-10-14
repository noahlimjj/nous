const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const errors = [];
    const logs = [];

    // Capture console messages
    page.on('console', msg => {
        const text = msg.text();
        logs.push(text);
        if (msg.type() === 'error') {
            console.log('❌ CONSOLE ERROR:', text);
        } else {
            console.log('📝 CONSOLE:', text);
        }
    });

    // Capture page errors
    page.on('pageerror', err => {
        errors.push(err.message);
        console.log('🔥 PAGE ERROR:', err.message);
        console.log('   Stack:', err.stack);
    });

    try {
        console.log('Loading page...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

        console.log('\nWaiting 5 seconds for any errors to appear...');
        await page.waitForTimeout(5000);

        console.log('\n=== SUMMARY ===');
        console.log(`Total console messages: ${logs.length}`);
        console.log(`Total errors: ${errors.length}`);

        if (errors.length > 0) {
            console.log('\n🔥 ERRORS FOUND:');
            errors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
        } else {
            console.log('\n✓ No JavaScript errors detected');
        }

        console.log('\nKeeping browser open for inspection...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('Test crashed:', error);
    } finally {
        await browser.close();
    }
})();
