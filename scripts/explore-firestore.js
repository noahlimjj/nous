const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'study-d2678'
    });
}

const db = admin.firestore();

async function exploreFirestore() {
    console.log('\n=== EXPLORING FIRESTORE STRUCTURE ===\n');

    // Get all artifacts
    const artifactsRef = db.collection('artifacts');
    const artifactDocs = await artifactsRef.listDocuments();

    console.log(`Found ${artifactDocs.length} artifact document(s):\n`);

    for (const artifactDoc of artifactDocs) {
        const artifactId = artifactDoc.id;
        console.log(`📦 Artifact: ${artifactId}`);

        // Get users collection under this artifact
        const usersRef = artifactDoc.collection('users');
        const userDocs = await usersRef.listDocuments();

        console.log(`   └─ ${userDocs.length} user(s) found`);

        for (const userDoc of userDocs) {
            const userId = userDoc.id;
            console.log(`      └─ User: ${userId.substring(0, 20)}...`);

            // List all subcollections for this user
            const collections = await userDoc.listCollections();

            for (const collection of collections) {
                const snapshot = await collection.get();
                console.log(`         └─ ${collection.id}: ${snapshot.size} document(s)`);

                // Show sample data if exists
                if (snapshot.size > 0 && snapshot.size <= 3) {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const preview = JSON.stringify(data).substring(0, 100);
                        console.log(`            • ${doc.id.substring(0, 15)}...: ${preview}...`);
                    });
                }
            }
            console.log('');
        }
    }
}

exploreFirestore()
    .then(() => {
        console.log('\n✅ Exploration complete!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
