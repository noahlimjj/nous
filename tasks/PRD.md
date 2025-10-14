# product requirements document

## product overview

### vision
nous is a mindful study companion that transforms time tracking into a contemplative practice. it combines precise time tracking with social accountability and gamified progress visualization to help users build consistent study habits.

### mission
create a calm, distraction-free environment where users can focus on their work while gently tracking their progress and connecting with study partners.

### product name
**nous** (greek: νοῦς) - meaning "mind, intellect, consciousness"

## target audience

### primary users
- students (high school, college, self-learners)
- knowledge workers and professionals
- anyone building focused work habits

### user personas

**persona 1: the solo studier**
- needs: accurate time tracking, progress visualization, motivation
- pain points: difficulty staying consistent, lack of accountability
- goals: build study habits, reach time-based milestones

**persona 2: the social learner**
- needs: study partners, friendly competition, shared accountability
- pain points: studying alone feels isolating
- goals: connect with friends, stay motivated together

**persona 3: the polymath**
- needs: tracking multiple subjects/projects simultaneously
- pain points: losing track of time allocation across interests
- goals: balanced progress across multiple areas

## core features

### 1. habit management
**priority**: p0 (must have)

- create unlimited habits/subjects
- rename habits with real-time sync
- delete habits with cascade delete of sessions
- drag-and-drop reordering
- per-habit statistics (total time, session count)

**acceptance criteria**:
- habits persist across sessions
- habit changes reflect immediately
- deletion requires confirmation
- order persists across devices

### 2. time tracking
**priority**: p0 (must have)

**solo timer**:
- start, pause, resume, stop
- millisecond precision
- runs in background
- survives page refresh
- displays current duration

**manual entry**:
- backdate sessions
- specify duration and date
- add optional notes

**acceptance criteria**:
- timer accuracy within 100ms
- no data loss on refresh
- timer state syncs to database
- manual entries validate duration

### 3. session history
**priority**: p0 (must have)

- view all completed sessions
- filter by habit
- filter by date range
- delete sessions with confirmation
- display session metadata (time, duration, notes)

**acceptance criteria**:
- pagination for large datasets
- real-time updates
- deletion updates statistics
- sessions sorted by date

### 4. authentication
**priority**: p0 (must have)

- email/password authentication
- anonymous/guest mode
- persistent login
- secure logout

**acceptance criteria**:
- passwords hashed by firebase
- guest data persists during session
- seamless upgrade from guest to registered
- authentication state persists

### 5. progress visualization (trees)
**priority**: p1 (should have)

**tree growth system**:
- unlock trees at milestones (1h, 5h, 10h, 25h, 50h, 100h, 250h, 500h, 1000h)
- visual tree progression
- seasonal variations (cherry blossom, autumn maple, evergreen, ancient oak)
- encouraging messages on unlocks

**tree types**:
| milestone | tree type | visual theme |
|-----------|-----------|--------------|
| 1h | young sprout | green leaves |
| 5h | maple tree | orange autumn |
| 10h | cherry blossom | pink flowers |
| 25h | oak tree | strong branches |
| 50h | willow tree | flowing leaves |
| 100h | pine tree | evergreen |
| 250h | redwood | towering |
| 500h | ancient oak | wise, sturdy |
| 1000h | world tree | mystical |

**acceptance criteria**:
- trees unlock based on total time
- smooth visual transitions
- trees scale with progress
- responsive on all devices

### 6. nous together (collaborative timer)
**priority**: p1 (should have)

**features**:
- send nous request to friend
- accept/decline invitations
- shared timer with real-time sync
- both participants' timers synchronized
- session saved for both users
- in-session chat

**flow**:
1. user sends request with habit selection
2. friend receives notification
3. friend accepts and selects their habit
4. shared timer starts
5. both users see synchronized timer
6. either user can pause/stop
7. sessions saved for both participants

**acceptance criteria**:
- timer state syncs within 1 second
- no desync issues
- graceful handling of disconnections
- chat messages appear in real-time
- cleanup after session ends

### 7. social features
**priority**: p1 (should have)

**friend system**:
- unique 6-character friend code
- add friends by code
- view friends list
- see friends' weekly progress

**leaderboard**:
- weekly time rankings
- top 10 friends displayed
- resets every monday
- shows rank, name, time

**acceptance criteria**:
- friend codes unique and memorable
- leaderboard updates in real-time
- privacy: only friends see your stats
- leaderboard shows accurate rankings

### 8. reports & analytics
**priority**: p2 (nice to have)

**monthly reports**:
- total time per habit
- session count
- daily breakdown
- calendar heatmap
- habit distribution chart

**weekly summary**:
- total weekly time
- habit breakdown
- comparison to previous week
- streak information

**acceptance criteria**:
- accurate calculations
- performant queries
- visual charts
- exportable data

