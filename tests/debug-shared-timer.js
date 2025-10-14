// Debug script - Check shared timer status
// Paste this in your browser console while logged in

(async function debugSharedTimer() {
    console.log('🔍 Debugging Shared Timer\n');

    const db = window.db;
    const userId = window.userId;

    if (!db || !userId) {
        console.error('❌ Not logged in!');
        return;
    }

    console.log(`✓ User ID: ${userId}\n`);

    try {
        // Check ALL shared timers (not just active ones)
        console.log('📋 Checking ALL shared timers in database...');
        const allTimersQuery = window.query(
            window.collection(db, 'sharedTimers'),
            window.where('participants', 'array-contains', userId)
        );

        const allTimersSnapshot = await window.getDocs(allTimersQuery);
        console.log(`Found ${allTimersSnapshot.size} shared timer(s) total\n`);

        if (allTimersSnapshot.size === 0) {
            console.log('⚠️  No shared timers found for you at all!');
            console.log('   This means no Nous session has been created yet.');
            return;
        }

        // Display all timers
        allTimersSnapshot.forEach((doc, index) => {
            const data = doc.data();
            console.log(`Timer ${index + 1}:`);
            console.log(`  ID: ${doc.id}`);
            console.log(`  Status: ${data.status}`);
            console.log(`  Participants: ${JSON.stringify(data.participants)}`);
            console.log(`  Names: ${JSON.stringify(data.participantNames)}`);
            console.log(`  Is Paused: ${data.isPaused}`);
            console.log(`  Habit Name: ${data.habitName}`);
            console.log(`  Created: ${data.createdAt?.toDate()}`);
            console.log('');
        });

        // Check specifically for active timers
        console.log('🔎 Checking ACTIVE shared timers...');
        const activeTimersQuery = window.query(
            window.collection(db, 'sharedTimers'),
            window.where('participants', 'array-contains', userId),
            window.where('status', '==', 'active')
        );

        const activeTimersSnapshot = await window.getDocs(activeTimersQuery);
        console.log(`Found ${activeTimersSnapshot.size} ACTIVE shared timer(s)\n`);

        if (activeTimersSnapshot.size === 0 && allTimersSnapshot.size > 0) {
            console.log('⚠️  You have shared timers but none are ACTIVE!');
            console.log('   The timer status might be "ended" or something else.');
            console.log('   You need to send a new Nous request to create a new active timer.');
        }

        // Check what the React state sees
        console.log('🎯 Checking React component state...');
        console.log('   (Open React DevTools to inspect the sharedTimers state)');

    } catch (error) {
        console.error('❌ Error:', error);
        console.error(error.stack);
    }
})();
