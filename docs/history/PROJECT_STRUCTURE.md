# Nous Study Tracker - Project Structure

## 📁 Organized Directory Structure

This document explains the new, organized project structure for easy navigation and maintenance.

```
Study_tracker_app/
│
├── 📚 docs/                          # All documentation
│   ├── pwa/                          # PWA-related documentation
│   │   ├── HOW_TO_CONVERT_ANY_APP_TO_PWA.md
│   │   ├── PWA_GUIDE.md
│   │   ├── PWA_SETUP_COMPLETE.md
│   │   ├── PWA_SYNC_EXPLAINED.md
│   │   ├── INSTALLATION_GUIDE.md
│   │   └── FINAL_PWA_SUMMARY.md
│   │
│   ├── features/                     # Feature-specific documentation
│   │   ├── ICON_DESIGN.md
│   │   ├── TIMER_STOPWATCH_FEATURE.md
│   │   ├── TREE_DESIGN_PROMPT.md
│   │   └── TESTING_MULTI_PARTICIPANT_NOUS.md
│   │
│   ├── development/                  # Development guides
│   │   ├── FOLDER_ORGANIZATION.md
│   │   ├── GIT_WORKFLOW.md
│   │   ├── QUICK_REFERENCE.md
│   │   └── FIRESTORE_RULES_UPDATE.md
│   │
│   └── sop/                          # Standard Operating Procedures
│       ├── INDEX.md
│       ├── DEPLOYMENT_GUIDE.md
│       ├── TROUBLESHOOTING_GUIDE.md
│       ├── SECURITY.md
│       └── ... (other SOP files)
│
├── 🌐 public/                        # Public assets (served directly)
│   ├── icons/                        # PWA app icons
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   │
│   ├── manifest.json                 # PWA manifest
│   ├── service-worker.js             # Service worker for offline support
│   └── bell-click-sound-slow-smo-ocxvfkrh.wav  # Audio files
│
├── 🧪 experiments/                   # Prototypes and experiments
│   └── tree-designs/                 # Tree visualization experiments
│       ├── advanced-mathematical-trees.html
│       ├── aesthetic-mathematical-trees.html
│       ├── enhanced-mathematical-trees.html
│       ├── mathematical-trees.html
│       ├── natural-animated-trees.html
│       ├── reference-style-trees.html
│       ├── specification-compliant-trees.html
│       ├── symmetrical-mathematical-trees.html
│       ├── ultimate-mathematical-trees.html
│       ├── tree-design-gradient.html
│       ├── tree-design-minimal.html
│       ├── tree-design-symmetrical.html
│       ├── tree-design-test.html
│       ├── shape_test.html
│       └── test_shapes.html
│
├── 🛠️ scripts/                       # Build & utility scripts
│   ├── create-icons.js               # Generates PWA icons
│   ├── generate-config.sh            # Generates Firebase config
│   ├── generate-icons.html           # Icon generator UI
│   ├── generate-icons.js             # Icon generator script
│   ├── generate-icons.py             # Python icon generator
│   ├── test-pwa.js                   # PWA testing script
│   └── update-references.sh          # Updates file paths after reorganization
│
├── 🎨 assets/                        # Media files & screenshots
│   └── screenshots/                  # Project screenshots
│       ├── Screenshot 2025-10-15 at 11.32.52 PM.png
│       ├── Screenshot 2025-10-16 at 12.01.40 AM.png
│       ├── Screenshot 2025-10-16 at 11.12.53 AM.png
│       ├── Screenshot 2025-10-16 at 11.13.27 AM.png
│       ├── IMG_158EBE9FDF89-1.jpeg
│       └── test-error.png
│
├── ✅ tests/                         # All test files
│   ├── e2e/                          # End-to-end tests
│   ├── playwright-report/            # Test reports
│   ├── test-results/                 # Test results
│   ├── pwa-test.spec.js              # PWA tests
│   ├── settings-install-test.spec.js # Settings page tests
│   └── ... (other test files)
│
├── 📋 tasks/                         # Project tasks & requirements
│   └── PRD.md                        # Product Requirements Document
│
├── 🏗️ dist/                          # Built/compiled files (gitignored)
│
├── 💻 src/                           # Source code (future)
│   └── (for breaking down monolithic index.html)
│
├── ⚙️ Root Files                     # Configuration & main files
│   ├── index.html                    # Main application file
│   ├── style.css                     # Main stylesheet
│   ├── script.js                     # Main JavaScript
│   ├── package.json                  # NPM dependencies
│   ├── package-lock.json             # NPM lock file
│   ├── netlify.toml                  # Netlify deployment config
│   ├── .gitignore                    # Git ignore rules
│   ├── .env                          # Environment variables (gitignored)
│   ├── config.js                     # Firebase config (gitignored)
│   ├── config.template.js            # Config template
│   ├── README.md                     # Project overview
│   ├── PROJECT_STRUCTURE.md          # This file
│   └── PROJECT_REORGANIZATION_PLAN.md # Reorganization plan
│
└── 📦 node_modules/                  # NPM dependencies (gitignored)
```

