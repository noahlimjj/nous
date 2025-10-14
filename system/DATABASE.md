# database schema

## overview

nous uses firebase firestore as its database. data is organized in collections with document-based storage. real-time listeners enable live updates across devices.

## collection structure

### root level collections

```
firestore
├── users/
├── nousRequests/
├── sharedTimers/
├── chatMessages/
└── artifacts/
    └── {appId}/
        └── users/
            └── {userId}/
                ├── habits/
                ├── sessions/
                └── activeTimers/
```

## collection schemas

### users collection
**path**: `/users/{userId}`

stores user profile information and statistics.

```javascript
{
  uid: string,              // firebase auth uid
  email: string,            // user email (if not anonymous)
  displayName: string,      // user's display name
  friendCode: string,       // 6-character unique code for friend discovery
  totalTime: number,        // total study time in seconds
  weeklyTime: number,       // time this week in seconds
  friends: string[],        // array of friend userIds
  createdAt: timestamp,     // account creation time
  lastActive: timestamp     // last activity timestamp
}
```

**indexes**:
- friendCode (for friend lookup)

### habits collection
**path**: `/artifacts/{appId}/users/{userId}/habits/{habitId}`

stores user's habits/subjects.

```javascript
{
  id: string,               // auto-generated document id
  name: string,             // habit name (e.g., "study math")
  userId: string,           // owner's userId
  totalTime: number,        // total time spent on this habit (seconds)
  sessionCount: number,     // number of sessions completed
  order: number,            // display order (for drag-drop)
  createdAt: timestamp,     // habit creation time
  lastSessionAt: timestamp  // last session timestamp
}
```

**queries**:
- ordered by `order` field for display
- filtered by userId for user isolation

### sessions collection
**path**: `/artifacts/{appId}/users/{userId}/sessions/{sessionId}`

stores completed study sessions.

```javascript
{
  id: string,               // auto-generated document id
  userId: string,           // session owner
  habitId: string,          // associated habit id
  habitName: string,        // habit name (denormalized for reports)
  duration: number,         // session duration in seconds
  startTime: timestamp,     // session start time
  endTime: timestamp,       // session end time
  notes: string,            // optional session notes
  isManual: boolean,        // true if manually entered
  isShared: boolean,        // true if from nous together
  partnerId: string,        // partner userId if shared session
  createdAt: timestamp      // record creation time
}
```

**indexes**:
- habitId (for habit-specific queries)
- startTime (for time-based filtering)

**queries**:
- get sessions by habit
- get sessions by date range
- get recent sessions for reports

### activeTimers collection
**path**: `/artifacts/{appId}/users/{userId}/activeTimers/{habitId}`

stores currently running timers (ephemeral data).

```javascript
{
  habitId: string,          // habit being timed
  startTime: timestamp,     // when timer started
  pausedAt: timestamp,      // when timer was paused (null if running)
  accumulatedTime: number,  // time before pause in ms
  isRunning: boolean,       // timer state
  userId: string            // timer owner
}
```

**lifecycle**:
- created when timer starts
- updated on pause/resume
- deleted when timer stops

### nousRequests collection
**path**: `/nousRequests/{requestId}`

stores nous together session invitations.

```javascript
{
  id: string,               // auto-generated document id
  senderId: string,         // user who sent invite
  senderName: string,       // sender's display name
  receiverId: string,       // intended recipient
  habitId: string,          // habit for shared session
  habitName: string,        // habit name
  status: string,           // 'pending' | 'accepted' | 'declined'
  createdAt: timestamp,     // when request was sent
  expiresAt: timestamp      // request expiration time
}
```

**lifecycle**:
- created when user sends request
- updated when recipient responds
- deleted after acceptance or expiration

**security**:
- sender can read/write their own requests
- receiver can read requests sent to them

### sharedTimers collection
**path**: `/sharedTimers/{timerId}`

stores active nous together sessions.

```javascript
{
  id: string,               // auto-generated document id
  participants: string[],   // array of participant userIds [user1, user2]
  habitIds: object,         // { userId1: habitId1, userId2: habitId2 }
  habitNames: object,       // { userId1: habitName1, userId2: habitName2 }
  startTime: timestamp,     // session start time
  pausedAt: timestamp,      // when paused (null if running)
  accumulatedTime: number,  // time in ms before pause
  isRunning: boolean,       // timer state
  status: string,           // 'active' | 'paused' | 'stopped'
  createdBy: string,        // userId of initiator
  createdAt: timestamp      // creation timestamp
}
```

