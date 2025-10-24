const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Go to the page
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(2000);

    // Continue as guest
    await page.click('button:has-text("continue as guest")');
    await page.waitForTimeout(500);

    // Type random username
    await page.fill('input[type="text"]', 'TestUser' + Math.floor(Math.random() * 1000));
    await page.waitForTimeout(500);

    // Submit
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    // Navigate to settings (last icon in nav)
    const navLinks = await page.locator('header nav a, header nav button').all();
    if (navLinks.length > 0) {
      await navLinks[navLinks.length - 1].click();
    }
    await page.waitForTimeout(1500);

    // Find and click dark mode button
    await page.locator('button').filter({ hasText: 'Dark Mode' }).click();
    await page.waitForTimeout(2000);

    // Go back to home (first nav icon)
    const navLinks2 = await page.locator('header nav a, header nav button').all();
    if (navLinks2.length > 0) {
      await navLinks2[0].click();
    }
    await page.waitForTimeout(1500);

    // Test color scheme
    const bodyClass = await page.evaluate(() => document.body.className);
    console.log('Body classes:', bodyClass);
    console.log('Dark mode active:', bodyClass.includes('night-mode'));

    // Check tree leaf colors
    const leafColor = await page.evaluate(() => {
      const leaf = document.querySelector('svg circle[fill]');
      if (leaf) {
        const computed = window.getComputedStyle(leaf);
        return {
          fill: leaf.getAttribute('fill'),
          computedFill: computed.fill,
          stroke: leaf.getAttribute('stroke'),
        };
      }
      return null;
    });
    console.log('Leaf colors:', leafColor);

    // Check moon color
    const moonColor = await page.evaluate(() => {
      const moon = document.querySelector('.circle-flow');
      if (moon) {
        const computed = window.getComputedStyle(moon);
        return {
          stroke: computed.stroke,
          fill: computed.fill,
        };
      }
      return null;
    });
    console.log('Moon colors:', moonColor);

    // Take screenshots
    await page.screenshot({ path: 'dark-mode-full.png', fullPage: true });
    console.log('Full page screenshot saved as dark-mode-full.png');

    // Take a screenshot of just the tree
    const treeElement = await page.locator('svg').first();
    if (await treeElement.count() > 0) {
      await treeElement.screenshot({ path: 'dark-mode-tree.png' });
      console.log('Tree screenshot saved as dark-mode-tree.png');
    }

    // Keep browser open for inspection
    console.log('\nBrowser will stay open for 15 seconds for inspection...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    await browser.close();
  }
})();
