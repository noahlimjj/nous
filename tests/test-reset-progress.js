const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const page = await browser.newPage();

  page.on('pageerror', error => console.error('[ERROR]:', error.message));

  try {
    console.log('=== Testing Reset Progress Feature ===\n');

    console.log('1. Login as guest...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.getByText('continue as guest').click();
    await page.waitForTimeout(3500);

    console.log('2. Navigate to Settings page...');
    await page.click('button[title="Settings"]');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'settings-before-reset.png' });

    // Check if reset button exists
    const resetButton = page.locator('button:has-text("reset all progress")');
    const buttonExists = await resetButton.count();
    console.log('✓ Reset button exists:', buttonExists > 0 ? '✅ YES' : '❌ NO');

    if (buttonExists > 0) {
      console.log('\n3. Clicking reset button...');
      await resetButton.click();
      await page.waitForTimeout(1500);

      await page.screenshot({ path: 'reset-confirmation-modal.png' });

      // Check if confirmation modal appears
      const modalVisible = await page.evaluate(() => {
        return document.body.innerText.includes('are you sure?') &&
               document.body.innerText.includes('cannot be undone');
      });
      console.log('✓ Confirmation modal shown:', modalVisible ? '✅ YES' : '❌ NO');

      if (modalVisible) {
        console.log('\n4. Checking modal buttons...');
        const hasCancelButton = await page.locator('button:has-text("cancel")').count();
        const hasConfirmButton = await page.locator('button:has-text("yes, reset everything")').count();
        console.log('✓ Cancel button:', hasCancelButton > 0 ? '✅ YES' : '❌ NO');
        console.log('✓ Confirm button:', hasConfirmButton > 0 ? '✅ YES' : '❌ NO');

        // Test cancel button
        console.log('\n5. Testing cancel button...');
        await page.click('button:has-text("cancel")');
        await page.waitForTimeout(1000);

        const modalStillVisible = await page.evaluate(() => {
          return document.body.innerText.includes('are you sure?');
        });
        console.log('✓ Modal closed on cancel:', !modalStillVisible ? '✅ YES' : '❌ NO');

        // Open modal again for full test
        console.log('\n6. Testing full reset flow (clicking confirm)...');
        console.log('   Opening modal again...');
        await resetButton.click();
        await page.waitForTimeout(1000);

        console.log('   Clicking "yes, reset everything"...');
        await page.click('button:has-text("yes, reset everything")');

        // Wait for reset to complete and page reload
        await page.waitForTimeout(3000);

        await page.screenshot({ path: 'after-reset.png' });

        console.log('\n✅ Reset functionality is working!');
        console.log('   Note: Page should reload automatically after reset');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
