// Browser Console Script - Create Test Friend
// Copy and paste this entire script into your browser console while logged into the app

(async function createTestFriend() {
    console.log('🧪 Creating test friend...\n');

    // Get Firebase references from the window object
    const db = window.db;
    const userId = window.userId;

    if (!db || !userId) {
        console.error('❌ Error: Please make sure you are logged into the app first!');
        console.log('Steps:');
        console.log('1. Open the app at http://localhost:8080');
        console.log('2. Log in as guest or with your account');
        console.log('3. Open the browser console (F12)');
        console.log('4. Paste this script again');
        return;
    }

    console.log(`✓ Found user ID: ${userId}\n`);

    try {
        // Generate friend code
        function generateFriendCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 8; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        }

        // Create test friend user document
        const testFriendId = 'test_friend_' + Date.now();
        const testFriendCode = generateFriendCode();

        const testFriendData = {
            username: 'testfriend',
            email: 'test@example.com',
            friendCode: testFriendCode,
            currentTopic: 'Machine Learning', // Currently studying
            createdAt: window.Timestamp.now(),
            settings: {
                showStats: true,
                showActivity: true,
                allowFriendRequests: true
            },
            stats: {
                totalHours: 45.5,
                hoursToday: 3.2,
                currentStreak: 12,
                totalSessions: 89,
                longestSession: 4.8, // 4.8 hours longest session
                goalsCompleted: 15,
                treeLevel: 4,
                lastUpdated: window.Timestamp.now()
            }
        };

        // Get current user's profile to get username
        const currentUserDoc = await window.getDoc(window.doc(db, 'users', userId));
        const currentUsername = currentUserDoc.exists() ? currentUserDoc.data().username : 'you';

        // Create test friend user
        await window.setDoc(window.doc(db, 'users', testFriendId), testFriendData);
        console.log(`✅ Created test friend user: @${testFriendData.username}`);
        console.log(`   Friend Code: ${testFriendCode}`);
        console.log(`   Total Hours: ${testFriendData.stats.totalHours}h`);
        console.log(`   Hours Today: ${testFriendData.stats.hoursToday}h`);
        console.log(`   Current Topic: ${testFriendData.currentTopic}`);
        console.log(`   Longest Session: ${testFriendData.stats.longestSession}h`);
        console.log(`   Current Streak: ${testFriendData.stats.currentStreak} days\n`);

        // Create friendship between current user and test friend
        const friendshipData = {
            user1Id: userId,
            user1Username: currentUsername,
            user2Id: testFriendId,
            user2Username: testFriendData.username,
            createdAt: window.Timestamp.now()
        };

        await window.addDoc(window.collection(db, 'friendships'), friendshipData);
        console.log('✅ Created friendship\n');

        // Create a Nous request from test friend to you
        const nousRequestData = {
            fromUserId: testFriendId,
            fromUsername: testFriendData.username,
            toUserId: userId,
            toUsername: currentUsername,
            status: 'pending',
            createdAt: window.Timestamp.now()
        };

        await window.addDoc(window.collection(db, 'nousRequests'), nousRequestData);
        console.log('✅ Created Nous together request from @testfriend\n');

        console.log('🎉 Test friend setup complete!\n');
        console.log('📋 You can now:');
        console.log('   1. Refresh the page or go to Friends page');
        console.log('   2. See @testfriend with their stats (hours today, current topic)');
        console.log('   3. Accept/decline the Nous together request');
        console.log('   4. Check Leaderboard → Longest Session to see their 4.8h session\n');

        console.log('🗑️  To clean up later, run this in console:');
        console.log(`   await window.deleteDoc(window.doc(db, 'users', '${testFriendId}'));`);
        console.log('   // Then manually delete friendship and nous request docs from Firebase Console\n');

    } catch (error) {
        console.error('❌ Error creating test friend:', error);
        console.error(error.stack);
    }
})();
