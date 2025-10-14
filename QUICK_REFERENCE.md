# quick reference guide

> one-page reference for common operations

## file locations

| what you need | where to find it |
|---------------|------------------|
| main application code | `index.html` |
| firebase config | `config.js` (create from `config.template.js`) |
| security rules | `system/firestore.rules` |
| database schema | `system/DATABASE.md` |
| architecture docs | `system/ARCHITECTURE.md` |
| product requirements | `tasks/PRD.md` |
| bug fixes & progress | `sop/` (see `sop/INDEX.md`) |
| test files | `tests/` |

## common commands

```bash
# development
npm start                           # start dev server (port 3000)
python3 -m http.server 8080        # alternative dev server

# testing
npx playwright test                 # run all tests
npx playwright test --headed        # see browser during tests
npx playwright test filename.js    # run specific test
npx playwright show-report         # view test report

# git
git status                         # check current status
git add .                          # stage all changes
git commit -m "message"            # commit changes
git push                           # deploy to netlify

# file operations
ls sop/                            # list sop documents
ls tests/                          # list tests
ls system/                         # list system docs
```

## troubleshooting checklist

when something breaks:

1. **check browser console** - look for javascript errors
2. **check firebase console** - look for database errors
3. **check authentication** - is user logged in?
4. **check firestore rules** - are permissions correct?
5. **read** `sop/TROUBLESHOOTING_GUIDE.md`
6. **check** relevant fix document in `sop/`

## key code locations (index.html)

| feature | approximate line range |
|---------|----------------------|
| authentication | 200-400 |
| habit management | 1000-1500 |
| timer system | 1500-2000 |
| nous together | 1200-1400 |
| session tracking | 1400-1600 |
| friend system | 650-900 |
| tree visualization | 2500-3000 |

use `grep -n "searchterm" index.html` to find exact locations

## database collections

```
users/                              # user profiles, friend codes
artifacts/{appId}/users/{userId}/
  ├── habits/                       # user's habits
  ├── sessions/                     # completed sessions
  └── activeTimers/                 # currently running timers
nousRequests/                       # collaboration invites
sharedTimers/                       # active shared sessions
chatMessages/                       # in-session chat
```

full schema: `system/DATABASE.md`

## debug commands

```javascript
// in browser console

// check firebase connection
console.log(window.firebase)

// check current user
console.log(window.currentUser)

// check app state
console.log(window.db)

// manually trigger function
window.functionName()
```

## testing workflow

```bash
# 1. write test
nano tests/test-my-feature.js

# 2. run test
npx playwright test test-my-feature.js --headed

# 3. debug if needed
npx playwright test test-my-feature.js --debug

# 4. run all tests to ensure nothing broke
npx playwright test
```

## deployment workflow

```bash
# 1. test locally
npm start
# test in browser

# 2. run test suite
npx playwright test

# 3. commit changes
git add .
git commit -m "descriptive message"

# 4. push to deploy
git push
# netlify auto-deploys from git

# 5. verify deployment
# check netlify dashboard
# test live site
```

## documentation workflow

### when fixing a bug
1. reproduce the issue
2. fix the code in `index.html`
3. test the fix
4. document in `sop/` (create or update relevant .md file)
5. update `sop/CHANGES_SUMMARY.md`

### when adding a feature
1. document requirements in `tasks/PRD.md`
2. check architecture in `system/ARCHITECTURE.md`
3. check database needs in `system/DATABASE.md`
4. implement in `index.html`
5. add tests in `tests/`
6. document progress in `sop/`
7. update `README.md` if needed

### when changing architecture
1. document changes in `system/ARCHITECTURE.md`
2. update `system/DATABASE.md` if schema changes
3. update `system/firestore.rules` if security changes
4. update `README.md` overview
5. notify in `sop/CHANGES_SUMMARY.md`

## emergency fixes

### config issues
```bash
cp config.template.js config.js
# edit config.js with correct firebase credentials
```

### permission denied errors
- check `system/firestore.rules`
- verify userId matches in database path
- ensure user is authenticated

### timer not working
- see `sop/TIMER_FIX_SUMMARY.md`
- check browser console for errors
- verify firestore connection

### nous together fails
- see `sop/NOUS_REQUEST_DEBUG.md`
- check both users are authenticated
- verify sharedTimers collection access

## useful grep patterns

```bash
# find function definitions
grep -n "function.*functionName" index.html

# find collection references
grep -n "collection(db" index.html

# find security rule for collection
grep -A 5 "match /collectionName" system/firestore.rules

# find where variable is used
grep -n "variableName" index.html

# find all TODOs
grep -n "TODO" index.html
```

## documentation hierarchy

```
README.md                    # start here - project index
├── system/                  # technical architecture
│   ├── ARCHITECTURE.md     # how it's built
│   └── DATABASE.md         # data structure
├── tasks/                   # what to build
│   └── PRD.md              # product requirements
├── sop/                     # how it was built
│   ├── INDEX.md            # sop navigation
│   └── *.md                # progress & fixes
└── tests/                   # how to test
    └── test-*.js           # test files
```

## get help

- **bug/issue**: check `sop/TROUBLESHOOTING_GUIDE.md`
- **setup/deploy**: check `sop/DEPLOYMENT_GUIDE.md`
- **architecture**: check `system/ARCHITECTURE.md`
- **database**: check `system/DATABASE.md`
- **features**: check `tasks/PRD.md`
- **fixes**: check `sop/INDEX.md`

---

**tip**: bookmark this file for quick reference during development
