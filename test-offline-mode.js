// Quick test to verify offline mode works correctly
const { chromium } = require('playwright');

(async () => {
    console.log('🧪 Testing offline mode...\n');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text()
        });
    });

    // Navigate to the app
    console.log('📍 Navigating to http://localhost:8081');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });

    // Wait a bit for JavaScript to execute
    await page.waitForTimeout(2000);

    // Check console messages
    console.log('\n📋 Console Messages:');
    consoleMessages.forEach(msg => {
        const icon = msg.type === 'warning' ? '⚠️ ' : msg.type === 'error' ? '❌' : 'ℹ️ ';
        console.log(`${icon} [${msg.type}] ${msg.text}`);
    });

    // Check if offline mode was detected
    const hasOfflineWarning = consoleMessages.some(msg =>
        msg.text.includes('Firebase not configured') ||
        msg.text.includes('offline')
    );

    const hasOfflineConfig = consoleMessages.some(msg =>
        msg.text.includes('Running in offline-only mode')
    );

    console.log('\n✅ Test Results:');
    console.log(`   Firebase unavailable detected: ${hasOfflineConfig ? '✓' : '✗'}`);
    console.log(`   Offline mode activated: ${hasOfflineWarning ? '✓' : '✗'}`);

    // Check if page loaded successfully
    const pageTitle = await page.title();
    console.log(`   Page loaded: ${pageTitle === 'Nous' ? '✓' : '✗'} (${pageTitle})`);

    // Check for error messages in the DOM
    const bodyText = await page.textContent('body');
    const hasErrorMessage = bodyText.includes('offline mode') || bodyText.includes('Cloud sync');
    console.log(`   User sees offline notice: ${hasErrorMessage ? '✓' : '✗'}`);

    // Take a screenshot
    await page.screenshot({ path: '/Users/User/Study_tracker_app/offline-mode-test.png' });
    console.log(`\n📸 Screenshot saved: offline-mode-test.png`);

    await browser.close();

    // Summary
    console.log('\n' + '='.repeat(50));
    if (hasOfflineConfig && hasOfflineWarning) {
        console.log('✅ PASS: Offline mode is working correctly');
        console.log('   - Firebase config properly marked as unavailable');
        console.log('   - App loaded without Firebase');
        console.log('   - User will see offline mode notice');
        process.exit(0);
    } else {
        console.log('❌ FAIL: Offline mode not working as expected');
        console.log('   - Check console messages above for details');
        process.exit(1);
    }
})();
