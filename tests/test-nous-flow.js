// Test script to verify complete Nous together flow
// Run this in browser console while logged into the app

(async function testNousFlow() {
    console.log('🧪 Testing Nous Together Flow\n');

    const db = window.db;
    const userId = window.userId;

    if (!db || !userId) {
        console.error('❌ Please log in first!');
        return;
    }

    console.log(`✓ Logged in as: ${userId}\n`);

    try {
        // Step 1: Check for existing Nous requests
        console.log('📋 Step 1: Checking existing Nous requests...');
        const nousRequestsQuery = window.query(
            window.collection(db, 'nousRequests'),
            window.where('toUserId', '==', userId),
            window.where('status', '==', 'pending')
        );

        const nousSnapshot = await window.getDocs(nousRequestsQuery);
        console.log(`   Found ${nousSnapshot.size} pending Nous request(s)`);

        if (nousSnapshot.size > 0) {
            nousSnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`   - From: @${data.fromUsername} (ID: ${doc.id})`);
            });
        }

        // Step 2: Check for existing shared timers
        console.log('\n⏱️  Step 2: Checking existing shared timers...');
        const sharedTimersQuery = window.query(
            window.collection(db, 'sharedTimers'),
            window.where('participants', 'array-contains', userId),
            window.where('status', '==', 'active')
        );

        const timersSnapshot = await window.getDocs(sharedTimersQuery);
        console.log(`   Found ${timersSnapshot.size} active shared timer(s)`);

        if (timersSnapshot.size > 0) {
            timersSnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`   - Timer ID: ${doc.id}`);
                console.log(`     Participants: ${data.participantNames.join(', ')}`);
                console.log(`     Status: ${data.isPaused ? 'Paused' : 'Running'}`);
            });
        }

        // Step 3: Check friendships
        console.log('\n👥 Step 3: Checking friendships...');
        const friendshipsQuery1 = window.query(
            window.collection(db, 'friendships'),
            window.where('user1Id', '==', userId)
        );
        const friendshipsQuery2 = window.query(
            window.collection(db, 'friendships'),
            window.where('user2Id', '==', userId)
        );

        const [friends1, friends2] = await Promise.all([
            window.getDocs(friendshipsQuery1),
            window.getDocs(friendshipsQuery2)
        ]);

        const totalFriends = friends1.size + friends2.size;
        console.log(`   You have ${totalFriends} friend(s)`);

        // Summary
        console.log('\n📊 Summary:');
        console.log(`   ✓ Friends: ${totalFriends}`);
        console.log(`   ✓ Pending Nous Requests: ${nousSnapshot.size}`);
        console.log(`   ✓ Active Shared Timers: ${timersSnapshot.size}`);

        if (timersSnapshot.size === 0) {
            console.log('\n💡 To see the Nous timer on Dashboard:');
            console.log('   1. Go to Friends page');
            console.log('   2. Click "Nous together" on a friend');
            console.log('   3. Have them accept the request');
            console.log('   4. The shared timer will appear on both Dashboards');

            if (totalFriends === 0) {
                console.log('\n⚠️  You need to add a friend first!');
                console.log('   Run the create-test-friend-browser.js script to create one.');
            }
        } else {
            console.log('\n✅ You have active shared timers!');
            console.log('   Go to Dashboard/Home page to see them.');
            console.log('   (You may need to refresh the page)');
        }

    } catch (error) {
        console.error('❌ Error:', error);
        console.error(error.stack);
    }
})();
