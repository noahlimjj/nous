# Project Reorganization Plan

## Current Problems
- 📁 Too many files in root directory (50+ files!)
- 🎨 Multiple tree design HTML files scattered everywhere
- 📸 Screenshots not organized
- 📝 Documentation files mixed with code
- 🧪 Test files somewhat organized but could be better

## New Organized Structure

```
Study_tracker_app/
├── .github/                    # GitHub specific files
├── .claude/                    # Claude settings
├── docs/                       # 📚 ALL documentation
│   ├── README.md               # Main documentation
│   ├── pwa/                    # PWA-related docs
│   │   ├── HOW_TO_CONVERT_ANY_APP_TO_PWA.md
│   │   ├── PWA_GUIDE.md
│   │   ├── PWA_SETUP_COMPLETE.md
│   │   ├── PWA_SYNC_EXPLAINED.md
│   │   ├── INSTALLATION_GUIDE.md
│   │   └── FINAL_PWA_SUMMARY.md
│   ├── features/               # Feature documentation
│   │   ├── ICON_DESIGN.md
│   │   ├── TIMER_STOPWATCH_FEATURE.md
│   │   ├── TREE_DESIGN_PROMPT.md
│   │   └── TESTING_MULTI_PARTICIPANT_NOUS.md
│   ├── development/            # Development guides
│   │   ├── FOLDER_ORGANIZATION.md
│   │   ├── GIT_WORKFLOW.md
│   │   ├── QUICK_REFERENCE.md
│   │   └── FIRESTORE_RULES_UPDATE.md
│   └── sop/                    # Standard Operating Procedures
│       ├── INDEX.md
│       ├── DEPLOYMENT_GUIDE.md
│       ├── TROUBLESHOOTING_GUIDE.md
│       ├── SECURITY.md
│       └── ...
├── public/                     # 🌐 Public assets
│   ├── icons/                  # App icons
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   └── ...
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Service worker
│   └── bell-click-sound-slow-smo-ocxvfkrh.wav
├── src/                        # 💻 Source code (if applicable)
│   └── (future: break down index.html into components)
├── experiments/                # 🧪 Experimental/prototype files
│   └── tree-designs/           # All tree design experiments
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
├── tests/                      # ✅ All test files
│   ├── e2e/                    # End-to-end tests
│   ├── playwright-report/      # Test reports
│   ├── test-results/           # Test results
│   └── *.js                    # Test files
├── scripts/                    # 🛠️ Build & utility scripts
│   ├── create-icons.js         # Icon generator
│   ├── generate-config.sh      # Config generator
│   ├── generate-icons.html     # Icon generator UI
│   ├── generate-icons.js       # Icon generator script
│   ├── generate-icons.py       # Python icon generator
│   └── test-pwa.js             # PWA testing script
├── assets/                     # 🎨 Media & screenshots
│   └── screenshots/            # Project screenshots
│       ├── Screenshot 2025-10-15 at 11.32.52 PM.png
│       ├── Screenshot 2025-10-16 at 12.01.40 AM.png
│       ├── Screenshot 2025-10-16 at 11.12.53 AM.png
│       ├── Screenshot 2025-10-16 at 11.13.27 AM.png
│       ├── IMG_158EBE9FDF89-1.jpeg
│       └── test-error.png
├── tasks/                      # 📋 Project tasks
│   └── PRD.md
├── dist/                       # 🏗️ Built files (if using build process)
├── node_modules/               # 📦 Dependencies (gitignored)
├── .env                        # 🔐 Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── config.js                   # Firebase config (gitignored)
├── config.template.js          # Config template
├── index.html                  # 🏠 Main app file
├── style.css                   # 🎨 Main stylesheet
├── script.js                   # ⚡ Main JavaScript (if separate)
├── netlify.toml                # Netlify config
├── package.json                # NPM dependencies
├── package-lock.json           # NPM lock file
└── README.md                   # Project overview

```

## Benefits of This Organization

### 1. **Clear Separation of Concerns**
- Documentation in `/docs`
- Code in root + `/src` (future)
- Assets in `/assets`
- Tests in `/tests`
- Experiments in `/experiments`

### 2. **Easier Navigation**
- Find documentation faster
- Locate test files quickly
- Screenshots are organized
- Experiments don't clutter root

### 3. **Better for Teams**
- New developers can understand structure
- Clear where to add new files
- Follows industry standards

### 4. **Scalability**
- Easy to add more documentation
- Can break down monolithic index.html later
- Room for future features

## Migration Steps

See `REORGANIZATION_SCRIPT.sh` for automated migration.

## After Reorganization

Update these references:
1. ✅ `manifest.json` icon paths → `/public/icons/`
2. ✅ `index.html` manifest link → `/public/manifest.json`
3. ✅ `index.html` service worker → `/public/service-worker.js`
4. ✅ README links to moved docs
5. ✅ Any internal doc links

## Files That Stay in Root

- `index.html` - Main entry point
- `style.css` - Main stylesheet
- `script.js` - Main JavaScript (if used)
- `package.json` - NPM config
- `netlify.toml` - Deployment config
- `.gitignore` - Git config
- `.env` - Environment (gitignored)
- `config.js` - Firebase config (gitignored)
- `config.template.js` - Config template
- `README.md` - Project overview

## Implementation

Run: `bash scripts/reorganize-project.sh`

This will:
1. Create new directory structure
2. Move files to appropriate locations
3. Update file references
4. Verify all links still work
5. Create updated README with new paths
