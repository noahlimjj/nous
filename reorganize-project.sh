#!/bin/bash

# Project Reorganization Script for Nous Study Tracker
# This script safely reorganizes the project structure

set -e  # Exit on error

echo "🚀 Starting project reorganization..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}Project root: $PROJECT_ROOT${NC}"
echo ""

# Create new directory structure
echo -e "${YELLOW}📁 Creating new directory structure...${NC}"

mkdir -p docs/pwa
mkdir -p docs/features
mkdir -p docs/development
mkdir -p docs/sop
mkdir -p public/icons
mkdir -p experiments/tree-designs
mkdir -p scripts
mkdir -p assets/screenshots

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Move PWA documentation
echo -e "${YELLOW}📚 Moving PWA documentation...${NC}"
mv HOW_TO_CONVERT_ANY_APP_TO_PWA.md docs/pwa/ 2>/dev/null || echo "  - HOW_TO_CONVERT_ANY_APP_TO_PWA.md already moved or not found"
mv PWA_GUIDE.md docs/pwa/ 2>/dev/null || echo "  - PWA_GUIDE.md already moved or not found"
mv PWA_SETUP_COMPLETE.md docs/pwa/ 2>/dev/null || echo "  - PWA_SETUP_COMPLETE.md already moved or not found"
mv PWA_SYNC_EXPLAINED.md docs/pwa/ 2>/dev/null || echo "  - PWA_SYNC_EXPLAINED.md already moved or not found"
mv INSTALLATION_GUIDE.md docs/pwa/ 2>/dev/null || echo "  - INSTALLATION_GUIDE.md already moved or not found"
mv FINAL_PWA_SUMMARY.md docs/pwa/ 2>/dev/null || echo "  - FINAL_PWA_SUMMARY.md already moved or not found"
echo -e "${GREEN}✓ PWA docs moved${NC}"

# Move feature documentation
echo -e "${YELLOW}📖 Moving feature documentation...${NC}"
mv ICON_DESIGN.md docs/features/ 2>/dev/null || echo "  - ICON_DESIGN.md already moved or not found"
mv TIMER_STOPWATCH_FEATURE.md docs/features/ 2>/dev/null || echo "  - TIMER_STOPWATCH_FEATURE.md already moved or not found"
mv TREE_DESIGN_PROMPT.md docs/features/ 2>/dev/null || echo "  - TREE_DESIGN_PROMPT.md already moved or not found"
mv TESTING_MULTI_PARTICIPANT_NOUS.md docs/features/ 2>/dev/null || echo "  - TESTING_MULTI_PARTICIPANT_NOUS.md already moved or not found"
echo -e "${GREEN}✓ Feature docs moved${NC}"

# Move development documentation
echo -e "${YELLOW}🛠️ Moving development documentation...${NC}"
mv FOLDER_ORGANIZATION.md docs/development/ 2>/dev/null || echo "  - FOLDER_ORGANIZATION.md already moved or not found"
mv GIT_WORKFLOW.md docs/development/ 2>/dev/null || echo "  - GIT_WORKFLOW.md already moved or not found"
mv QUICK_REFERENCE.md docs/development/ 2>/dev/null || echo "  - QUICK_REFERENCE.md already moved or not found"
mv FIRESTORE_RULES_UPDATE.md docs/development/ 2>/dev/null || echo "  - FIRESTORE_RULES_UPDATE.md already moved or not found"
echo -e "${GREEN}✓ Development docs moved${NC}"

