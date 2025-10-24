const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://localhost:8000');

    console.log('Waiting for page to load...');
    await page.waitForTimeout(3000);

    // Check if we're on the auth page
    const authPageVisible = await page.locator('text=log in or sign up').isVisible().catch(() => false);

    if (authPageVisible) {
        console.log('Signing in as guest...');
        await page.click('button:has-text("continue as guest")');
        await page.waitForTimeout(2000);
    }

    console.log('Looking for Growth Tree section...');
    await page.waitForSelector('text=my tree', { timeout: 10000 });

    // Wait for tree to render
    await page.waitForTimeout(2000);

    // Get initial tree colors
    console.log('\n=== Testing Tree Color Changes ===\n');

    const trees = ['Oak', 'Maple', 'Cherry'];

    for (const treeName of trees) {
        console.log(`\nSwitching to ${treeName}...`);

        // Click the tree button
        const treeButton = page.locator(`button:has-text("${treeName}")`).first();
        await treeButton.click();
        await page.waitForTimeout(1000);

        // Get leaf colors from the SVG
        const leafColors = await page.evaluate(() => {
            const leaves = document.querySelectorAll('ellipse[fill^="#"], circle[fill^="#"], polygon[fill^="#"]');
            const colors = new Set();
            leaves.forEach(leaf => {
                const fill = leaf.getAttribute('fill');
                if (fill && fill.startsWith('#') && fill.length === 7) {
                    colors.add(fill);
                }
            });
            return Array.from(colors).sort();
        });

        console.log(`  ${treeName} leaf colors: ${leafColors.join(', ')}`);
        console.log(`  Unique colors found: ${leafColors.length}`);

        // Take a screenshot
        await page.screenshot({
            path: `tests/tree-${treeName.toLowerCase()}-fix.png`,
            fullPage: false
        });
    }

    console.log('\n=== Test Complete ===');
    console.log('Screenshots saved to tests/ directory');
    console.log('\nKeeping browser open for 10 seconds for manual inspection...');

    await page.waitForTimeout(10000);

    await browser.close();
})();
