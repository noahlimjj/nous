// Browser-based Firestore data migration script
// Run this in the browser console on https://nousi.netlify.app while logged in

(async function migrateData() {
    console.log('🔄 Starting data migration...\n');

    const db = window.db;
    const userId = window.auth.currentUser.uid;

    console.log(`👤 User ID: ${userId}\n`);

    const artifacts = ['default-app-id', 'study-tracker-app', 'studyTrackerApp'];
    const TARGET_APP_ID = 'study-tracker-app'; // Where we'll consolidate everything

    const allData = {
        habits: [],
        sessions: [],
        goals: [],
        notebooks: []
    };

    // Step 1: Collect all data from all locations
    console.log('📦 Step 1: Collecting data from all locations...\n');

    for (const appId of artifacts) {
        console.log(`   Checking ${appId}...`);

        try {
            // Check habits
            const habitsRef = window.collection(db, `/artifacts/${appId}/users/${userId}/habits`);
            const habitsSnapshot = await window.getDocs(habitsRef);
            if (!habitsSnapshot.empty) {
                console.log(`      ✓ Found ${habitsSnapshot.size} habits`);
                habitsSnapshot.forEach(doc => {
                    allData.habits.push({ id: doc.id, data: doc.data(), source: appId });
                });
            }

            // Check sessions
            const sessionsRef = window.collection(db, `/artifacts/${appId}/users/${userId}/sessions`);
            const sessionsSnapshot = await window.getDocs(sessionsRef);
            if (!sessionsSnapshot.empty) {
                console.log(`      ✓ Found ${sessionsSnapshot.size} sessions`);
                sessionsSnapshot.forEach(doc => {
                    allData.sessions.push({ id: doc.id, data: doc.data(), source: appId });
                });
            }

            // Check goals
            const goalsRef = window.collection(db, `/artifacts/${appId}/users/${userId}/goals`);
            const goalsSnapshot = await window.getDocs(goalsRef);
            if (!goalsSnapshot.empty) {
                console.log(`      ✓ Found ${goalsSnapshot.size} goals`);
                goalsSnapshot.forEach(doc => {
                    allData.goals.push({ id: doc.id, data: doc.data(), source: appId });
                });
            }
        } catch (error) {
            console.log(`      ⚠️ Error checking ${appId}:`, error.message);
        }
    }

    console.log('\n📊 Summary of found data:');
    console.log(`   Habits: ${allData.habits.length}`);
    console.log(`   Sessions: ${allData.sessions.length}`);
    console.log(`   Goals: ${allData.goals.length}`);

    if (allData.habits.length === 0 && allData.sessions.length === 0 && allData.goals.length === 0) {
        console.log('\n❌ No data found to migrate!');
        return;
    }

    // Step 2: Deduplicate data (keep newest version if duplicates exist)
    console.log('\n🔍 Step 2: Deduplicating data...');

    const deduped = {
        habits: new Map(),
        sessions: new Map(),
        goals: new Map()
    };

    allData.habits.forEach(item => {
        if (!deduped.habits.has(item.id) || item.source === TARGET_APP_ID) {
            deduped.habits.set(item.id, item);
        }
    });

    allData.sessions.forEach(item => {
        if (!deduped.sessions.has(item.id) || item.source === TARGET_APP_ID) {
            deduped.sessions.set(item.id, item);
        }
    });

    allData.goals.forEach(item => {
        if (!deduped.goals.has(item.id) || item.source === TARGET_APP_ID) {
            deduped.goals.set(item.id, item);
        }
    });

    console.log(`   Unique habits: ${deduped.habits.size}`);
    console.log(`   Unique sessions: ${deduped.sessions.size}`);
    console.log(`   Unique goals: ${deduped.goals.size}`);

    // Step 3: Write all data to target location
    console.log(`\n💾 Step 3: Writing data to ${TARGET_APP_ID}...\n`);

    let written = 0;

    for (const [id, item] of deduped.habits) {
        try {
            const docRef = window.doc(db, `/artifacts/${TARGET_APP_ID}/users/${userId}/habits`, id);
            await window.setDoc(docRef, item.data);
            written++;
            console.log(`   ✓ Wrote habit: ${item.data.name || id}`);
        } catch (error) {
            console.log(`   ✗ Failed to write habit ${id}:`, error.message);
        }
    }

    for (const [id, item] of deduped.sessions) {
        try {
            const docRef = window.doc(db, `/artifacts/${TARGET_APP_ID}/users/${userId}/sessions`, id);
            await window.setDoc(docRef, item.data);
            written++;
            if (written % 10 === 0) {
                console.log(`   ✓ Wrote ${written} documents so far...`);
            }
        } catch (error) {
            console.log(`   ✗ Failed to write session ${id}:`, error.message);
        }
    }

    for (const [id, item] of deduped.goals) {
        try {
            const docRef = window.doc(db, `/artifacts/${TARGET_APP_ID}/users/${userId}/goals`, id);
            await window.setDoc(docRef, item.data);
            written++;
            console.log(`   ✓ Wrote goal: ${item.data.text || id}`);
        } catch (error) {
            console.log(`   ✗ Failed to write goal ${id}:`, error.message);
        }
    }

    console.log(`\n✅ Migration complete! Wrote ${written} documents to ${TARGET_APP_ID}`);
    console.log('\n🔄 Refreshing page in 2 seconds...');

    setTimeout(() => {
        window.location.reload();
    }, 2000);
})();
