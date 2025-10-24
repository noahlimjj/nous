#!/usr/bin/env node

/**
 * Simple script to set noahlim as admin using Firebase config
 * Run with: node scripts/simple-set-admin.js
 */

// Load Firebase config
const config = require('../config.js');

// Import Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, updateDoc } = require('firebase/firestore');

async function setAdmin() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(config.firebaseConfig);
    const db = getFirestore(app);

    console.log('Looking for user "noahlim"...');

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', 'noahlim'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('❌ User "noahlim" not found in Firestore');
      console.log('Please make sure the user has logged in at least once.');
      process.exit(1);
    }

    const userDoc = querySnapshot.docs[0];
    console.log(`✅ Found user "noahlim" (ID: ${userDoc.id})`);

    console.log('Setting admin flag...');
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
      admin: true
    });

    console.log('✅ Successfully set noahlim as admin!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Log in as noahlim');
    console.log('2. Go to Settings page');
    console.log('3. You should see the Admin Panel');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'permission-denied') {
      console.log('');
      console.log('This happened because Firestore security rules prevent updating other users.');
      console.log('Please use the Firebase Console method instead:');
      console.log('1. Go to https://console.firebase.google.com/');
      console.log('2. Select your project');
      console.log('3. Go to Firestore Database');
      console.log('4. Find users collection');
      console.log('5. Find the document where username = "noahlim"');
      console.log('6. Add field: admin (boolean) = true');
    }
    process.exit(1);
  }
}

setAdmin();
