const { chromium } = require('playwright');

(async () => {
    console.log('Starting tree color test...');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to http://localhost:8080...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Log in as guest
        console.log('Logging in as guest...');
        await page.click('text=continue as guest');
        await page.waitForTimeout(2000);

        // Enter username
        console.log('Entering username...');
        const usernameInput = await page.locator('input').first();
        await usernameInput.fill('TreeColorTester');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);

        // Wait for dashboard to load (Growth Tree is shown on main dashboard)
        console.log('Waiting for dashboard to load...');
        await page.waitForTimeout(5000);

        // Inject 1000 hours of study time via browser console
        console.log('Injecting 1000 hours of study sessions...');
        await page.evaluate(async () => {
            const db = window.db;
            const userId = window.userId;

            if (!db || !userId) {
                console.error('Database or userId not available');
                return;
            }

            // Create multiple sessions totaling 1000 hours
            const sessionsCol = window.collection(db, `artifacts/studyTrackerApp/users/${userId}/sessions`);

            // Add 100 sessions of 10 hours each
            for (let i = 0; i < 100; i++) {
                const startDate = new Date(2024, 0, i + 1, 9, 0); // Different days
                const endDate = new Date(startDate.getTime() + 10 * 60 * 60 * 1000); // 10 hours

                await window.addDoc(sessionsCol, {
                    habitId: 'test-habit',
                    topic: 'Study Session',
                    start: window.Timestamp.fromDate(startDate),
                    end: window.Timestamp.fromDate(endDate),
                    duration: 10 * 60 * 60 * 1000
                });
            }

            console.log('Added 1000 hours of sessions');
        });

        await page.waitForTimeout(3000);

        // Reload to see the updated tree
        console.log('Reloading page to show updated tree...');
        await page.reload();
        await page.waitForTimeout(5000);

        // Take screenshot of initial tree (should be Oak by default)
        console.log('Taking screenshot of initial tree...');
        await page.screenshot({ path: 'tests/tree-initial.png', fullPage: true });

        // Look for tree type buttons - they should be in the Growth Tree page
        console.log('\n=== Finding tree type buttons ===');
        const allButtons = await page.locator('button').all();
        const treeButtons = [];

        for (const button of allButtons) {
            const text = await button.textContent();
            if (text && (
                text.includes('Oak') || text.includes('Maple') || text.includes('Cherry') ||
                text.includes('Willow') || text.includes('Pine') || text.includes('Cypress') ||
                text.includes('Birch') || text.includes('Sakura') || text.includes('Baobab') ||
                text.includes('Magnolia') || text.includes('Redwood') || text.includes('Ginkgo') ||
                text.includes('Starry')
            )) {
                console.log(`Found tree button: ${text.trim()}`);
                treeButtons.push({ button, name: text.trim() });
            }
        }

        if (treeButtons.length === 0) {
            console.log('❌ No tree type buttons found. Checking for select dropdown...');
            const select = await page.locator('select').first();
            if (await select.count() > 0) {
                const options = await select.locator('option').all();
                console.log(`Found select with ${options.length} options`);
            }
        } else {
            console.log(`\n=== Testing ${treeButtons.length} tree types ===`);

            // Test first 5 tree types
            const treesToTest = treeButtons.slice(0, 5);

            for (const { button, name } of treesToTest) {
                console.log(`\nSwitching to: ${name}`);
                await button.click();
                await page.waitForTimeout(1500); // Wait for tree to render

                // Take screenshot
                const filename = `tests/tree-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
                await page.screenshot({ path: filename, fullPage: true });
                console.log(`📸 Saved screenshot: ${filename}`);

                // Check leaf colors in SVG
                const leafColors = await page.evaluate(() => {
                    const circles = document.querySelectorAll('circle');
                    const colors = new Set();
                    circles.forEach(circle => {
                        const fill = circle.getAttribute('fill');
                        if (fill && !fill.includes('#5A3E1B') && !fill.includes('#6B5947')) {
                            colors.add(fill);
                        }
                    });
                    return Array.from(colors);
                });

                console.log(`Leaf colors in ${name}: ${leafColors.join(', ')}`);
            }
        }

        // Take final screenshot showing the tree controls
        console.log('\n📸 Taking final screenshot...');
        await page.screenshot({ path: 'tests/tree-controls.png', fullPage: true });

        console.log('\n=== Manual inspection ===');
        console.log('Screenshots saved to tests/ directory');
        console.log('Browser will stay open for 30 seconds for visual inspection...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('❌ Test error:', error);
    } finally {
        await browser.close();
        console.log('\n✅ Test completed');
    }
})();
