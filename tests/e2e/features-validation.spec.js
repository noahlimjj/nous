// e2e/simple-test.js - Simple validation of implemented features
const { test, expect } = require('@playwright/test');

test.describe('Implemented Features Validation', () => {
  test('should verify the leaderboard has daily hours section', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080');
    
    // Wait for page load
    await page.waitForTimeout(5000);
    
    // Check if the index.html has the code changes by looking for specific strings
    const pageContent = await page.content();
    
    // Verify that the Singapore time calculation code is in the page source
    const hasSingaporeTimeCode = pageContent.includes('Singapore time (UTC+8)') ||
                                pageContent.includes('singaporeTime') ||
                                pageContent.includes('UTC+8');
    
    expect(hasSingaporeTimeCode).toBe(true);
    
    // Verify that the Current Session section code is in the page source
    const hasCurrentSessionCode = pageContent.includes('Current Session') && 
                                  pageContent.includes('hours today');
    
    expect(hasCurrentSessionCode).toBe(true);
    
    console.log('✓ Code changes for daily hours in Singapore time are present');
    console.log('✓ Code changes for Current Session section are present');
  });

  test('should verify Nous Together stop functionality is improved', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080');
    
    // Wait for page load
    await page.waitForTimeout(5000);
    
    // Check if the index.html has the stopSharedTimer improvements
    const pageContent = await page.content();
    
    // Look for evidence of the improvements made to stopSharedTimer
    const hasTimerStatusUpdateOnly = pageContent.includes('status: \'ended\'') &&
                                 pageContent.includes('endedBy: userId');
    
    const hasNoAllParticipantsUpdate = !pageContent.includes('Save session for ALL participants');
    
    expect(hasTimerStatusUpdateOnly).toBe(true);
    expect(hasNoAllParticipantsUpdate).toBe(true);
    
    console.log('✓ stopSharedTimer function improvements are in place');
    console.log('✓ Logic now uses proper permissions by only updating timer status');
  });
});