**real-time sync**:
- all participants listen to this document
- play/pause/stop synced across devices
- timer state managed collaboratively

**security**:
- participants can read/write
- cleaned up after session ends

### chatMessages collection
**path**: `/chatMessages/{messageId}`

stores messages during nous together sessions.

```javascript
{
  id: string,               // auto-generated document id
  timerId: string,          // associated shared timer
  senderId: string,         // message author
  senderName: string,       // author's display name
  message: string,          // message content
  timestamp: timestamp,     // when message was sent
  readBy: string[]          // array of userIds who read it
}
```

**lifecycle**:
- created when message sent
- persists for session duration
- cleaned up with timer

**queries**:
- filter by timerId
- ordered by timestamp

## data relationships

```
user
  ├── has many habits
  ├── has many sessions
  ├── has many activeTimers
  ├── sends many nousRequests
  └── participates in many sharedTimers

habit
  └── has many sessions

sharedTimer
  ├── has two participants (users)
  └── has many chatMessages
```

## data integrity rules

### cascading deletes

when deleting a habit:
1. delete all associated sessions
2. delete active timer if exists
3. update user statistics

when deleting a user:
1. delete all habits
2. delete all sessions
3. delete all active timers
4. remove from friends lists
5. cancel pending nous requests

### consistency checks

- session.habitId must reference existing habit
- session.userId must match parent path
- activeTimer.habitId must reference existing habit
- sharedTimer.participants must contain exactly 2 users

## indexing strategy

### composite indexes

required for complex queries:

```
sessions: [userId, startTime DESC]
sessions: [habitId, startTime DESC]
nousRequests: [receiverId, status, createdAt DESC]
```

### single-field indexes

```
users.friendCode (unique)
sessions.habitId
habits.order
```

## data migration considerations

### v1 → v2 (if needed)

potential future migrations:
- add habitTags field to habits
- add sessionType enum to sessions
- migrate friendCode to separate collection
- add habit archiving support

## backup & recovery

- **firestore automatic backups**: enabled daily
- **export process**: use firebase admin sdk
- **retention**: 30 days
- **restore process**: import from backup using admin sdk

## performance optimization

### denormalization

- habitName stored in sessions (avoid joins)
- senderName stored in nousRequests (reduce reads)
- totalTime cached in user document (avoid aggregation)

### pagination

- reports use firestore pagination (limit + startAfter)
- leaderboard limits to top 10 users
- session history loads 50 at a time

### real-time listeners

- scoped to user-specific data only
- cleaned up on component unmount
- use snapshot listeners for live updates

## security rules summary

```javascript
// user can only access their own data
match /artifacts/{appId}/users/{userId}/{document=**} {
  allow read, write: if request.auth.uid == userId;
}

// users can read/write their own user document
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// friend lookup by code
match /users/{userId} {
  allow read: if request.auth != null;  // for friend search
}

// nous requests: sender writes, receiver reads
match /nousRequests/{requestId} {
  allow read: if request.auth.uid == resource.data.senderId
              || request.auth.uid == resource.data.receiverId;
  allow write: if request.auth.uid == request.resource.data.senderId;
}

// shared timers: participants only
match /sharedTimers/{timerId} {
  allow read, write: if request.auth.uid in resource.data.participants;
}
```

see `system/firestore.rules` for complete implementation.

## data size estimates

based on typical usage:

- user document: ~500 bytes
- habit document: ~300 bytes
- session document: ~400 bytes
- active timer: ~300 bytes (ephemeral)

**example user after 1 year**:
- 10 habits: 3 KB
- 1000 sessions: 400 KB
- 1 user doc: 0.5 KB
- **total**: ~403 KB per year per active user

## query patterns

### common queries

```javascript
// get user's habits
collection(db, `/artifacts/${appId}/users/${userId}/habits`)
  .orderBy('order', 'asc')

// get sessions for a habit
query(
  collection(db, `/artifacts/${appId}/users/${userId}/sessions`),
  where('habitId', '==', habitId),
  orderBy('startTime', 'desc'),
  limit(50)
)

// get weekly leaderboard
query(
  collection(db, 'users'),
  orderBy('weeklyTime', 'desc'),
  limit(10)
)

// find friend by code
query(
  collection(db, 'users'),
  where('friendCode', '==', code),
  limit(1)
)
```

## future schema enhancements

- add habit categories/tags
- implement habit archiving
- add session ratings/mood tracking
- store achievement/badge data
- support for group study sessions (>2 users)
- add habit templates
- implement habit streaks at db level
