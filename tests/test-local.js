const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[BROWSER ${msg.type()}]:`, msg.text()));
  page.on('pageerror', error => console.error(`[ERROR]:`, error.message));

  try {
    console.log('Testing local server at http://localhost:8080/...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('\n[SUCCESS] Page loaded! Content preview:', bodyText.substring(0, 200));

    const hasBabel = await page.evaluate(() => {
      return document.querySelector('script[src*="babel"]') !== null;
    });
    console.log('[BABEL CHECK]:', hasBabel ? '❌ Still present' : '✅ Removed');

    const firebaseStatus = await page.evaluate(() => ({
      initializeApp: typeof window.initializeApp,
      config: !!window.__firebase_config
    }));
    console.log('[FIREBASE]:', firebaseStatus);

    await page.screenshot({ path: 'local-test.png' });
    console.log('Screenshot: local-test.png');

  } catch (error) {
    console.error('[FAILED]:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