### 9. settings & preferences
**priority**: p2 (nice to have)

**user settings**:
- change display name
- update email/password
- notification preferences
- theme customization
- reset all progress (with confirmation)

**app settings**:
- timer sound preferences
- auto-pause after idle
- week start day (monday/sunday)

**acceptance criteria**:
- settings persist across devices
- reset has multi-step confirmation
- changes apply immediately

## user flows

### first-time user flow
1. land on login page
2. choose guest mode or sign up
3. see empty dashboard with tutorial
4. create first habit
5. start first timer
6. receive encouragement on first session
7. unlock first tree at 1 hour

### returning user flow
1. automatic login
2. see dashboard with habits
3. click play on a habit
4. timer starts immediately
5. optionally send nous request
6. view progress in trees section

### nous together flow
1. user a sends request to user b
2. user b receives notification
3. user b accepts and selects habit
4. shared timer view appears
5. synchronized timer runs
6. users chat during session
7. either user stops timer
8. sessions saved for both
9. return to solo dashboard

## technical requirements

### performance
- **page load**: < 2 seconds on 3g
- **timer update**: 60fps (smooth)
- **real-time sync**: < 1 second latency
- **database queries**: < 500ms p95

### browser support
- chrome 90+
- firefox 88+
- safari 14+
- edge 90+
- mobile browsers (ios safari, chrome mobile)

### accessibility
- keyboard navigation support
- screen reader compatibility
- sufficient color contrast (wcag aa)
- focus indicators
- semantic html

### security
- firestore security rules enforced
- authentication required for persistence
- user data isolated
- no xss vulnerabilities
- https only in production

### scalability
- support 10,000 concurrent users
- handle 1M+ sessions per month
- real-time listeners scoped per user
- efficient indexing strategy

## design principles

### 1. mindfulness over gamification
- calm color palette (grays, soft blues)
- minimal animations
- focus on content, not chrome
- gentle encouragement, not pressure

### 2. clarity over cleverness
- obvious controls
- clear state indicators
- readable typography
- consistent patterns

### 3. function over form
- fast interactions
- no unnecessary steps
- keyboard shortcuts
- predictable behavior

### 4. privacy by default
- opt-in social features
- private by default
- explicit sharing
- clear data controls

## success metrics

### engagement metrics
- **daily active users (dau)**: target 60% of registered users
- **weekly active users (wau)**: target 80% of registered users
- **average session duration**: target 45+ minutes
- **sessions per user per week**: target 5+

### retention metrics
- **day 1 retention**: target 70%
- **day 7 retention**: target 50%
- **day 30 retention**: target 30%

### feature adoption
- **nous together usage**: target 40% of users
- **manual entry usage**: target 30% of users
- **leaderboard views**: target 50% of users
- **tree unlocks**: target 70% reach 5h milestone

### quality metrics
- **crash rate**: < 0.1%
- **error rate**: < 1%
- **timer accuracy**: 99.9%
- **sync failures**: < 0.5%

## release roadmap

### v1.0 - mvp (current)
- ✅ solo timer
- ✅ habit management
- ✅ session history
- ✅ authentication
- ✅ basic statistics

### v1.5 - social (current)
- ✅ friend system
- ✅ leaderboard
- ✅ nous together
- ✅ tree visualization
- ✅ chat

### v2.0 - analytics (planned)
- [ ] advanced reports
- [ ] habit insights
- [ ] goal setting
- [ ] streaks & achievements
- [ ] export data

### v2.5 - customization (future)
- [ ] themes
- [ ] custom tree designs
- [ ] habit categories
- [ ] habit templates
- [ ] pomodoro mode

### v3.0 - mobile (future)
- [ ] native mobile app
- [ ] push notifications
- [ ] offline support
- [ ] widget support
- [ ] apple watch integration

## known limitations

### current constraints
- single-page architecture limits testability
- no offline support (requires internet)
- 2-person limit on nous together
- no push notifications
- no mobile app
- no data export yet

### technical debt
- monolithic index.html file
- no proper state management
- manual dom manipulation
- no build process
- limited error handling

### future considerations
- migrate to modular architecture
- implement proper frontend framework
- add comprehensive test coverage
- improve error handling
- add analytics tracking

## open questions

1. should we support group study (>2 people)?
2. is gamification too distracting from mindfulness?
3. should we add pomodoro technique support?
4. do users want habit categories/tags?
5. should we implement habit templates?
6. is there value in streaks tracking?
7. should we add mood/energy tracking?
8. do users want calendar integration?

## appendix

### references
- firebase documentation
- tailwind css documentation
- playwright testing guide
- firestore best practices

### changelog
- 2024-10: initial prd created
- recent: tree system refined, uncapitalized text, fixed shared timer sync
