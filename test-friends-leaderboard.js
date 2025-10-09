const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const page = await browser.newPage();

  page.on('pageerror', error => console.error(`[ERROR]:`, error.message));

  try {
    console.log('1. Login as guest...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.getByText('continue as guest').click();
    await page.waitForTimeout(3000);

    console.log('2. Looking for Friends button in navigation...');
    await page.screenshot({ path: 'step1-dashboard.png' });

    // Try to find Friends button
    const friendsBtn = page.locator('button:has-text("friends"), button:has-text("Friends")');
    const friendsCount = await friendsBtn.count();
    console.log(`   Found ${friendsCount} Friends buttons`);

    if (friendsCount > 0) {
      console.log('3. Clicking Friends button...');
      await friendsBtn.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'step2-friends.png' });

      const friendsContent = await page.evaluate(() => document.body.innerText);
      console.log('\n--- FRIENDS PAGE ---');
      console.log(friendsContent.substring(0, 600));
    } else {
      console.log('❌ Friends button not found');
    }

    // Try Leaderboard
    console.log('\n4. Looking for Leaderboard button...');
    const leaderboardBtn = page.locator('button:has-text("leaderboard"), button:has-text("Leaderboard")');
    const leaderboardCount = await leaderboardBtn.count();
    console.log(`   Found ${leaderboardCount} Leaderboard buttons`);

    if (leaderboardCount > 0) {
      console.log('5. Clicking Leaderboard button...');
      await leaderboardBtn.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'step3-leaderboard.png' });

      const leaderboardContent = await page.evaluate(() => document.body.innerText);
      console.log('\n--- LEADERBOARD PAGE ---');
      console.log(leaderboardContent.substring(0, 600));
    } else {
      console.log('❌ Leaderboard button not found');
    }

    console.log('\n✅ Test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
