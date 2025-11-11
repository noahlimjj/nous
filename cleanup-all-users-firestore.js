#!/usr/bin/env node

/**
 * Clean up default "Study" and "Exercise" habits for ALL users
 * Uses Firebase Admin SDK with application default credentials
 */

const admin = require('firebase-admin');

// Initialize with application default credentials (from Firebase CLI)
admin.initializeApp({
    projectId: 'study-d2678'
});

const db = admin.firestore();

async function cleanupAllUsers() {
    console.log('\n🚀 Starting cleanup of default habits for ALL users...\n');

    const possibleAppIds = ['default-app-id', 'study-tracker-app', 'studyTrackerApp'];
    let totalDeleted = 0;
    let usersFound = new Set();

    try {
        // For each appId location, scan all users
        for (const appId of possibleAppIds) {
            console.log(`\n📍 Scanning ${appId}...`);

            try {
                // Get all users under this appId
                const usersRef = db.collection(`artifacts/${appId}/users`);
                const usersSnapshot = await usersRef.listDocuments();

                console.log(`   Found ${usersSnapshot.length} user(s) with data`);

                for (const userDoc of usersSnapshot) {
                    const userId = userDoc.id;
                    usersFound.add(userId);

                    // Get habits for this user
                    const habitsRef = userDoc.collection('habits');
                    const habitsSnapshot = await habitsRef.get();

                    if (habitsSnapshot.empty) continue;

                    let userDeleted = 0;
                    for (const habitDoc of habitsSnapshot.docs) {
                        const habit = habitDoc.data();
                        if (habit.name === 'Study' || habit.name === 'Exercise') {
                            await habitDoc.ref.delete();
                            userDeleted++;
                            totalDeleted++;
                            console.log(`      ✓ User ${userId.substring(0, 8)}... - Deleted "${habit.name}"`);
                        }
                    }

                    if (userDeleted > 0) {
                        console.log(`      ✅ Removed ${userDeleted} default(s) for this user`);
                    }
                }
            } catch (error) {
                console.warn(`   ⚠ Error scanning ${appId}:`, error.message);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`\n✅ CLEANUP COMPLETE!`);
        console.log(`   • Unique users checked: ${usersFound.size}`);
        console.log(`   • Total habits deleted: ${totalDeleted}`);
        console.log(`\n${'='.repeat(60)}\n`);

    } catch (error) {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    }

    process.exit(0);
}

// Run the cleanup
cleanupAllUsers();
