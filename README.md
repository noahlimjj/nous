# nous

> a mindful study companion for building focused work habits

![Version](https://img.shields.io/badge/version-1.5-blue)
![Status](https://img.shields.io/badge/status-active-green)

nous is a single-page web application that combines precise time tracking with social accountability and progress visualization. track your study habits, connect with study partners, and watch your progress grow through unlockable tree visualizations.

---

## quick start

### prerequisites
- python 3 or node.js
- firebase account
- modern web browser

### setup
```bash
# 1. clone repository
git clone <your-repo-url>
cd Study_tracker_app

# 2. configure firebase
cp config.template.js config.js
# edit config.js with your firebase credentials

# 3. run locally
npm start
# or
python3 -m http.server 8080

# 4. open browser
open http://localhost:8080
```

detailed setup: see `sop/DEPLOYMENT_GUIDE.md`

---

## project structure

```
Study_tracker_app/
├── README.md              # 📍 you are here - project index
├── index.html             # 🎯 main application (spa)
├── config.js              # 🔐 firebase config (gitignored)
├── config.template.js     # 📋 config template
├── script.js              # 🔧 utility scripts
├── style.css              # 🎨 additional styles
│
├── sop/                   # 📚 standard operating procedures
│   ├── screenshots/       # 📸 visual documentation
│   ├── CHANGES_SUMMARY.md
│   ├── DEBUG_INSTRUCTIONS.md
│   ├── DELETE_SESSION_FEATURE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── FIX_FIRESTORE_RULES.md
│   ├── Friends.md
│   ├── HABIT_RENAME_FIX.md
│   ├── NOUS_REQUEST_DEBUG.md
│   ├── QUICK_FIX_GUIDE.md
│   ├── SECURITY.md
│   ├── TIMER_FIX_SUMMARY.md
│   ├── TREE_DESIGN_IMPROVEMENTS.md
│   ├── TREE_DEVELOPMENT_PROCESS.md
│   ├── TROUBLESHOOTING_GUIDE.md
│   ├── game.md
│   └── token.md
│
├── system/                # 🏗️ architecture & database
│   ├── ARCHITECTURE.md    # system design & tech stack
│   ├── DATABASE.md        # firestore schema & queries
│   └── firestore.rules    # security rules
│
├── tasks/                 # 📋 product & planning
│   └── PRD.md            # product requirements document
│
└── tests/                 # 🧪 test suite
    ├── e2e/              # end-to-end tests
    ├── playwright-report/
    ├── test-results/
    ├── playwright.config.js
    └── test-*.js         # test files

```

---

## documentation map

### 🚀 getting started
| document | purpose |
|----------|---------|
| `README.md` | project overview and index |
| `sop/DEPLOYMENT_GUIDE.md` | setup and deployment instructions |
| `sop/QUICK_FIX_GUIDE.md` | common issues and fixes |
| `sop/TROUBLESHOOTING_GUIDE.md` | debugging guide |

### 🏗️ architecture & system
| document | purpose |
|----------|---------|
| `system/ARCHITECTURE.md` | system design, tech stack, component overview |
| `system/DATABASE.md` | firestore schema, collections, queries |
| `system/firestore.rules` | database security rules |

### 📋 product & planning
| document | purpose |
|----------|---------|
| `tasks/PRD.md` | product requirements, features, roadmap |

### 🔧 development & fixes
| document | purpose |
|----------|---------|
| `sop/CHANGES_SUMMARY.md` | recent changes and updates |
| `sop/DEBUG_INSTRUCTIONS.md` | debugging workflows |
| `sop/TIMER_FIX_SUMMARY.md` | timer bug fixes |
| `sop/HABIT_RENAME_FIX.md` | habit rename fix details |
| `sop/NOUS_REQUEST_DEBUG.md` | nous together debugging |
| `sop/FIX_FIRESTORE_RULES.md` | security rules fixes |
| `sop/DELETE_SESSION_FEATURE.md` | session deletion feature |
| `sop/TREE_DESIGN_IMPROVEMENTS.md` | tree system improvements |
| `sop/TREE_DEVELOPMENT_PROCESS.md` | tree feature development |
| `sop/Friends.md` | friend system documentation |
| `sop/game.md` | gamification design notes |
| `sop/token.md` | authentication tokens |

### 🔒 security
| document | purpose |
|----------|---------|
| `sop/SECURITY.md` | security best practices |
| `system/firestore.rules` | database security rules |

### 🧪 testing
| location | purpose |
|----------|---------|
| `tests/` | all test files and configurations |
| `tests/e2e/` | end-to-end test suite |
| `tests/playwright.config.js` | test runner configuration |

---

## core features

### ⏱️ time tracking
- **solo timer**: precise time tracking with play/pause/stop
- **manual entry**: backdate sessions when needed
- **persistence**: survives page refresh

### 📊 habit management
- create unlimited habits/subjects
- rename, reorder, delete habits
- per-habit statistics and history

### 🌳 progress visualization
- unlockable trees at milestones (1h, 5h, 10h, 25h, 50h, 100h, 250h, 500h, 1000h)
- seasonal variations (cherry blossom, autumn maple, evergreen)
- visual progress indicators

### 👥 social features
- **friend system**: connect via unique friend codes
- **leaderboard**: weekly rankings among friends
- **nous together**: synchronized study sessions
- **in-session chat**: communicate during shared sessions

### 📈 analytics
- monthly reports by habit
- session history with filtering
- total time and streak tracking

---

## tech stack

| layer | technology |
|-------|-----------|
| frontend | vanilla javascript (no framework) |
| styling | tailwind css (cdn) |
| database | firebase firestore |
| authentication | firebase auth |
| hosting | netlify |
| testing | playwright |

---

## development workflow

### local development
```bash
# start dev server
npm start

# run tests
npx playwright test

# run specific test
npx playwright test test-nous-flow.js

# view test report
npx playwright show-report
```

### making changes
1. read relevant docs in `sop/` and `system/`
2. make changes to `index.html`
3. test locally
4. run test suite
5. commit with descriptive message
6. push to deploy

### debugging
1. check `sop/DEBUG_INSTRUCTIONS.md`
2. check `sop/TROUBLESHOOTING_GUIDE.md`
3. review firebase console for backend errors
4. check browser console for frontend errors

### adding features
1. document requirements in `tasks/`
2. review architecture in `system/ARCHITECTURE.md`
3. check database schema in `system/DATABASE.md`
4. implement feature
5. add tests
6. update documentation

---

## key design principles

### mindfulness over gamification
- calm color palette
- minimal distractions
- gentle encouragement
- focus on the work

### clarity over cleverness
- obvious controls
- clear state indicators
- consistent patterns
- readable typography

### function over form
- fast interactions
- no unnecessary steps
- predictable behavior
- keyboard shortcuts

---

## common tasks

### deploy to production
see `sop/DEPLOYMENT_GUIDE.md`

### fix timer issues
see `sop/TIMER_FIX_SUMMARY.md`

### debug nous together
see `sop/NOUS_REQUEST_DEBUG.md`

### update security rules
see `sop/FIX_FIRESTORE_RULES.md` and `system/firestore.rules`

### add new tree
see `sop/TREE_DEVELOPMENT_PROCESS.md`

### troubleshoot bugs
see `sop/TROUBLESHOOTING_GUIDE.md`

---

## database overview

### main collections
```
users/                          # user profiles
artifacts/{appId}/users/{userId}/
  ├── habits/                   # user's habits
  ├── sessions/                 # completed sessions
  └── activeTimers/             # running timers

nousRequests/                   # study invitations
sharedTimers/                   # collaborative sessions
chatMessages/                   # in-session messages
```

full schema: see `system/DATABASE.md`

---

## testing

### test organization
```
tests/
├── test-nous-flow.js          # nous together workflow
├── test-habits-features.js    # habit management
├── test-shared-timer-status.js # timer synchronization
├── test-rename-*.js           # habit rename tests
├── test-reset-progress.js     # progress reset
└── e2e/                       # end-to-end scenarios
```

### running tests
```bash
# all tests
npx playwright test

# specific test
npx playwright test test-nous-flow.js

# headed mode (see browser)
npx playwright test --headed

# debug mode
npx playwright test --debug
```

---

## recent changes

see `sop/CHANGES_SUMMARY.md` for latest updates

recent highlights:
- uncapitalized all text for mindful aesthetic
- added maple tree at 5 hours with autumn leaves
- improved tree progress messages
- fixed tree growth latent period
- fixed nous together session saving for both participants

---

## troubleshooting

### common issues

**firebase config not found**
- ensure `config.js` exists (copy from `config.template.js`)
- verify firebase credentials

**permission denied errors**
- check `system/firestore.rules`
- verify user is authenticated
- ensure user id matches security rules

**timer not updating**
- check browser console for errors
- verify javascript is enabled
- try refreshing the page

**nous together not working**
- see `sop/NOUS_REQUEST_DEBUG.md`
- check both users are online
- verify firestore connection

full guide: see `sop/TROUBLESHOOTING_GUIDE.md`

---

## contributing

### before making changes
1. read architecture docs in `system/`
2. check existing issues in `sop/`
3. review recent changes in `sop/CHANGES_SUMMARY.md`

### development process
1. create feature branch
2. make changes
3. test thoroughly
4. update documentation
5. submit pull request

### documentation standards
- update relevant docs in `sop/` for fixes
- update `system/` docs for architectural changes
- update `tasks/PRD.md` for new features
- keep `README.md` as the main index

---

## license

mit license - see license file for details

---

## support

- **issues**: check `sop/TROUBLESHOOTING_GUIDE.md`
- **firebase errors**: check firebase console
- **frontend errors**: check browser console
- **architecture questions**: see `system/ARCHITECTURE.md`
- **database questions**: see `system/DATABASE.md`

---

built with ❤️ using vanilla javascript, firebase, and tailwind css
