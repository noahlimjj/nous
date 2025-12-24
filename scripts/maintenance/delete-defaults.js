// Quick script to delete default habits from Firebase
// Run with: node delete-defaults.js <user-email>

const admin = require('firebase-admin');

// Load the config
const config = require('./config.js');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: config.__firebase_config?.projectId || 'study-d2678',
    })
});

const db = admin.firestore();

async function deleteDefaultHabits(userEmail) {
    try {
        // Get user by email
        const userRecord = await admin.auth().getUserByEmail(userEmail);
        const userId = userRecord.uid;

        console.log(`\n🔍 Found user: ${userEmail}`);
        console.log(`   UID: ${userId}\n`);

        const possibleAppIds = ['default-app-id', 'study-tracker-app', 'studyTrackerApp'];
        let totalDeleted = 0;

        for (const appId of possibleAppIds) {
            console.log(`📍 Checking ${appId}...`);
            const habitsRef = db.collection(`artifacts/${appId}/users/${userId}/habits`);
            const snapshot = await habitsRef.get();

            if (snapshot.empty) {
                console.log(`   ℹ️  No habits found\n`);
                continue;
            }

            console.log(`   Found ${snapshot.size} habits`);

            for (const doc of snapshot.docs) {
                const habit = doc.data();
                if (habit.name === 'Study' || habit.name === 'Exercise') {
                    await doc.ref.delete();
                    totalDeleted++;
                    console.log(`   ✓ Deleted "${habit.name}" (ID: ${doc.id})`);
                }
            }
            console.log();
        }

        if (totalDeleted > 0) {
            console.log(`\n✅ Success! Deleted ${totalDeleted} default habit(s) from Firebase\n`);
        } else {
            console.log(`\nℹ️  No default habits found\n`);
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message, '\n');
        process.exit(1);
    }

    process.exit(0);
}

// Get email from command line
const userEmail = process.argv[2];

if (!userEmail) {
    console.error('\n❌ Usage: node delete-defaults.js <user-email>\n');
    process.exit(1);
}

deleteDefaultHabits(userEmail);
