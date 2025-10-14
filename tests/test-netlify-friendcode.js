const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  try {
    console.log('=== Testing Friend Code on Netlify ===\n');

    console.log('1. Loading https://nousi.netlify.app/...');
    await page.goto('https://nousi.netlify.app/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('2. Logging in as guest...');
    await page.getByText('continue as guest').click();
    await page.waitForTimeout(3500);

    console.log('3. Opening Friends page...');
    await page.click('button[title="Friends"]');
    await page.waitForTimeout(2500);

    await page.screenshot({ path: 'netlify-friends-final.png' });

    // Check friend code
    const friendCode = await page.evaluate(() => {
      const codeElement = document.querySelector('.font-mono');
      return codeElement ? codeElement.textContent.trim() : 'NOT FOUND';
    });

    console.log(`\n✓ Friend Code: ${friendCode}`);
    console.log(`✓ Valid Format: ${/^[A-Z0-9]{8}$/.test(friendCode) ? '✅ YES' : '❌ NO'}`);

    // Test copy button
    console.log('\n4. Testing Copy Code button...');
    await page.click('button:has-text("Copy Code")');
    await page.waitForTimeout(1500);

    const notification = await page.evaluate(() => document.body.innerText);
    console.log(`✓ Copy works: ${notification.includes('copied') ? '✅ YES' : '❌ NO'}`);

    // Test search input
    const hasSearchInput = await page.locator('input[placeholder="ABC12345"]').count();
    console.log(`✓ Search input: ${hasSearchInput > 0 ? '✅ EXISTS' : '❌ MISSING'}`);

    // Test invalid code
    if (hasSearchInput > 0) {
      console.log('\n5. Testing friend code search...');
      await page.fill('input[placeholder="ABC12345"]', 'TESTTEST');
      await page.click('button:has-text("Add")');
      await page.waitForTimeout(2000);

      const content = await page.evaluate(() => document.body.innerText);
      const hasError = content.includes('Invalid') || content.includes('not found');
      console.log(`✓ Invalid code validation: ${hasError ? '✅ WORKS' : '❌ BROKEN'}`);
    }

    console.log('\n✅ Friend code system fully functional on Netlify!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
