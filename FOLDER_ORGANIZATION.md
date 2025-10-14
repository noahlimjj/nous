# folder organization summary

## before reorganization

```
Study_tracker_app/
├── index.html
├── config.js
├── *.md files (18 docs scattered)
├── *.png files (20 screenshots scattered)
├── test-*.js files (30+ test files scattered)
├── debug-*.js files
├── create-test-*.js files
├── firestore.rules
├── e2e/
├── playwright-report/
├── test-results/
└── other files...

Total: 93 items in root directory (cluttered)
```

## after reorganization

```
Study_tracker_app/
├── README.md              📍 main index and project overview
├── QUICK_REFERENCE.md     ⚡ one-page reference guide
├── FOLDER_ORGANIZATION.md 📁 this file
│
├── index.html             🎯 main application
├── config.js              🔐 firebase config
├── config.template.js     📋 config template
├── script.js              🔧 utility scripts
├── style.css              🎨 styles
│
├── sop/                   📚 standard operating procedures
│   ├── INDEX.md           📍 sop navigation index
│   ├── screenshots/       📸 all visual documentation (20 files)
│   └── *.md              📄 progress, fixes, mistakes (18 docs)
│
├── system/                🏗️ technical architecture
│   ├── ARCHITECTURE.md    🏛️ system design & tech stack
│   ├── DATABASE.md        🗄️ firestore schema & queries
│   └── firestore.rules    🔒 security rules
│
├── tasks/                 📋 product & planning
│   └── PRD.md            📊 product requirements document
│
└── tests/                 🧪 complete test suite
    ├── e2e/              🔄 end-to-end tests
    ├── playwright-report/
    ├── test-results/
    ├── playwright.config.js
    ├── test-*.js         ✅ all test files (30+)
    ├── debug-*.js        🐛 debug scripts
    └── create-test-*.js  🛠️ test utilities

Total: 21 items in root directory (organized)
```

## organization principles

### sop/ (standard operating procedures)
**purpose**: document progress, fixes, and learning

**contains**:
- development progress docs
- bug fixes and solutions
- troubleshooting guides
- deployment instructions
- security guidelines
- all screenshots

**when to use**:
- documenting a bug fix
- writing troubleshooting steps
- recording progress on features
- saving screenshots of issues/solutions

### system/ (architecture & database)
**purpose**: technical foundation documentation

**contains**:
- architecture overview
- database schema
- security rules

**when to use**:
- understanding system design
- planning database changes
- updating security rules
- onboarding new developers

### tasks/ (product & planning)
**purpose**: product requirements and roadmap

**contains**:
- product requirements document (prd)
- feature specifications
- roadmap planning

**when to use**:
- planning new features
- understanding product vision
- prioritizing work
- defining requirements

### tests/ (quality assurance)
**purpose**: all testing code and reports

**contains**:
- playwright tests
- e2e tests
- test utilities
- debug scripts
- test reports

**when to use**:
- running tests
- writing new tests
- debugging test failures
- viewing test reports

## file naming conventions

### documentation files
- UPPERCASE_WITH_UNDERSCORES.md for guides (e.g., DEPLOYMENT_GUIDE.md)
- lowercase-with-dashes.md for notes (e.g., token.md, game.md)
- INDEX.md for navigation indexes

### test files
- test-*.js for test suites
- debug-*.js for debugging scripts
- create-test-*.js for test utilities

### system files
- ARCHITECTURE.md for system design
- DATABASE.md for data schemas
- firestore.rules for security

## navigation guide

### i want to...

**understand the project**
→ start with `README.md`

**find a specific document**
→ check `README.md` documentation map
→ or `sop/INDEX.md` for sop docs

**set up the project**
→ `sop/DEPLOYMENT_GUIDE.md`

**fix a bug**
→ `sop/TROUBLESHOOTING_GUIDE.md`
→ check relevant `sop/*.md` docs

**understand the code**
→ `system/ARCHITECTURE.md`

**understand the database**
→ `system/DATABASE.md`

**add a feature**
→ `tasks/PRD.md` (requirements)
→ `system/ARCHITECTURE.md` (design)
→ `system/DATABASE.md` (data needs)

**run tests**
→ `tests/` directory
→ `QUICK_REFERENCE.md` for commands

**quick reference**
→ `QUICK_REFERENCE.md`

## benefits of new organization

### before (problems)
- 93 files in root directory
- hard to find specific documents
- unclear file purposes
- scattered test files
- screenshots mixed with code
- no clear entry point

### after (benefits)
- 21 files in root directory
- clear folder structure
- obvious file organization
- grouped by purpose
- easy navigation via indexes
- README.md as main entry point
- quick reference available

## maintenance guidelines

### adding new files

**new documentation about a fix/progress**
→ add to `sop/` with descriptive name
→ update `sop/CHANGES_SUMMARY.md`
→ consider updating `sop/INDEX.md`

**new screenshot**
→ add to `sop/screenshots/`
→ use descriptive filename

**new test**
→ add to `tests/` with `test-*.js` naming
→ follow existing test patterns

**architecture change**
→ update `system/ARCHITECTURE.md`
→ update `system/DATABASE.md` if needed
→ note in `sop/CHANGES_SUMMARY.md`

**new feature planning**
→ update `tasks/PRD.md`

### updating existing files

**when fixing a bug**
1. fix code in `index.html`
2. document fix in relevant `sop/*.md` file
3. update `sop/CHANGES_SUMMARY.md`
4. add test if needed in `tests/`

**when changing architecture**
1. update `system/ARCHITECTURE.md`
2. update `system/DATABASE.md` if schema changes
3. update `system/firestore.rules` if security changes
4. note in `sop/CHANGES_SUMMARY.md`

**when adding feature**
1. plan in `tasks/PRD.md`
2. implement in `index.html`
3. document in `sop/` with progress notes
4. add tests in `tests/`
5. update `README.md` if major feature

## folder size estimates

```
sop/           ~20 files (docs + screenshots)
system/        ~3 files (architecture docs)
tasks/         ~1 file (PRD, will grow)
tests/         ~40 files (tests + reports + utilities)
```

## consistency checklist

when adding new content, ensure:
- [ ] file is in correct folder
- [ ] filename follows conventions
- [ ] relevant index is updated
- [ ] README.md links to it (if major)
- [ ] other related docs are updated

---

**last updated**: october 2024
**reorganization completed**: october 14, 2024
