const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', msg => console.log('[CONSOLE]', msg.text()));
    page.on('pageerror', err => console.log('[ERROR]', err.message));

    try {
        console.log('Loading page...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(5000);

        console.log('\n=== PAGE STATE ===');
        console.log('URL:', page.url());

        // Check what's visible on the page
        const bodyText = await page.evaluate(() => document.body.innerText);
        console.log('\nVisible text on page (first 500 chars):');
        console.log(bodyText.substring(0, 500));

        // Check for key elements
        const elements = await page.evaluate(() => {
            return {
                h1s: Array.from(document.querySelectorAll('h1')).map(el => el.textContent),
                h2s: Array.from(document.querySelectorAll('h2')).map(el => el.textContent),
                buttons: Array.from(document.querySelectorAll('button')).slice(0, 10).map(el => el.textContent),
                inputs: Array.from(document.querySelectorAll('input')).map(el => ({
                    type: el.type,
                    placeholder: el.placeholder
                }))
            };
        });

        console.log('\nH1 tags:', elements.h1s);
        console.log('H2 tags:', elements.h2s);
        console.log('First 10 buttons:', elements.buttons);
        console.log('Inputs:', elements.inputs);

        // Take screenshot
        await page.screenshot({ path: 'page-state.png', fullPage: true });
        console.log('\nScreenshot saved as page-state.png');

        console.log('\nKeeping browser open for 60 seconds...');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();
