#!/usr/bin/env node

/**
 * Clean up default "Study" and "Exercise" habits for ALL users
 * This script scans all possible Firebase locations and removes defaults
 */

const admin = require('firebase-admin');
const serviceAccount = require('../../service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function getAllUsers() {
    const users = [];
    let nextPageToken;

    do {
        const result = await auth.listUsers(1000, nextPageToken);
        users.push(...result.users);
        nextPageToken = result.pageToken;
    } while (nextPageToken);

    return users;
}

async function cleanupDefaultHabitsForUser(userId, userEmail) {
    const possibleAppIds = ['default-app-id', 'study-tracker-app', 'studyTrackerApp'];
    let userTotalDeleted = 0;

    for (const appId of possibleAppIds) {
        try {
            const habitsRef = db.collection(`artifacts/${appId}/users/${userId}/habits`);
            const snapshot = await habitsRef.get();

            if (snapshot.empty) continue;

            for (const doc of snapshot.docs) {
                const habit = doc.data();
                if (habit.name === 'Study' || habit.name === 'Exercise') {
                    await doc.ref.delete();
                    userTotalDeleted++;
                    console.log(`      ✓ Deleted "${habit.name}" from ${appId}`);
                }
            }
        } catch (error) {
            console.warn(`      ⚠ Error checking ${appId}:`, error.message);
        }
    }

    return userTotalDeleted;
}

async function cleanupAllUsers() {
    console.log('\n🚀 Starting cleanup of default habits for ALL users...\n');

    try {
        // Get all users
        console.log('📋 Fetching all users...');
        const users = await getAllUsers();
        console.log(`   Found ${users.length} total users\n`);

        let totalDeleted = 0;
        let usersAffected = 0;

        // Process each user
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const email = user.email || 'no-email';

            console.log(`[${i + 1}/${users.length}] Checking ${email}...`);

            const deleted = await cleanupDefaultHabitsForUser(user.uid, email);

            if (deleted > 0) {
                totalDeleted += deleted;
                usersAffected++;
                console.log(`      ✅ Removed ${deleted} default habit(s)`);
            } else {
                console.log(`      ℹ️  No defaults found`);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`\n✅ CLEANUP COMPLETE!`);
        console.log(`   • Users checked: ${users.length}`);
        console.log(`   • Users affected: ${usersAffected}`);
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
