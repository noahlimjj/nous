#!/bin/bash

# Update File References After Reorganization
# This script updates all file paths in the code

set -e

echo "🔄 Updating file references..."
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Backup index.html first
echo -e "${YELLOW}📋 Creating backup of index.html...${NC}"
cp index.html index.html.backup
echo -e "${GREEN}✓ Backup created: index.html.backup${NC}"
echo ""

# Update manifest.json icon paths
echo -e "${YELLOW}📝 Updating public/manifest.json...${NC}"
if [ -f "public/manifest.json" ]; then
    sed -i '' 's|"icons/|"public/icons/|g' public/manifest.json
    sed -i '' 's|"src": "public/icons/|"src": "/public/icons/|g' public/manifest.json
    echo -e "${GREEN}✓ Manifest icon paths updated${NC}"
else
    echo -e "${YELLOW}⚠️  public/manifest.json not found${NC}"
fi
echo ""

# Update index.html references
echo -e "${YELLOW}📝 Updating index.html...${NC}"

# Update manifest link
sed -i '' 's|<link rel="manifest" href="/manifest.json">|<link rel="manifest" href="/public/manifest.json">|g' index.html
echo "  ✓ Manifest link updated"

# Update service worker registration
sed -i '' "s|navigator.serviceWorker.register('/service-worker.js')|navigator.serviceWorker.register('/public/service-worker.js')|g" index.html
echo "  ✓ Service worker path updated"

# Update icon paths (apple-touch-icon)
sed -i '' 's|href="/icons/|href="/public/icons/|g' index.html
echo "  ✓ Apple touch icon paths updated"

# Update audio file path if it exists in HTML
sed -i '' 's|bell-click-sound-slow-smo-ocxvfkrh.wav|public/bell-click-sound-slow-smo-ocxvfkrh.wav|g' index.html
echo "  ✓ Audio file path updated"

echo -e "${GREEN}✓ index.html updated${NC}"
echo ""

# Update netlify.toml if needed
echo -e "${YELLOW}📝 Updating netlify.toml...${NC}"
if [ -f "netlify.toml" ]; then
    # Check if we need to add publish directory
    if ! grep -q "publish" netlify.toml; then
        echo "" >> netlify.toml
        echo "[build]" >> netlify.toml
        echo '  publish = "."' >> netlify.toml
        echo -e "${GREEN}✓ netlify.toml updated${NC}"
    else
        echo -e "${BLUE}ℹ️  netlify.toml already configured${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  netlify.toml not found${NC}"
fi
echo ""

# Clean up old directories (with confirmation)
echo -e "${YELLOW}🗑️  Cleanup old directories?${NC}"
echo "The following empty directories can be removed:"
echo "  - sop/ (moved to docs/sop/)"
echo "  - icons/ (moved to public/icons/)"
echo ""
read -p "Remove old directories? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf sop icons 2>/dev/null || true
    echo -e "${GREEN}✓ Old directories removed${NC}"
else
    echo -e "${BLUE}ℹ️  Keeping old directories${NC}"
fi
echo ""

echo -e "${GREEN}✅ All references updated!${NC}"
echo ""
echo -e "${BLUE}Summary of changes:${NC}"
echo "  ✓ Manifest path: /manifest.json → /public/manifest.json"
echo "  ✓ Service worker: /service-worker.js → /public/service-worker.js"
echo "  ✓ Icons: /icons/ → /public/icons/"
echo "  ✓ Audio: ./audio.wav → /public/audio.wav"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Test the app locally: npm start"
echo "  2. Check that PWA still works"
echo "  3. Commit changes: git add . && git commit -m \"Reorganize project structure\""
echo ""
echo -e "${GREEN}🎉 Project reorganization complete!${NC}"
