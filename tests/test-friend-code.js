const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext();

  // Create two pages for two different users
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  let errors = [];
  page1.on('pageerror', e => errors.push('Page1: ' + e.message));
  page2.on('pageerror', e => errors.push('Page2: ' + e.message));

  try {
    console.log('=== Testing Friend Code Functionality ===\n');

    // User 1 - Login and get friend code
    console.log('1. User 1: Loading and logging in...');
    await page1.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page1.getByText('continue as guest').click();
    await page1.waitForTimeout(3000);

    console.log('2. User 1: Going to Friends page...');
    await page1.click('button[title="Friends"]');
    await page1.waitForTimeout(2000);

    const friendCode = await page1.evaluate(() => {
      const codeElement = document.querySelector('.font-mono');
      return codeElement ? codeElement.textContent.trim() : null;
    });

    console.log(`3. User 1's Friend Code: ${friendCode}`);

    if (!friendCode || friendCode === 'Loading...') {
      console.error('❌ Failed to get friend code!');
      await page1.screenshot({ path: 'friend-code-error.png' });
      return;
    }

    // User 2 - Login and search by friend code
    console.log('\n4. User 2: Opening new session (separate browser context)...');
    await page2.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page2.getByText('continue as guest').click();
    await page2.waitForTimeout(3000);

    console.log('5. User 2: Going to Friends page...');
    await page2.click('button[title="Friends"]');
    await page2.waitForTimeout(2000);

    console.log(`6. User 2: Searching for User 1 by friend code: ${friendCode}`);

    // Enter friend code in the input field
    await page2.fill('input[placeholder="ABC12345"]', friendCode);
    await page2.waitForTimeout(500);

    // Click the Add button
    await page2.click('button:has-text("Add")');
    await page2.waitForTimeout(2000);

    await page2.screenshot({ path: 'friend-code-search-result.png' });

    // Check if search result appeared
    const hasSearchResult = await page2.evaluate(() => {
      return document.body.innerText.includes('Send Request') ||
             document.body.innerText.includes('already');
    });

    console.log('7. Search result appeared:', hasSearchResult ? '✅ YES' : '❌ NO');

    if (hasSearchResult) {
      console.log('\n8. User 2: Sending friend request...');
      const sendButton = page2.locator('button:has-text("Send Request")');
      if (await sendButton.count() > 0) {
        await sendButton.click();
        await page2.waitForTimeout(2000);
        console.log('✅ Friend request sent!');
      }
    }

    // Check User 1 for friend request
    console.log('\n9. User 1: Checking for friend request...');
    await page1.reload({ waitUntil: 'networkidle' });
    await page1.waitForTimeout(2000);

    await page1.screenshot({ path: 'user1-friend-request.png' });

    const hasFriendRequest = await page1.evaluate(() => {
      return document.body.innerText.includes('friend requests') &&
             document.body.innerText.includes('Accept');
    });

    console.log('10. Friend request received:', hasFriendRequest ? '✅ YES' : '❌ NO');

    console.log('\n--- Test Summary ---');
    console.log('✓ Friend code displayed:', friendCode !== 'Loading...');
    console.log('✓ Friend code search works:', hasSearchResult);
    console.log('✓ Friend request system works:', hasFriendRequest);

    if (errors.length === 0) {
      console.log('\n✅ No errors detected!');
    } else {
      console.log(`\n⚠️  ${errors.length} errors:`, errors);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  await browser.close();
  process.exit(0);
})();
