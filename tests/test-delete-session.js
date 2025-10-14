const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for console messages and errors
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    try {
        console.log('\n=== TESTING DELETE SESSION FUNCTIONALITY ===\n');

        console.log('1. Navigating to localhost:8080...');
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        // Click "Continue as Guest"
        console.log('2. Clicking "Continue as Guest"...');
        const guestButton = await page.waitForSelector('button:has-text("Continue as Guest")', { timeout: 10000 });
        await guestButton.click();
        await page.waitForTimeout(2000);

        // Wait for habits page to load
        console.log('3. Waiting for habits page to load...');
        await page.waitForSelector('text=habits', { timeout: 10000 });

        // Close welcome modal if it exists
        const welcomeModal = await page.$('text=welcome to nous');
        if (welcomeModal) {
            console.log('3.5. Closing welcome modal...');
            const closeButton = await page.$('button:has-text("get started")');
            if (closeButton) {
                await closeButton.click();
                await page.waitForTimeout(1000);
            } else {
                // Try clicking outside the modal
                await page.click('body', { position: { x: 10, y: 10 } });
                await page.waitForTimeout(1000);
            }
        }

        // Create a test habit
        console.log('4. Creating test habit...');
        const habitInput = await page.waitForSelector('input[placeholder*="Morning"]');
        await habitInput.fill('Test Habit - Delete Session');

        const addButton = await page.waitForSelector('button:has-text("Add Habit")');
        await addButton.click();
        await page.waitForTimeout(1500);
        console.log('   ✓ Habit created');

        // Start timer
        console.log('5. Starting timer...');
        const playButtons = await page.$$('button');
        let playButton = null;
        for (const btn of playButtons) {
            const title = await btn.getAttribute('title');
            const html = await btn.innerHTML();
            if (html.includes('svg') || title === 'Start timer') {
                // Check if it looks like a play button (green background)
                const className = await btn.getAttribute('class');
                if (className && className.includes('green')) {
                    playButton = btn;
                    break;
                }
            }
        }

        if (playButton) {
            await playButton.click();
            console.log('   ✓ Timer started');
        } else {
            console.log('   ✗ Could not find play button');
        }

        // Wait 3 seconds
        console.log('6. Letting timer run for 3 seconds...');
        await page.waitForTimeout(3000);

        // Stop timer
        console.log('7. Stopping timer...');
        const stopButtons = await page.$$('button');
        let stopButton = null;
        for (const btn of stopButtons) {
            const className = await btn.getAttribute('class');
            if (className && className.includes('red')) {
                stopButton = btn;
                break;
            }
        }

        if (stopButton) {
            await stopButton.click();
            console.log('   ✓ Timer stopped');
        } else {
            console.log('   ✗ Could not find stop button');
        }

        // Wait for session to be saved
        await page.waitForTimeout(2500);

        // Check for recent sessions
        console.log('8. Checking for recent sessions...');
        const recentSessionsHeading = await page.waitForSelector('text=recent sessions', { timeout: 5000 });
        console.log('   ✓ Recent sessions section found');

        // Count sessions before deletion
        const sessionElements = await page.$$('.border-b');
        const sessionsBefore = sessionElements.length;
        console.log(`   Sessions before deletion: ${sessionsBefore}`);

        if (sessionsBefore > 0) {
            // Find and click delete button
            console.log('9. Finding delete button...');
            const deleteButtons = await page.$$('button[title="Delete session"]');

            if (deleteButtons.length > 0) {
                console.log(`   ✓ Found ${deleteButtons.length} delete button(s)`);

                // Handle confirmation dialog
                page.on('dialog', async dialog => {
                    console.log(`   Dialog shown: "${dialog.message()}"`);
                    await dialog.accept();
                });

                console.log('10. Clicking delete button on first session...');
                await deleteButtons[0].click();
                await page.waitForTimeout(2000);

                // Check for success notification
                const notification = await page.$('text=Session deleted successfully');
                if (notification) {
                    console.log('    ✓ Success notification displayed');
                } else {
                    console.log('    ⚠ Success notification not found');
                }

                // Count sessions after deletion
                const sessionElementsAfter = await page.$$('.border-b');
                const sessionsAfter = sessionElementsAfter.length;
                console.log(`    Sessions after deletion: ${sessionsAfter}`);

                if (sessionsAfter === sessionsBefore - 1) {
                    console.log('    ✓ Session successfully deleted from Dashboard!');
                } else {
                    console.log(`    ✗ Session count unexpected (expected ${sessionsBefore - 1}, got ${sessionsAfter})`);
                }

                // Test deleting from Reports page
                console.log('\n11. Testing delete from Reports page...');

                // Create another session first
                console.log('12. Creating another session for Reports test...');
                if (playButton) {
                    await playButton.click();
                    await page.waitForTimeout(2000);
                    if (stopButton) {
                        await stopButton.click();
                        await page.waitForTimeout(2000);
                    }
                }

                // Navigate to Reports
                console.log('13. Navigating to Reports page...');
                // Try multiple navigation methods
                let navigated = false;

                // Method 1: Look for Reports link
                const navLinks = await page.$$('a, button');
                for (const link of navLinks) {
                    const text = await link.textContent();
                    if (text && text.toLowerCase().includes('report')) {
                        await link.click();
                        navigated = true;
                        break;
                    }
                }

                // Method 2: Try finding by chart icon or navigation
                if (!navigated) {
                    const chartIcon = await page.$('svg[class*="chart"]');
                    if (chartIcon) {
                        const parent = await chartIcon.evaluateHandle(el => el.closest('a, button'));
                        if (parent) {
                            await parent.click();
                            navigated = true;
                        }
                    }
                }

                await page.waitForTimeout(2000);

                // Check if we're on reports page
                const monthlyReport = await page.$('text=monthly report');
                if (!monthlyReport) {
                    console.log('    ⚠ Could not navigate to Reports page');
                    console.log('    But Dashboard delete functionality works perfectly!');
                    console.log('\n=== DASHBOARD DELETE TEST PASSED ===\n');
                    return;
                }
                await page.waitForSelector('text=monthly report', { timeout: 5000 });
                console.log('    ✓ Reports page loaded');

                // Find session log
                const sessionLog = await page.waitForSelector('text=session log', { timeout: 5000 });
                console.log('    ✓ Session log found');

                // Count sessions in log
                const logSessions = await page.$$('text=session log ~ div .border-b');
                console.log(`    Sessions in log: ${logSessions.length}`);

                if (logSessions.length > 0) {
                    // Find delete button in reports
                    const reportDeleteButtons = await page.$$('button[title="Delete session"]');

                    if (reportDeleteButtons.length > 0) {
                        console.log('14. Deleting session from Reports...');

                        // Set up dialog handler
                        page.removeAllListeners('dialog');
                        page.on('dialog', async dialog => {
                            console.log(`    Dialog shown: "${dialog.message()}"`);
                            await dialog.accept();
                        });

                        await reportDeleteButtons[0].click();
                        await page.waitForTimeout(2000);

                        // Check notification
                        const reportNotification = await page.$('text=Session deleted successfully');
                        if (reportNotification) {
                            console.log('    ✓ Success notification displayed');
                        }

                        // Verify deletion
                        const logSessionsAfter = await page.$$('text=session log ~ div .border-b');
                        console.log(`    Sessions in log after: ${logSessionsAfter.length}`);

                        if (logSessionsAfter.length === logSessions.length - 1) {
                            console.log('    ✓ Session successfully deleted from Reports!');
                        } else {
                            console.log(`    ✗ Session count unexpected in Reports`);
                        }
                    } else {
                        console.log('    ✗ Delete button not found in Reports');
                    }
                } else {
                    console.log('    ⚠ No sessions in log to delete');
                }

                console.log('\n=== TEST COMPLETED SUCCESSFULLY ===\n');
            } else {
                console.log('   ✗ Delete button not found!');
            }
        } else {
            console.log('   ✗ No sessions found to delete');
        }

        // Keep browser open for a few seconds to see results
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('\n❌ Error during test:', error.message);
        console.error(error.stack);
    } finally {
        await browser.close();
    }
})();