# Move SOP directory
echo -e "${YELLOW}📋 Moving SOP files...${NC}"
if [ -d "sop" ]; then
    cp -r sop/* docs/sop/ 2>/dev/null || echo "  - SOP files already moved"
    echo -e "${GREEN}✓ SOP files moved${NC}"
fi

# Move icons to public
echo -e "${YELLOW}🎨 Moving icons...${NC}"
if [ -d "icons" ]; then
    cp -r icons/* public/icons/ 2>/dev/null || echo "  - Icons already moved"
    echo -e "${GREEN}✓ Icons moved${NC}"
fi

# Move PWA files to public
echo -e "${YELLOW}⚙️ Moving PWA files...${NC}"
mv manifest.json public/ 2>/dev/null || echo "  - manifest.json already moved or not found"
mv service-worker.js public/ 2>/dev/null || echo "  - service-worker.js already moved or not found"
echo -e "${GREEN}✓ PWA files moved${NC}"

# Move tree design experiments
echo -e "${YELLOW}🌳 Moving tree design experiments...${NC}"
mv advanced-mathematical-trees.html experiments/tree-designs/ 2>/dev/null || true
mv aesthetic-mathematical-trees.html experiments/tree-designs/ 2>/dev/null || true
mv enhanced-mathematical-trees.html experiments/tree-designs/ 2>/dev/null || true
mv enhanced-symmetrical-trees.html experiments/tree-designs/ 2>/dev/null || true
mv mathematical-trees.html experiments/tree-designs/ 2>/dev/null || true
mv natural-animated-trees.html experiments/tree-designs/ 2>/dev/null || true
mv reference-style-trees.html experiments/tree-designs/ 2>/dev/null || true
mv specification-compliant-trees.html experiments/tree-designs/ 2>/dev/null || true
mv symmetrical-mathematical-trees.html experiments/tree-designs/ 2>/dev/null || true
mv ultimate-mathematical-trees.html experiments/tree-designs/ 2>/dev/null || true
mv tree-design-gradient.html experiments/tree-designs/ 2>/dev/null || true
mv tree-design-minimal.html experiments/tree-designs/ 2>/dev/null || true
mv tree-design-symmetrical.html experiments/tree-designs/ 2>/dev/null || true
mv tree-design-test.html experiments/tree-designs/ 2>/dev/null || true
mv shape_test.html experiments/tree-designs/ 2>/dev/null || true
mv test_shapes.html experiments/tree-designs/ 2>/dev/null || true
echo -e "${GREEN}✓ Tree design experiments moved${NC}"

# Move scripts
echo -e "${YELLOW}🔧 Moving scripts...${NC}"
mv create-icons.js scripts/ 2>/dev/null || echo "  - create-icons.js already moved or not found"
mv generate-icons.html scripts/ 2>/dev/null || echo "  - generate-icons.html already moved or not found"
mv generate-icons.js scripts/ 2>/dev/null || echo "  - generate-icons.js already moved or not found"
mv generate-icons.py scripts/ 2>/dev/null || echo "  - generate-icons.py already moved or not found"
mv test-pwa.js scripts/ 2>/dev/null || echo "  - test-pwa.js already moved or not found"
mv generate-config.sh scripts/ 2>/dev/null || echo "  - generate-config.sh already moved or not found"
echo -e "${GREEN}✓ Scripts moved${NC}"

# Move screenshots
echo -e "${YELLOW}📸 Moving screenshots...${NC}"
mv "Screenshot "*.png assets/screenshots/ 2>/dev/null || echo "  - Screenshots already moved or not found"
mv IMG_*.jpeg assets/screenshots/ 2>/dev/null || echo "  - JPEG images already moved or not found"
mv test-error.png assets/screenshots/ 2>/dev/null || echo "  - test-error.png already moved or not found"
echo -e "${GREEN}✓ Screenshots moved${NC}"

# Move audio files to public
echo -e "${YELLOW}🔊 Moving audio files...${NC}"
mv bell-click-sound-slow-smo-ocxvfkrh.wav public/ 2>/dev/null || echo "  - Audio file already moved or not found"
echo -e "${GREEN}✓ Audio files moved${NC}"

echo ""
echo -e "${GREEN}✅ File reorganization complete!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: You must now update file references in:${NC}"
echo "  1. index.html - Update paths to:"
echo "     - manifest.json → /public/manifest.json"
echo "     - service-worker.js → /public/service-worker.js"
echo "     - icons → /public/icons/"
echo "     - audio → /public/bell-click-sound-slow-smo-ocxvfkrh.wav"
echo ""
echo "  2. public/manifest.json - Update icon paths:"
echo "     - icons/icon-*.png → /public/icons/icon-*.png"
echo ""
echo "  3. README.md - Update links to moved documentation"
echo ""
echo -e "${BLUE}Run the update script to fix these automatically:${NC}"
echo "  bash scripts/update-references.sh"
echo ""
echo -e "${GREEN}🎉 Project is now organized!${NC}"
