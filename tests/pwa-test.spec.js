const { test, expect } = require('@playwright/test');

test.describe('PWA Installation Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080');
    });

    test('should have manifest link', async ({ page }) => {
        const manifestLink = await page.locator('link[rel="manifest"]');
        await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
        console.log('✅ Manifest link found in HTML');
    });

    test('should have theme color meta tag', async ({ page }) => {
        const themeColor = await page.locator('meta[name="theme-color"]');
        await expect(themeColor).toHaveAttribute('content', '#5d6b86');
        console.log('✅ Theme color meta tag found');
    });

    test('should have apple mobile web app meta tags', async ({ page }) => {
        const appleMeta = await page.locator('meta[name="apple-mobile-web-app-capable"]');
        await expect(appleMeta).toHaveAttribute('content', 'yes');
        console.log('✅ Apple mobile web app meta tags found');
    });

    test('should register service worker', async ({ page }) => {
        // Wait for service worker registration
        await page.waitForTimeout(2000);

        const swRegistered = await page.evaluate(async () => {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                return registration !== undefined;
            }
            return false;
        });

        expect(swRegistered).toBe(true);
        console.log('✅ Service Worker registered successfully');
    });

    test('should have manifest.json accessible', async ({ page }) => {
        const response = await page.goto('http://localhost:8080/manifest.json');
        expect(response.status()).toBe(200);

        const manifest = await response.json();
        expect(manifest.name).toBe('Nous - Study Tracker');
        expect(manifest.short_name).toBe('Nous');
        expect(manifest.theme_color).toBe('#5d6b86');
        expect(manifest.icons.length).toBe(8);
        console.log('✅ Manifest.json accessible and valid');
    });

    test('should have service-worker.js accessible', async ({ page }) => {
        const response = await page.goto('http://localhost:8080/service-worker.js');
        expect(response.status()).toBe(200);

        const content = await response.text();
        expect(content).toContain('install');
        expect(content).toContain('activate');
        expect(content).toContain('fetch');
        console.log('✅ Service Worker file accessible and valid');
    });

    test('should have all icon files accessible', async ({ page }) => {
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        let allIconsExist = true;

        for (const size of sizes) {
            const response = await page.goto(`http://localhost:8080/icons/icon-${size}x${size}.png`);
            if (response.status() !== 200) {
                console.log(`❌ Icon ${size}x${size} not accessible`);
                allIconsExist = false;
            } else {
                console.log(`✅ Icon ${size}x${size} accessible`);
            }
        }

        expect(allIconsExist).toBe(true);
    });

    test('should show install button when beforeinstallprompt fires', async ({ page }) => {
        // Check if install button logic exists in the page
        const hasInstallPromptLogic = await page.evaluate(() => {
            const scriptContent = Array.from(document.scripts)
                .map(script => script.textContent)
                .join('');
            return scriptContent.includes('beforeinstallprompt') &&
                   scriptContent.includes('installButton');
        });

        expect(hasInstallPromptLogic).toBe(true);
        console.log('✅ Install prompt logic present');
    });

    test('should detect standalone mode', async ({ page }) => {
        const hasStandaloneDetection = await page.evaluate(() => {
            const scriptContent = Array.from(document.scripts)
                .map(script => script.textContent)
                .join('');
            return scriptContent.includes('display-mode: standalone');
        });

        expect(hasStandaloneDetection).toBe(true);
        console.log('✅ Standalone mode detection present');
    });

    test('should have proper viewport for mobile', async ({ page }) => {
        const viewport = await page.locator('meta[name="viewport"]');
        await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1.0');
        console.log('✅ Mobile viewport configured correctly');
    });
});
