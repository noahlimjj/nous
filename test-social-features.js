const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  page.on('pageerror', error => console.error(`[ERROR]:`, error.message));

  try {
    console.log('1. Login as guest...');
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.getByText('continue as guest').click();
    await page.waitForTimeout(3500);

    console.log('2. Dashboard loaded, taking screenshot...');
    await page.screenshot({ path: 'test-1-dashboard.png', fullPage: true });

    // Click Friends button (by title attribute)
    console.log('3. Clicking Friends button...');
    await page.click('button[title="Friends"]');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-2-friends.png', fullPage: true });

    const friendsContent = await page.evaluate(() => document.body.innerText);
    console.log('\n--- FRIENDS PAGE ---');
    console.log(friendsContent.substring(0, 700));

    const hasFriendCode = friendsContent.includes('Friend Code') || friendsContent.includes('friend code');
    const hasSearchInput = friendsContent.includes('Search') || friendsContent.includes('username');
    console.log('\n✓ Has Friend Code display:', hasFriendCode);
    console.log('✓ Has Search functionality:', hasSearchInput);

    // Click Leaderboard button
    console.log('\n4. Clicking Leaderboard button...');
    await page.click('button[title="Leaderboard"]');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-3-leaderboard.png', fullPage: true });

    const leaderboardContent = await page.evaluate(() => document.body.innerText);
    console.log('\n--- LEADERBOARD PAGE ---');
    console.log(leaderboardContent.substring(0, 700));

    const hasMetricButtons = leaderboardContent.includes('Total Hours') || leaderboardContent.includes('Streak');
    const hasRankings = leaderboardContent.includes('Your Rank') || leaderboardContent.includes('rank');
    console.log('\n✓ Has Metric Selector:', hasMetricButtons);
    console.log('✓ Has Rankings display:', hasRankings);

    console.log('\n✅ All tests complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-error.png' });
  }

  await browser.close();
  process.exit(0);
})();