---

## 🎯 Directory Purposes

### `/docs` - Documentation
All project documentation organized by category:
- **pwa/** - Progressive Web App documentation
- **features/** - Feature-specific guides
- **development/** - Development workflows
- **sop/** - Standard Operating Procedures

### `/public` - Public Assets
Files that are served directly to users:
- **icons/** - PWA app icons in various sizes
- **manifest.json** - PWA configuration
- **service-worker.js** - Offline functionality
- **audio files** - Sound effects

### `/experiments` - Prototypes
Experimental code and design prototypes:
- **tree-designs/** - Various tree visualization experiments
- Test files that aren't production code

### `/scripts` - Automation
Build and utility scripts:
- Icon generation tools
- Configuration generators
- Testing utilities
- Project maintenance scripts

### `/assets` - Media Files
Images, screenshots, and media:
- **screenshots/** - Project documentation screenshots
- Design assets
- Reference images

### `/tests` - Testing
All test files and test-related code:
- Playwright tests
- E2E tests
- Test reports and results

---

## 📍 Finding Things Quickly

### Looking for...

**PWA Documentation?**
→ `docs/pwa/`

**How to convert another app to PWA?**
→ `docs/pwa/HOW_TO_CONVERT_ANY_APP_TO_PWA.md`

**Installation instructions for users?**
→ `docs/pwa/INSTALLATION_GUIDE.md`

**Development workflow?**
→ `docs/development/GIT_WORKFLOW.md`

**Deployment guide?**
→ `docs/sop/DEPLOYMENT_GUIDE.md`

**Troubleshooting?**
→ `docs/sop/TROUBLESHOOTING_GUIDE.md`

**App icons?**
→ `public/icons/`

**Tree design experiments?**
→ `experiments/tree-designs/`

**Screenshots?**
→ `assets/screenshots/`

**Test files?**
→ `tests/`

**Build scripts?**
→ `scripts/`

---

## 🔗 Key File Paths

### Referenced in Code

These paths are used in the application code:

```javascript
// PWA Manifest
<link rel="manifest" href="/public/manifest.json">

// Service Worker
navigator.serviceWorker.register('/public/service-worker.js')

// App Icons
<link rel="apple-touch-icon" href="/public/icons/icon-152x152.png">

// Audio Files
const audio = new Audio('/public/bell-click-sound-slow-smo-ocxvfkrh.wav')
```

### In manifest.json

```json
{
  "icons": [
    {
      "src": "/public/icons/icon-192x192.png",
      ...
    }
  ]
}
```

---

## ✨ Benefits of This Organization

### 1. **Clear Separation**
- Documentation is separate from code
- Assets are separate from source
- Experiments don't clutter main code

### 2. **Easy Navigation**
- New developers can find things quickly
- Logical grouping of related files
- Follows industry best practices

### 3. **Scalability**
- Easy to add new documentation
- Room for breaking down monolithic files
- Can grow without becoming messy

### 4. **Maintainability**
- Clear where new files should go
- Easy to clean up old files
- Reduced root directory clutter

---

## 🚀 Working with This Structure

### Adding New Documentation
```bash
# PWA-related
→ docs/pwa/NEW_PWA_FEATURE.md

# Feature-specific
→ docs/features/NEW_FEATURE.md

# Development workflow
→ docs/development/NEW_WORKFLOW.md
```

### Adding New Scripts
```bash
→ scripts/new-build-script.js
```

### Adding New Experiments
```bash
→ experiments/tree-designs/new-tree-style.html
→ experiments/ui-experiments/new-design.html
```

### Adding New Tests
```bash
→ tests/test-new-feature.spec.js
```

---

## 🔄 Migration Notes

### What Changed?

**Before:**
- 50+ files in root directory
- Documentation scattered everywhere
- No clear organization

**After:**
- Clean root with only essential files
- Documentation organized by category
- Clear purpose for each directory

### File Path Updates

All file paths were automatically updated:
- ✅ `manifest.json` → `public/manifest.json`
- ✅ `service-worker.js` → `public/service-worker.js`
- ✅ `icons/*` → `public/icons/*`
- ✅ Audio files → `public/`

### Backwards Compatibility

The app works exactly the same - only the file organization changed!

---

## 📝 Adding to This Project

### New Feature?
1. Add code to `index.html` (or `src/` if modularized)
2. Add documentation to `docs/features/`
3. Add tests to `tests/`
4. Update `README.md`

### New Documentation?
1. Choose appropriate `docs/` subdirectory
2. Create markdown file
3. Link from main `README.md`

### New Experiment?
1. Add to `experiments/` with descriptive folder
2. Document what it's testing
3. Move to production when ready

---

## 🎉 Result

A clean, professional, and maintainable project structure that's easy to navigate and scales well!

**Root directory went from 50+ files to ~15 essential files!** 🎊
