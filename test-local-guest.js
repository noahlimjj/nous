const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();

  let errorCount = 0;
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('error') || text.includes('Error')) {
      console.log(`[BROWSER ${msg.type()}]:`, text);
      errorCount++;
    }
  });

  page.on('pageerror', error => {
    console.error(`[PAGE ERROR]:`, error.message);
    errorCount++;
  });

  try {
    console.log('1. Loading localhost...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    console.log('2. Clicking "continue as guest"...');
    const guestButton = page.getByText('continue as guest');
    await guestButton.click();
    await page.waitForTimeout(3000);

    const content = await page.evaluate(() => document.body.innerText);
    console.log('\n3. After login content:', content.substring(0, 400));

    const hasDashboard = content.includes('start studying') || content.includes('timer') || content.includes('dashboard');
    console.log('4. Dashboard visible:', hasDashboard);

    if (errorCount === 0) {
      console.log('\n✅ No errors detected!');
    } else {
      console.log(`\n⚠️  ${errorCount} errors detected`);
    }

    await page.screenshot({ path: 'local-guest-test.png', fullPage: true });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
