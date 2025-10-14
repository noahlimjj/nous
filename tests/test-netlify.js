const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Listen for console messages
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}]:`, msg.text());
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR]:`, error.message);
  });

  try {
    console.log('Navigating to https://nousi.netlify.app/...');
    await page.goto('https://nousi.netlify.app/', { waitUntil: 'networkidle' });

    // Wait a bit to see if anything renders
    await page.waitForTimeout(3000);

    // Check what's in the DOM
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('\n[DOM CONTENT]:', bodyText ? bodyText.substring(0, 500) : 'EMPTY');

    // Check for any error divs
    const hasError = await page.evaluate(() => {
      const errorDiv = document.querySelector('[style*="color: red"], .error, [class*="error"]');
      return errorDiv ? errorDiv.innerText : null;
    });
    if (hasError) {
      console.log('\n[ERROR FOUND]:', hasError);
    }

    // Check if Firebase is loaded
    const firebaseStatus = await page.evaluate(() => {
      return {
        initializeApp: typeof window.initializeApp,
        config: window.__firebase_config,
        configDefined: typeof window.__firebase_config !== 'undefined'
      };
    });
    console.log('\n[FIREBASE STATUS]:', firebaseStatus);

    // Take screenshot
    await page.screenshot({ path: 'netlify-debug.png', fullPage: true });
    console.log('\nScreenshot saved to netlify-debug.png');

  } catch (error) {
    console.error('[TEST ERROR]:', error.message);
  }

  await browser.close();
})();
