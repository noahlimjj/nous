#!/bin/bash

# Generate config.js from environment variables for Netlify deployment

# Check if environment variables are set
if [ -z "$FIREBASE_API_KEY" ]; then
    echo "Warning: FIREBASE_API_KEY not set, using template"
    cp config.template.js config.js
    exit 0
fi

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
    console.log('Firebase config loaded from environment variables');
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

echo "config.js generated successfully with environment variables"
cat config.js
