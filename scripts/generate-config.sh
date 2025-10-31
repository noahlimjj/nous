#!/bin/bash

# Generate config.js from environment variables for Netlify deployment

# Check if environment variables are set
if [ -z "$FIREBASE_API_KEY" ]; then
    echo "⚠️  WARNING: Firebase environment variables not configured!"
    echo "Creating offline-only config. Users will only have local guest mode."
    echo ""
    echo "To fix this, set these environment variables in Netlify:"
    echo "  - FIREBASE_API_KEY"
    echo "  - FIREBASE_AUTH_DOMAIN"
    echo "  - FIREBASE_PROJECT_ID"
    echo "  - FIREBASE_STORAGE_BUCKET"
    echo "  - FIREBASE_MESSAGING_SENDER_ID"
    echo "  - FIREBASE_APP_ID"
    echo "  - FIREBASE_MEASUREMENT_ID"
    echo ""

    # Create a config that explicitly marks Firebase as unavailable
    cat > config.js << 'EOF'
// Firebase Configuration - OFFLINE MODE
// Environment variables were not set during build
// The app will run in local-only guest mode

if (typeof window !== 'undefined') {
    // Mark config as explicitly unavailable (not just misconfigured)
    window.__firebase_config = null;
    window.__firebase_unavailable = true;

    console.warn('⚠️  Firebase not configured. Running in offline-only mode.');
    console.warn('Cloud features (sync, friends, leaderboard) are disabled.');
    console.info('Your data is stored locally in this browser only.');
}
EOF

    echo "✓ Created offline-only config.js"
    cat config.js
    exit 0
fi

echo "✓ Firebase environment variables found"
echo "Generating config.js with Firebase credentials..."

cat > config.js << 'EOF'
// Firebase Configuration - Auto-generated from environment variables
// DO NOT COMMIT THIS FILE TO GIT

if (typeof window !== 'undefined') {
    window.__firebase_config = {
        apiKey: "REPLACE_API_KEY",
        authDomain: "REPLACE_AUTH_DOMAIN",
        projectId: "REPLACE_PROJECT_ID",
        storageBucket: "REPLACE_STORAGE_BUCKET",
        messagingSenderId: "REPLACE_MESSAGING_SENDER_ID",
        appId: "REPLACE_APP_ID",
        measurementId: "REPLACE_MEASUREMENT_ID"
    };
    console.log('✓ Firebase config loaded from environment variables');
}
EOF

# Replace placeholders with actual values
sed -i.bak "s|REPLACE_API_KEY|${FIREBASE_API_KEY}|g" config.js
sed -i.bak "s|REPLACE_AUTH_DOMAIN|${FIREBASE_AUTH_DOMAIN}|g" config.js
sed -i.bak "s|REPLACE_PROJECT_ID|${FIREBASE_PROJECT_ID}|g" config.js
sed -i.bak "s|REPLACE_STORAGE_BUCKET|${FIREBASE_STORAGE_BUCKET}|g" config.js
sed -i.bak "s|REPLACE_MESSAGING_SENDER_ID|${FIREBASE_MESSAGING_SENDER_ID}|g" config.js
sed -i.bak "s|REPLACE_APP_ID|${FIREBASE_APP_ID}|g" config.js
sed -i.bak "s|REPLACE_MEASUREMENT_ID|${FIREBASE_MEASUREMENT_ID}|g" config.js

rm -f config.js.bak

echo "✓ config.js generated successfully with environment variables"
