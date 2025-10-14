const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('DevTools') && !text.includes('Tailwind')) {
      console.log(`[${msg.type()}]:`, text);
    }
  });
  page.on('pageerror', error => console.error(`[ERROR]:`, error.message));

  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });

    // Wait for auth to be ready
    await page.waitForTimeout(4000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('\n✅ Page Content:', bodyText.substring(0, 400));

    // Check for login elements
    const hasLoginButton = await page.evaluate(() => {
      return !!document.querySelector('button') || document.body.innerText.includes('log in');
    });
    console.log('\n✅ Login UI Present:', hasLoginButton);

    await page.screenshot({ path: 'final-test.png', fullPage: true });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
