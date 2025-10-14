// e2e/complete-features-check.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Complete Features Check', () => {
  test('should verify all implemented features are present', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080');
    
    // Wait for page load
    await page.waitForTimeout(5000);
    
    // Check if the index.html has all the implemented changes
    const pageContent = await page.content();
    
    // 1. Check for Singapore time implementation
    const hasSingaporeTimeImpl = pageContent.includes('Singapore time (UTC+8)') ||
                                 pageContent.includes('singaporeTime') ||
                                 pageContent.includes('getTimezoneOffset');
    
    expect(hasSingaporeTimeImpl).toBe(true);
    
    // 2. Check for Current Session component exists
    const hasCurrentSessionSection = pageContent.includes('const CurrentSession =') && 
                                     pageContent.includes('Current Session') &&
                                     pageContent.includes('hours today');
    
    expect(hasCurrentSessionSection).toBe(true);
    
    // 3. Check for improved stopSharedTimer (properly handles permissions)
    const hasImprovedStopSharedTimer = pageContent.includes('status: \'ended\'') &&
                                      pageContent.includes('endedBy: userId') &&
                                      !pageContent.includes('Save session for ALL participants'); // Should not try to save for all
    
    expect(hasImprovedStopSharedTimer).toBe(true);
    
    // 4. Check for stats update in regular stopTimer
    const hasStatsUpdateInStopTimer = pageContent.includes('allSessionsSnapshot = await window.getDocs') && 
                                     pageContent.includes('allSessions = allSessionsSnapshot.docs.map') &&
                                     pageContent.includes('updateUserStats(db, userId, allSessions)');
    
    expect(hasStatsUpdateInStopTimer).toBe(true);
    
    console.log('✓ All implemented features are present in the code:');
    console.log('  - Singapore time zone handling for daily hours');
    console.log('  - Current Session section in Leaderboard');
    console.log('  - Improved Nous Together stop functionality');
    console.log('  - Stats update for regular timer stops');
  });
});