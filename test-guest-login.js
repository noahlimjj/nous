const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('DevTools') && !text.includes('Tailwind')) {
      console.log(`[BROWSER ${msg.type()}]:`, text);
    }
  });

  page.on('pageerror', error => {
    console.error(`[PAGE ERROR]:`, error.message);
  });

  try {
    console.log('1. Loading https://nousi.netlify.app/...');
    await page.goto('https://nousi.netlify.app/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('2. Looking for guest login button...');
    await page.screenshot({ path: 'step1-login-page.png' });

    // Find and click "continue as guest" button
    const guestButton = await page.getByText('continue as guest', { exact: false });
    if (guestButton) {
      console.log('3. Clicking "continue as guest"...');
      await guestButton.click();
      await page.waitForTimeout(3000); // Wait for auth to complete
    } else {
      console.error('❌ Guest button not found!');
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('Page content:', bodyText.substring(0, 500));
    }

    console.log('4. Checking if logged in...');
    await page.screenshot({ path: 'step2-after-login.png' });

    const afterLoginContent = await page.evaluate(() => document.body.innerText);
    console.log('Content after login:', afterLoginContent.substring(0, 500));

    // Check for dashboard elements
    const hasDashboard = await page.evaluate(() => {
      return document.body.innerText.includes('dashboard') ||
             document.body.innerText.includes('timer') ||
             document.body.innerText.includes('study');
    });
    console.log('5. Dashboard visible:', hasDashboard);

    // Try to navigate to Friends page
    console.log('6. Looking for Friends button...');
    const friendsButton = page.getByRole('button', { name: /friends/i });
    if (await friendsButton.count() > 0) {
      console.log('7. Clicking Friends button...');
      await friendsButton.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'step3-friends-page.png' });

      const friendsContent = await page.evaluate(() => document.body.innerText);
      console.log('Friends page content:', friendsContent.substring(0, 500));
    } else {
      console.log('❌ Friends button not found');
    }

    // Try to navigate to Leaderboard page
    console.log('8. Looking for Leaderboard button...');
    const leaderboardButton = page.getByRole('button', { name: /leaderboard/i });
    if (await leaderboardButton.count() > 0) {
      console.log('9. Clicking Leaderboard button...');
      await leaderboardButton.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'step4-leaderboard-page.png' });

      const leaderboardContent = await page.evaluate(() => document.body.innerText);
      console.log('Leaderboard page content:', leaderboardContent.substring(0, 500));
    } else {
      console.log('❌ Leaderboard button not found');
    }

    console.log('\n✅ Test complete! Check screenshots for visual verification.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
  }

  await browser.close();
  process.exit(0);
})();
