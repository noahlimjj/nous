#!/bin/bash
# Generate config.js from environment variables for production deployment
# This script is used by Netlify to inject Firebase credentials securely

# If config.js already exists and env vars are not set, skip generation
if [ -f "config.js" ] && [ -z "$FIREBASE_API_KEY" ]; then
    echo "⚠️  config.js exists and no env vars set - using existing config"
    exit 0
fi

cat > config.js << EOF
// Firebase Configuration - Generated from environment variables
window.__firebase_config = {
    apiKey: "${FIREBASE_API_KEY}",
    authDomain: "${FIREBASE_AUTH_DOMAIN}",
    projectId: "${FIREBASE_PROJECT_ID}",
    storageBucket: "${FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${FIREBASE_APP_ID}",
    measurementId: "${FIREBASE_MEASUREMENT_ID}"
};

window.__app_id = "${APP_ID:-study-tracker-app}";
EOF

echo "✅ config.js generated successfully"
