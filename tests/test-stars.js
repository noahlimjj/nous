const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the app
    await page.goto('http://localhost:8080');
    console.log('✓ Navigated to app');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click "continue as guest"
    await page.click('text=continue as guest');
    console.log('✓ Clicked continue as guest');

    await page.waitForTimeout(1000);

    // Enter a random username
    const username = `testuser${Math.floor(Math.random() * 10000)}`;
    await page.fill('input[type="text"]', username);
    console.log(`✓ Entered username: ${username}`);

    await page.waitForTimeout(500);

    // Submit the form (look for button or press Enter)
    await page.press('input[type="text"]', 'Enter');
    console.log('✓ Submitted username');

    // Wait for the main app to load
    await page.waitForTimeout(3000);

    // Take screenshot of light mode
    await page.screenshot({ path: 'tests/light-mode.png', fullPage: true });
    console.log('✓ Screenshot of light mode saved');

    // Navigate to settings to toggle dark mode
    // Look for the user/settings icon in the header - try different approaches
    try {
      // First try clicking the last icon in header
      const icons = await page.locator('header a, header button').all();
      console.log(`Found ${icons.length} clickable elements in header`);

      // Click the last one (likely settings/user)
      await icons[icons.length - 1].click();
      console.log('✓ Clicked last header icon');
    } catch (e) {
      console.log('Trying alternative selector...');
      await page.click('header a:last-child, header button:last-child');
    }

    await page.waitForTimeout(1000);

    // Take screenshot to see where we are
    await page.screenshot({ path: 'tests/after-settings-click.png', fullPage: true });
    console.log('✓ Screenshot after settings click saved');

    // List all visible text on page
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('Page text includes:', pageText.substring(0, 500));

    // Scroll down to find the appearance section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Try to find and click Dark Mode button with different selectors
    const darkModeButton = await page.locator('button:has-text("Dark Mode"), text=Dark Mode').first();
    await darkModeButton.click();
    console.log('✓ Clicked Dark Mode button');

    await page.waitForTimeout(2000);

    // Take screenshot of dark mode
    await page.screenshot({ path: 'tests/dark-mode-stars.png', fullPage: true });
    console.log('✓ Screenshot of dark mode saved');

    // Check if night-mode class is applied to body
    const hasNightMode = await page.evaluate(() => {
      return document.body.classList.contains('night-mode');
    });
    console.log(`✓ Night mode active: ${hasNightMode}`);

    // Check computed styles of ::before pseudo-element
    const beforeStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body, '::before');
      return {
        content: styles.content,
        display: styles.display,
        position: styles.position,
        backgroundImage: styles.backgroundImage,
        zIndex: styles.zIndex,
        opacity: styles.opacity,
        visibility: styles.visibility
      };
    });
    console.log('::before pseudo-element styles:', JSON.stringify(beforeStyles, null, 2));

    // Check ::after pseudo-element
    const afterStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body, '::after');
      return {
        content: styles.content,
        display: styles.display,
        position: styles.position,
        backgroundImage: styles.backgroundImage,
        zIndex: styles.zIndex,
        opacity: styles.opacity,
        visibility: styles.visibility
      };
    });
    console.log('::after pseudo-element styles:', JSON.stringify(afterStyles, null, 2));

    // Keep browser open for manual inspection
    console.log('\nBrowser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'tests/error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
