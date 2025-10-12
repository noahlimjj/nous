// Comprehensive chat debug script
// Paste this in browser console while Nousing together

(async function debugChat() {
    console.log('🔍 COMPREHENSIVE CHAT DEBUG\n');
    console.log('='.repeat(50));

    const db = window.db;
    const userId = window.userId;

    if (!db || !userId) {
        console.error('❌ Not logged in! db:', !!db, 'userId:', !!userId);
        return;
    }

    console.log('✅ User ID:', userId);

    try {
        // Step 1: Check for active shared timers
        console.log('\n📋 Step 1: Checking active shared timers...');
        const sharedTimersQuery = window.query(
            window.collection(db, 'sharedTimers'),
            window.where('participants', 'array-contains', userId),
            window.where('status', '==', 'active')
        );

        const timersSnapshot = await window.getDocs(sharedTimersQuery);
        console.log(`   Found ${timersSnapshot.size} active shared timer(s)`);

        if (timersSnapshot.size === 0) {
            console.error('❌ No active shared timers! You need to be in a Nous session.');
            return;
        }

        const timer = timersSnapshot.docs[0];
        const timerData = timer.data();
        const timerId = timer.id;

        console.log('✅ Active timer found:');
        console.log('   Timer ID:', timerId);
        console.log('   Participants:', timerData.participants);
        console.log('   Participant Names:', timerData.participantNames);

        // Step 2: Check current user profile
        console.log('\n👤 Step 2: Checking user profile...');
        const userDoc = await window.getDoc(window.doc(db, 'users', userId));
        if (!userDoc.exists()) {
            console.error('❌ User profile not found!');
            return;
        }
        const username = userDoc.data().username;
        console.log('✅ Username:', username);

        // Step 3: Try to send a test message
        console.log('\n📤 Step 3: Attempting to send test message...');
        const testMessage = {
            timerId: timerId,
            senderId: userId,
            senderName: username,
            message: 'Test message from debug script',
            participants: timerData.participants,
            createdAt: window.Timestamp.now()
        };

        console.log('   Message data:', testMessage);

        try {
            const docRef = await window.addDoc(window.collection(db, 'chatMessages'), testMessage);
            console.log('✅ Message created successfully!');
            console.log('   Message ID:', docRef.id);
        } catch (sendError) {
            console.error('❌ Failed to send message!');
            console.error('   Error code:', sendError.code);
            console.error('   Error message:', sendError.message);
            console.error('   Full error:', sendError);

            if (sendError.code === 'permission-denied') {
                console.log('\n⚠️  PERMISSION DENIED - Firestore rules issue!');
                console.log('   You need to deploy the updated firestore.rules');
                console.log('   Run: firebase deploy --only firestore:rules');
            }
            return;
        }

        // Step 4: Check if message appears in database
        console.log('\n📥 Step 4: Checking if message is in database...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const messagesQuery = window.query(
            window.collection(db, 'chatMessages'),
            window.where('timerId', '==', timerId)
        );

        const messagesSnapshot = await window.getDocs(messagesQuery);
        console.log(`   Found ${messagesSnapshot.size} message(s) in database`);

        if (messagesSnapshot.size > 0) {
            console.log('✅ Messages found:');
            messagesSnapshot.forEach((doc, i) => {
                const msg = doc.data();
                console.log(`   ${i + 1}. ${msg.senderName}: "${msg.message}"`);
            });
        }

        // Step 5: Test real-time listener
        console.log('\n🔔 Step 5: Testing real-time listener...');
        console.log('   Setting up listener for 5 seconds...');

        const chatQuery = window.query(
            window.collection(db, 'chatMessages'),
            window.where('timerId', '==', timerId)
        );

        let listenerWorking = false;

        const unsubscribe = window.onSnapshot(chatQuery, (snapshot) => {
            listenerWorking = true;
            console.log(`   🔔 Listener triggered! ${snapshot.size} messages`);
            snapshot.docs.forEach((doc, i) => {
                const msg = doc.data();
                console.log(`      ${i + 1}. ${msg.senderName}: "${msg.message}"`);
            });
        }, (error) => {
            console.error('   ❌ Listener error:', error);
        });

        await new Promise(resolve => setTimeout(resolve, 5000));
        unsubscribe();

        if (listenerWorking) {
            console.log('✅ Real-time listener is working!');
        } else {
            console.error('❌ Real-time listener did NOT trigger!');
        }

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY:');
        console.log('✅ Timer found:', !!timerId);
        console.log('✅ User profile found:', !!username);
        console.log('✅ Can send messages:', true);
        console.log('✅ Messages in database:', messagesSnapshot.size);
        console.log('✅ Listener working:', listenerWorking);

        console.log('\n💡 Next steps:');
        console.log('1. Check browser console for any React errors');
        console.log('2. Look for console logs starting with ✉️');
        console.log('3. Try typing a message in the chat box');
        console.log('4. Check if "Sending message:" log appears');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        console.error(error.stack);
    }
})();
