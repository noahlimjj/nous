# system architecture

## overview

nous is a single-page application (spa) for habit tracking and collaborative study sessions. the entire application is contained within `index.html` with embedded javascript and tailwind css for styling.

## technology stack

- **frontend**: vanilla javascript (no framework)
- **styling**: tailwind css (cdn)
- **database**: firebase firestore
- **authentication**: firebase auth (email/password + anonymous)
- **hosting**: netlify
- **testing**: playwright

## application structure

### file organization

```
/
├── index.html              # main application (spa with embedded js)
├── config.js              # firebase configuration (gitignored)
├── script.js              # external utility scripts
├── style.css              # additional custom styles
├── sop/                   # standard operating procedures
│   ├── screenshots/       # visual documentation
│   └── *.md              # development docs, fixes, processes
├── system/               # architecture and database docs
│   ├── ARCHITECTURE.md   # this file
│   ├── DATABASE.md       # database schema
│   └── firestore.rules   # security rules
├── tasks/                # product requirements and planning
│   └── PRD.md           # product requirements document
└── tests/                # test suite
    ├── e2e/             # end-to-end tests
    ├── test-*.js        # test files
    └── playwright.config.js

```

## core components

### 1. authentication system
- **location**: lines ~200-400 in index.html
- **providers**:
  - email/password authentication
  - anonymous/guest mode
- **user management**: stores user metadata in firestore users collection

### 2. habit management
- **location**: lines ~1000-1500 in index.html
- create, rename, delete habits
- track habit-specific statistics
- support for drag-and-drop reordering

### 3. timer system
- **solo timer**: individual study sessions
- **nous together**: collaborative timer with real-time sync
- supports play, pause, stop states
- millisecond precision tracking

### 4. session tracking
- automatic session creation on timer stop
- manual session entry (backdating)
- session deletion with confirmation
- stores: habitId, duration, timestamp, notes

### 5. social features
- **friend system**: friend codes for discovery
- **leaderboard**: weekly rankings
- **nous requests**: send/accept collaboration invites
- **shared timers**: real-time synchronized study sessions
- **chat**: in-session messaging

### 6. gamification
- **tree growth system**: visual progress indicators
- unlockable trees at milestones (1h, 5h, 10h, etc.)
- seasonal variations (cherry blossom, autumn maple, etc.)
- progress-based encouragement messages

### 7. reports & analytics
- monthly time breakdown by habit
- session history with filtering
- streak tracking
- total time statistics

## data flow

### session creation flow
1. user starts timer
2. active timer saved to firestore (activeTimers collection)
3. user stops timer
4. session created in sessions collection
5. habit statistics updated
6. tree progress recalculated
7. ui updated with new data

### nous together flow
1. user sends nous request
2. request stored in nousRequests collection
3. recipient accepts request
4. shared timer created in sharedTimers collection
5. real-time listeners sync timer state
6. sessions saved for both participants on stop
7. cleanup: timer and request deleted

## security model

- **authentication required**: no read/write without auth
- **user isolation**: users can only access their own data
- **path-based rules**: `/artifacts/{appId}/users/{userId}/...`
- **shared resources**: nousRequests, sharedTimers, chatMessages have special rules
- see `system/firestore.rules` for complete security rules

## state management

- **global state**: stored in window object
- **reactive updates**: firestore real-time listeners
- **ui synchronization**: callback-based rendering
- **persistence**: all state persisted to firestore

## key design decisions

### single-file architecture
- **pros**: simple deployment, no build process, easy to understand
- **cons**: large file size, harder to navigate

### firebase as backend
- **pros**: real-time sync, authentication, scalability
- **cons**: vendor lock-in, requires online connection

### no framework approach
- **pros**: lightweight, fast load times, no dependencies
- **cons**: manual dom manipulation, more verbose code

### embedded javascript
- **pros**: everything in one place, no external deps
- **cons**: harder to test, no module system

## performance considerations

- firestore queries limited by user context
- real-time listeners cleaned up on unmount
- images/trees rendered as svg (lightweight)
- tailwind css loaded from cdn (cached)
- lazy loading of reports/statistics

## deployment

- **development**: local python http server or npm start
- **production**: netlify with automatic deploys
- **config**: firebase credentials injected via environment variables
- **security**: config.js excluded from git

## future improvements

- migrate to modular javascript architecture
- implement service worker for offline support
- add unit tests for core logic
- extract reusable components
- implement proper state management (redux/zustand)
- add build process for optimization
