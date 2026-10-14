#!/bin/sh
set -e

echo "=== Xcode Cloud: Post Clone Script Started ==="
echo "Script location: $0"
echo "Current directory: $(pwd)"

# Resolve repository root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/../package.json" ]; then
    REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
elif [ -f "$SCRIPT_DIR/../../package.json" ]; then
    REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
elif [ -f "$SCRIPT_DIR/../../../package.json" ]; then
    REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
else
    REPO_ROOT="$(pwd)"
fi

echo "Resolved REPO_ROOT: $REPO_ROOT"
cd "$REPO_ROOT"

if command -v node >/dev/null 2>&1; then
    echo "✓ Node $(node -v) found"
else
    echo "Installing Node..."
    brew install node
fi

echo "Installing npm dependencies..."
npm install --legacy-peer-deps

echo "Building web assets and syncing Capacitor iOS..."
npm run build:web
npx cap sync
npm run prepare:ios

echo "=== Xcode Cloud: Post Clone Script Complete ==="
