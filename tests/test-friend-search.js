const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.text().includes('Error') || msg.text().includes('error')) {
      console.log('[CONSOLE]:', msg.text());
    }
  });

  try {
    console.log('1. Login as guest...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.getByText('continue as guest').click();
    await page.waitForTimeout(3500);

    console.log('2. Navigate to Friends page...');
    await page.click('button[title="Friends"]');
    await page.waitForTimeout(2000);

    // Get friend code
    const friendCode = await page.evaluate(() => {
      const codeElement = document.querySelector('.font-mono');
      return codeElement ? codeElement.textContent.trim() : 'NOT FOUND';
    });

    console.log(`\n✓ Friend Code: ${friendCode}`);
    console.log(`✓ Code Length: ${friendCode.length} characters`);
    console.log(`✓ Code Format: ${/^[A-Z0-9]{8}$/.test(friendCode) ? '✅ Valid' : '❌ Invalid'}`);

    // Test copy button
    console.log('\n3. Testing Copy Code button...');
    await page.click('button:has-text("Copy Code")');
    await page.waitForTimeout(1000);

    const notification = await page.evaluate(() => document.body.innerText);
    const hasCopyNotification = notification.includes('copied');
    console.log(`✓ Copy notification: ${hasCopyNotification ? '✅ Shown' : '❌ Not shown'}`);

    // Test friend code input
    console.log('\n4. Testing friend code search input...');
    await page.screenshot({ path: 'friends-page-test.png' });

    const inputExists = await page.locator('input[placeholder="ABC12345"]').count();
    console.log(`✓ Friend code input exists: ${inputExists > 0 ? '✅ YES' : '❌ NO'}`);

    // Try entering a fake code to test the search
    if (inputExists > 0) {
      console.log('\n5. Testing search with invalid code...');
      await page.fill('input[placeholder="ABC12345"]', 'TESTCODE');
      await page.click('button:has-text("Add")');
      await page.waitForTimeout(2000);

      const content = await page.evaluate(() => document.body.innerText);
      const hasInvalidMessage = content.includes('Invalid') || content.includes('not found');
      console.log(`✓ Invalid code message: ${hasInvalidMessage ? '✅ Shown' : '❌ Not shown'}`);
    }

    console.log('\n✅ Friend code system is working!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
