/**
 * Script to set a user as admin in Firestore
 *
 * Usage:
 * 1. Make sure you have a service account key JSON file
 * 2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 * 3. Run: node scripts/set-admin.js <username>
 *
 * Example: node scripts/set-admin.js noahlim
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
// You can either:
// 1. Set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account key path
// 2. Or uncomment the line below and provide the path directly
// const serviceAccount = require('../path-to-service-account-key.json');

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setUserAsAdmin(username, isAdmin = true) {
  try {
    console.log(`Looking for user: ${username}...`);

    // Find user by username
    const usersSnapshot = await db.collection('users')
      .where('username', '==', username)
      .get();

    if (usersSnapshot.empty) {
      console.error(`❌ No user found with username: ${username}`);
      process.exit(1);
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    console.log(`Found user: ${username} (UID: ${userId})`);

    // Update admin status
    await db.collection('users').doc(userId).update({
      admin: isAdmin
    });

    console.log(`✅ Successfully set admin status to ${isAdmin} for user: ${username}`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Error setting admin status:', error);
    process.exit(1);
  }
}

// Get username from command line arguments
const username = process.argv[2];
const isAdmin = process.argv[3] !== 'false'; // Default to true unless explicitly set to false

if (!username) {
  console.log('Usage: node scripts/set-admin.js <username> [true|false]');
  console.log('Example: node scripts/set-admin.js noahlim');
  console.log('Example: node scripts/set-admin.js noahlim false  (to remove admin)');
  process.exit(1);
}

setUserAsAdmin(username, isAdmin);
