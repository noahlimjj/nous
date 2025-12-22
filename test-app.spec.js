const { test, expect } = require('@playwright/test');

test('Test default habits and offline mode', async ({ page, context }) => {
  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  // Navigate to the app
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  
  // Wait for the page to load
  await page.waitForTimeout(2000);
  
  // Check if we can see the page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if Firebase is available or offline mode is active
  const firebaseAvailable = await page.evaluate(() => {
    return window.__isFirebaseAvailable;
  });
  console.log('Firebase available:', firebaseAvailable);
  
  // Take a screenshot
  await page.screenshot({ path: 'app-state.png' });
  console.log('Screenshot saved: app-state.png');
  
  // Check for any visible habits (if logged in as guest or with data)
  await page.waitForTimeout(2000);
  
  // Try to find habit elements
  const habitElements = await page.$$('[class*="habit"]');
  console.log('Number of habit-related elements found:', habitElements.length);
  
  // Check body text for any habits
  const bodyText = await page.textContent('body');
  const hasStudy = bodyText.includes('Study') || bodyText.includes('study');
  const hasExercise = bodyText.includes('Exercise') || bodyText.includes('exercise');
  console.log('Contains "Study":', hasStudy);
  console.log('Contains "Exercise":', hasExercise);
  
  // Test offline mode by going offline
  await context.setOffline(true);
  console.log('Offline mode enabled');
  
  // Wait and check if app still works
  await page.waitForTimeout(2000);
  const offlineBodyText = await page.textContent('body');
  console.log('App still accessible offline:', offlineBodyText.length > 0);
  
  // Take offline screenshot
  await page.screenshot({ path: 'app-offline.png' });
  console.log('Offline screenshot saved: app-offline.png');
});
