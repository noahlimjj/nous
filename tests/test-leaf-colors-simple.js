const { chromium } = require('playwright');

(async () => {
    console.log('Testing leaf colors...');
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Login as guest
        await page.click('text=continue as guest');
        await page.waitForTimeout(2000);

        // Enter username
        const usernameInput = await page.locator('input').first();
        await usernameInput.fill('LeafColorTest');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);

        // Check what's in TREE_TYPES on the page
        const treeTypes = await page.evaluate(() => {
            if (window.TREE_TYPES) {
                return window.TREE_TYPES.map(t => ({
                    name: t.name,
                    leafColors: t.leafColors
                }));
            }
            return null;
        });

        if (treeTypes) {
            console.log('\n=== TREE_TYPES from page ===');
            treeTypes.forEach(tree => {
                console.log(`\n${tree.name}:`);
                console.log(`  Leaf colors: ${tree.leafColors.join(', ')}`);
            });
        } else {
            console.log('❌ TREE_TYPES not found in window');
        }

        // Check actual rendered leaf colors
        const renderedColors = await page.evaluate(() => {
            const leaves = document.querySelectorAll('circle[fill], ellipse[fill], polygon[fill], rect[fill], path[fill]');
            const colors = [];
            leaves.forEach(el => {
                const fill = el.getAttribute('fill');
                if (fill && fill.startsWith('#') && !fill.includes('#5A3E') && !fill.includes('#6B59')) {
                    colors.push(fill);
                }
            });
            return [...new Set(colors)].sort();
        });

        console.log('\n=== Currently rendered leaf colors ===');
        console.log(renderedColors.join(', '));
        console.log(`Total unique colors: ${renderedColors.length}`);

        console.log('\nBrowser will close in 30 seconds...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();
