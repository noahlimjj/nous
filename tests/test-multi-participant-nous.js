// Test script to verify multi-participant Nous Together flow
// Run this in browser console while logged into the app

(async function testMultiParticipantNous() {
    console.log('🧪 Testing Multi-Participant Nous Together Flow\n');

    const db = window.db;
    const userId = window.userId;

    if (!db || !userId) {
        console.error('❌ Please log in first!');
        return;
    }

    console.log(`✓ Logged in as: ${userId}\n`);

    try {
        // Step 1: Check for existing Nous requests with new schema
        console.log('📋 Step 1: Checking multi-participant Nous requests...');
        const nousRequestsQuery = window.query(
            window.collection(db, 'nousRequests'),
            window.where('toUserIds', 'array-contains', userId),
            window.where('status', '==', 'pending')
        );

        const nousSnapshot = await window.getDocs(nousRequestsQuery);
        console.log(`   Found ${nousSnapshot.size} pending Nous request(s)`);

        if (nousSnapshot.size > 0) {
            nousSnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`\n   📨 Request ID: ${doc.id}`);
                console.log(`      From: @${data.fromUsername}`);
                console.log(`      Their habit: ${data.fromHabitName}`);
                console.log(`      To: ${data.toUsernames?.join(', ')}`);
                console.log(`      Total recipients: ${data.toUserIds?.length || 0}`);
                console.log(`      Accepted by: ${data.acceptedBy?.length || 0}/${data.toUserIds?.length || 0}`);

                if (data.participantHabits) {
                    console.log(`      Participant habits:`);
                    Object.keys(data.participantHabits).forEach(uid => {
                        const habit = data.participantHabits[uid];
                        console.log(`         - ${uid === data.fromUserId ? 'Sender' : 'Recipient'}: ${habit.habitName}`);
                    });
                }
            });
        }

        // Step 2: Check for multi-participant shared timers
        console.log('\n⏱️  Step 2: Checking multi-participant shared timers...');
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
                console.log(`\n   ⏰ Timer ID: ${doc.id}`);
                console.log(`      Participants (${data.participants.length}):`);
                data.participants.forEach((pid, idx) => {
                    const name = data.participantNames[idx];
                    const habit = data.participantHabits?.[pid];
                    console.log(`         ${idx + 1}. @${name} → ${habit?.habitName || 'No habit'}`);
                });
                console.log(`      Status: ${data.isPaused ? 'Paused ⏸️' : 'Running ▶️'}`);

                if (data.startTime) {
                    const elapsed = Date.now() - data.startTime.toMillis() + (data.elapsedBeforePause || 0);
                    const minutes = Math.floor(elapsed / 60000);
                    const seconds = Math.floor((elapsed % 60000) / 1000);
                    console.log(`      Duration: ${minutes}m ${seconds}s`);
                }
            });
        }

        // Step 3: Check user's habits for modal selection
        console.log('\n📚 Step 3: Checking your habits (for Nous selection)...');
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const habitsQuery = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
        const habitsSnapshot = await window.getDocs(habitsQuery);

        console.log(`   You have ${habitsSnapshot.size} habit(s):`);
        habitsSnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`      - ${data.name} (ID: ${doc.id})`);
        });

        // Step 4: Check friendships
        console.log('\n👥 Step 4: Checking friendships...');
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
        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY');
        console.log('='.repeat(50));
        console.log(`✓ Friends: ${totalFriends}`);
        console.log(`✓ Your Habits: ${habitsSnapshot.size}`);
        console.log(`✓ Pending Multi-Participant Requests: ${nousSnapshot.size}`);
        console.log(`✓ Active Multi-Participant Timers: ${timersSnapshot.size}`);

        console.log('\n' + '='.repeat(50));
        console.log('🎯 NEXT STEPS');
        console.log('='.repeat(50));

        if (habitsSnapshot.size === 0) {
            console.log('⚠️  Create habits first!');
            console.log('   1. Go to Dashboard');
            console.log('   2. Add habits (e.g., "Study", "Exercise", "Read")');
        } else if (totalFriends === 0) {
            console.log('⚠️  Add friends first!');
            console.log('   1. Run: create-test-friend-browser.js');
            console.log('   2. Or add real friends using friend codes');
        } else if (timersSnapshot.size === 0 && nousSnapshot.size === 0) {
            console.log('💡 Test the multi-participant flow:');
            console.log('   1. Go to Friends page');
            console.log('   2. Click "Nous together" on a friend');
            console.log('   3. Modal opens → Select multiple friends (up to 4)');
            console.log('   4. Select your habit from the list');
            console.log('   5. Click "Send Request"');
            console.log('   6. Have friends accept and choose their habits');
            console.log('   7. Timer starts when all accept!');
        } else if (nousSnapshot.size > 0) {
            console.log('✅ You have pending requests!');
            console.log('   1. Go to Dashboard to see them');
            console.log('   2. Click "Accept" to choose your habit');
            console.log('   3. Session starts when all participants accept');
        } else {
            console.log('✅ You have active multi-participant timers!');
            console.log('   1. Go to Dashboard to see them');
            console.log('   2. Check that all participants and their habits are shown');
            console.log('   3. Test pause/resume/stop/chat');
            console.log('   4. Stop timer and verify each person gets time on THEIR habit');
        }

        console.log('\n✨ Multi-participant features:');
        console.log('   • Up to 5 people total (you + 4 friends)');
        console.log('   • Each person selects their own habit');
        console.log('   • Time tracked separately per habit');
        console.log('   • All participants visible in timer');

    } catch (error) {
        console.error('❌ Error:', error);
        console.error(error.stack);
    }
})();
