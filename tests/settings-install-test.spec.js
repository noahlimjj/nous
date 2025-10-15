const { test, expect } = require('@playwright/test');

test.describe('Settings Page - Install Instructions', () => {
    test('should display install instructions in settings page', async ({ page }) => {
        await page.goto('http://localhost:8080');

        // Wait for app to load
        await page.waitForTimeout(2000);

        // Navigate to settings (assuming there's a settings button/link)
        const settingsButton = await page.locator('[title="Settings"]').first();
        if (await settingsButton.isVisible()) {
            await settingsButton.click();
            await page.waitForTimeout(1000);
        }

        // Check for the install app section heading
        const installHeading = await page.locator('text="install nous app"');
        await expect(installHeading).toBeVisible();
        console.log('✅ Install app heading visible');

        // Check for mobile instructions
        const mobileInstructions = await page.locator('text="📱 on mobile:"');
        await expect(mobileInstructions).toBeVisible();
        console.log('✅ Mobile instructions visible');

        // Check for desktop instructions
        const desktopInstructions = await page.locator('text="💻 on desktop:"');
        await expect(desktopInstructions).toBeVisible();
        console.log('✅ Desktop instructions visible');

        // Check for feature badges
        const offlineBadge = await page.locator('text="Works offline"');
        await expect(offlineBadge).toBeVisible();
        console.log('✅ "Works offline" badge visible');

        const fastBadge = await page.locator('text="Fast & responsive"');
        await expect(fastBadge).toBeVisible();
        console.log('✅ "Fast & responsive" badge visible');

        const syncBadge = await page.locator('text="Syncs across devices"');
        await expect(syncBadge).toBeVisible();
        console.log('✅ "Syncs across devices" badge visible');

        // Take a screenshot
        await page.screenshot({ path: 'test-results/settings-install-section.png', fullPage: true });
        console.log('✅ Screenshot saved to test-results/settings-install-section.png');
    });

    test('should have proper styling for install section', async ({ page }) => {
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Navigate to settings
        const settingsButton = await page.locator('[title="Settings"]').first();
        if (await settingsButton.isVisible()) {
            await settingsButton.click();
            await page.waitForTimeout(1000);
        }

        // Check the section has gradient background
        const installSection = await page.locator('text="install nous app"').locator('..');
        const hasGradient = await installSection.evaluate(el => {
            const styles = window.getComputedStyle(el.closest('.bg-gradient-to-br'));
            return styles.backgroundImage.includes('gradient');
        });

        expect(hasGradient).toBe(true);
        console.log('✅ Install section has gradient background');
    });
});
