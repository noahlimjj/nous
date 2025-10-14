const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  let errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error(`[ERROR]:`, error.message);
  });

  try {
    console.log('1. Loading https://nousi.netlify.app/...');
    await page.goto('https://nousi.netlify.app/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('2. Clicking "continue as guest"...');
    await page.getByText('continue as guest').click();
    await page.waitForTimeout(4000);

    await page.screenshot({ path: 'netlify-after-login.png', fullPage: true });

    const content = await page.evaluate(() => document.body.innerText);
    console.log('\n--- AFTER LOGIN ---');
    console.log(content.substring(0, 500));

    const hasDashboard = content.includes('my habits') || content.includes('My Tree');
    console.log('\n✓ Dashboard visible:', hasDashboard ? '✅ YES' : '❌ NO');

    if (hasDashboard) {
      console.log('\n3. Testing Friends page...');
      await page.click('button[title="Friends"]');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'netlify-friends.png' });

      const friendsContent = await page.evaluate(() => document.body.innerText);
      const hasFriendCode = friendsContent.includes('friend code');
      console.log('✓ Friends page loads:', hasFriendCode ? '✅ YES' : '❌ NO');

      console.log('\n4. Testing Leaderboard page...');
      await page.click('button[title="Leaderboard"]');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'netlify-leaderboard.png' });

      const leaderboardContent = await page.evaluate(() => document.body.innerText);
      const hasLeaderboard = leaderboardContent.includes('Total Hours');
      console.log('✓ Leaderboard page loads:', hasLeaderboard ? '✅ YES' : '❌ NO');
    }

    console.log('\n--- ERRORS ---');
    if (errors.length === 0) {
      console.log('✅ No page errors!');
    } else {
      console.log(`Found ${errors.length} errors:`);
      errors.forEach((err, i) => console.log(`  ${i+1}. ${err.substring(0, 100)}`));
    }

    console.log('\n✅ Test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
