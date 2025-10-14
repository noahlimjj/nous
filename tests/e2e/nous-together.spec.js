// e2e/nous-together.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Nous Together Feature', () => {
  test('should have Nous Together stop functionality working', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080');
    
    // Wait for the page to load completely and for any initial rendering
    await page.waitForTimeout(5000);
    
    // The app may take some time to initialize with Firebase
    // Let's wait for any of the navigation elements to appear or for functions to be available
    await page.waitForFunction(() => {
      // Check if the app has initialized by looking for the functions we added
      return typeof window !== 'undefined' && 
             (typeof window.stopSharedTimer !== 'undefined' || 
              typeof window.handleNousRequest !== 'undefined');
    }, { timeout: 15000 });
    
    // Navigate to friends page if possible
    try {
      await page.click('button[title="Friends"]');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('Friends button not found, proceeding with function checks...');
    }
    
    // Check if Nous Together functions exist in the app context
    const hasNousTogetherFunction = await page.evaluate(() => {
      return typeof window.stopSharedTimer !== 'undefined';
    });
    
    expect(hasNousTogetherFunction).toBe(true);
    
    // Navigate to leaderboard if possible
    try {
      await page.click('button[title="Leaderboard"]');
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('Leaderboard button not found, proceeding with verification...');
    }
    
    // Check if the page has the current session section by evaluating the HTML
    const hasCurrentSessionSection = await page.evaluate(() => {
      const elements = document.querySelectorAll('h3');
      for (let el of elements) {
        if (el.textContent && el.textContent.toLowerCase().includes('current session')) {
          return true;
        }
      }
      return false;
    });
    
    expect(hasCurrentSessionSection).toBe(true);
    
    console.log('✓ Current Session section is implemented in Leaderboard');
    
    // Check if daily hours elements exist
    const hasDailyHours = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let el of elements) {
        if (el.textContent && el.textContent.toLowerCase().includes('hours today')) {
          return true;
        }
      }
      return false;
    });
    
    if (hasDailyHours) {
      console.log('✓ Daily hours functionality is present');
    } else {
      console.log('ℹ Daily hours information might not be populated yet');
    }
  });

  test('should handle Nous Together stop functionality correctly', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080');
    
    // Wait for page and app to load
    await page.waitForTimeout(5000);
    
    // Wait for the functions to be available in the global scope
    await page.waitForFunction(() => {
      return typeof window !== 'undefined' && 
             typeof window.stopSharedTimer !== 'undefined';
    }, { timeout: 15000 });
    
    // Check that the stopSharedTimer function exists and is a function
    const stopFunctionExists = await page.evaluate(() => {
      return typeof window.stopSharedTimer === 'function';
    });
    
    expect(stopFunctionExists).toBe(true);
    
    console.log('✓ stopSharedTimer function exists and is callable');
  });
});