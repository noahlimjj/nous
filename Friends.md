# Friends & Leaderboard System - Implementation Plan

## Overview
This document outlines the complete architecture for implementing a friends system with leaderboards in the Nous habit tracking app. The system will enable users to connect with friends, compare progress, and stay motivated through friendly competition.

## Core Features

### 1. User Profile System
- **Username**: Unique, user-chosen display name
- **Display Name**: Optional friendly name
- **Avatar**: Profile picture (optional)
- **Privacy Settings**: Control what data is visible to friends
- **User Stats**: Aggregated statistics visible to friends

### 2. Friend Management
- **Add Friends**: Search by username or share friend code
- **Friend Requests**: Send, receive, accept, or decline
- **Friend List**: View all connected friends
- **Remove Friends**: Option to unfriend users
- **Friend Codes**: Shareable unique codes for easy friend discovery

### 3. Leaderboard System
- **Multiple Timeframes**: Daily, weekly, monthly, all-time
- **Multiple Metrics**:
  - Total study hours
  - Current streak
  - Sessions completed
  - Goals achieved
  - Tree growth level
- **Privacy**: Only visible among accepted friends
- **Ranking**: Real-time updates based on activity

### 4. Social Features
- **Activity Feed**: See friends' recent achievements (optional)
- **Achievements**: Unlock badges that friends can see
- **Challenges**: Create group challenges with friends

---

## Firestore Data Structure

### Users Collection
```
/users/{userId}
  - username: string (unique)
  - displayName: string
  - email: string
  - avatarUrl: string (optional)
  - friendCode: string (unique, auto-generated)
  - createdAt: timestamp
  - settings: {
      showStats: boolean
      showActivity: boolean
      allowFriendRequests: boolean
    }
  - stats: {
      totalHours: number
      currentStreak: number
      totalSessions: number
      goalsCompleted: number
      treeLevel: number
      lastUpdated: timestamp
    }
```

### Friend Requests Collection
```
/friendRequests/{requestId}
  - fromUserId: string
  - fromUsername: string
  - toUserId: string
  - toUsername: string
  - status: string ('pending' | 'accepted' | 'declined')
  - createdAt: timestamp
  - respondedAt: timestamp (optional)
```

### Friendships Collection
```
/friendships/{friendshipId}
  - user1Id: string
  - user1Username: string
  - user2Id: string
  - user2Username: string
  - createdAt: timestamp
  - lastInteraction: timestamp
```

### Leaderboard Aggregations (Cloud Functions)
```
/leaderboards/{period}/{metricType}
  - rankings: [
      {
        userId: string
        username: string
        value: number
        rank: number
        treeType: string
      }
    ]
  - lastUpdated: timestamp
```

---

## Implementation Phases

### Phase 1: User Profile Setup (Week 1)
**Goal**: Allow users to create a unique username and profile

**Tasks**:
1. Add username field to user document on signup
2. Create username uniqueness validation
3. Add username input to Settings page
4. Generate unique friend code for each user
5. Display friend code in Settings

**Components to Create**:
- `UsernameSetup` component (modal for first-time users)
- `ProfileSettings` section in Settings page

**Security Rules**:
```javascript
// Ensure usernames are unique
match /users/{userId} {
  allow create: if request.auth.uid == userId
    && !exists(/databases/$(database)/documents/users/$(request.resource.data.username));
  allow update: if request.auth.uid == userId;
  allow read: if request.auth != null;
}
```

### Phase 2: Friend Discovery (Week 2)
**Goal**: Enable users to find and send friend requests

**Tasks**:
1. Create "Friends" page with search functionality
2. Implement friend code lookup
3. Add username search (with privacy controls)
4. Create friend request sending functionality
5. Add friend request notifications

**Components to Create**:
- `FriendSearch` component
- `FriendCodeInput` component
- `SendRequestButton` component

**Firestore Queries**:
```javascript
// Search for username
const userQuery = query(
  collection(db, 'users'),
  where('username', '==', searchTerm),
  limit(1)
);

// Get pending friend requests
const requestsQuery = query(
  collection(db, 'friendRequests'),
  where('toUserId', '==', currentUserId),
  where('status', '==', 'pending')
);
```

### Phase 3: Friend Request Management (Week 2)
**Goal**: Handle incoming requests and maintain friend list

**Tasks**:
1. Create friend request inbox UI
2. Implement accept/decline functionality
3. Create friendships on acceptance
4. Show friend list with basic stats
5. Add unfriend functionality

**Components to Create**:
- `FriendRequestList` component
- `FriendCard` component
- `FriendList` component

**Cloud Functions** (Recommended):
```javascript
// Cloud Function: On friend request accepted
exports.onFriendRequestAccepted = functions.firestore
  .document('friendRequests/{requestId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    if (after.status === 'accepted') {
      // Create friendship document
      await db.collection('friendships').add({
        user1Id: after.fromUserId,
        user1Username: after.fromUsername,
        user2Id: after.toUserId,
        user2Username: after.toUsername,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
```

### Phase 4: Stats Aggregation (Week 3)
**Goal**: Calculate and store user statistics for leaderboard

**Tasks**:
1. Create Cloud Function to aggregate user stats daily
2. Update user stats on session completion
3. Calculate streak information
4. Track tree growth level
5. Store stats in user document

**Cloud Functions**:
```javascript
// Cloud Function: Update user stats on new session
exports.updateUserStats = functions.firestore
  .document('artifacts/{appId}/users/{userId}/sessions/{sessionId}')
  .onCreate(async (snap, context) => {
    const session = snap.data();
    const userId = context.params.userId;

    // Calculate total hours
    const sessionsSnapshot = await db
      .collection(`artifacts/default-app-id/users/${userId}/sessions`)
      .get();

    const totalMs = sessionsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().duration || 0),
      0
    );
    const totalHours = totalMs / (1000 * 60 * 60);

    // Update user stats
    await db.doc(`users/${userId}`).update({
      'stats.totalHours': totalHours,
      'stats.totalSessions': sessionsSnapshot.size,
      'stats.lastUpdated': admin.firestore.FieldValue.serverTimestamp()
    });
  });
```

### Phase 5: Leaderboard Display (Week 3-4)
**Goal**: Show friend rankings across different metrics

**Tasks**:
1. Create Leaderboard page
2. Fetch friend stats in real-time
3. Calculate rankings client-side
4. Add metric switcher (hours, streak, etc.)
5. Add timeframe switcher (daily, weekly, etc.)
6. Show user's current rank

**Components to Create**:
- `Leaderboard` component
- `LeaderboardRow` component
- `MetricSelector` component
- `TimeframeSelector` component

**Example Query**:
```javascript
// Get all friends for leaderboard
const getFriendsStats = async (userId) => {
  // Get friendships
  const friendshipsQuery = query(
    collection(db, 'friendships'),
    where('user1Id', '==', userId)
  );
  const friendships = await getDocs(friendshipsQuery);

  // Get stats for each friend
  const friendStats = [];
  for (const friendship of friendships.docs) {
    const friendId = friendship.data().user2Id;
    const userDoc = await getDoc(doc(db, 'users', friendId));
    if (userDoc.exists()) {
      friendStats.push({
        userId: friendId,
        username: userDoc.data().username,
        ...userDoc.data().stats
      });
    }
  }

  // Sort by total hours (descending)
  return friendStats.sort((a, b) => b.totalHours - a.totalHours);
};
```

### Phase 6: Real-time Updates (Week 4)
**Goal**: Keep leaderboard data fresh

**Tasks**:
1. Set up Firestore listeners for friend stats
2. Implement optimistic UI updates
3. Add refresh button for manual updates
4. Show "Last updated" timestamp
5. Handle offline scenarios gracefully

**Implementation**:
```javascript
// Real-time leaderboard listener
useEffect(() => {
  if (!friendIds.length) return;

  const unsubscribers = friendIds.map(friendId => {
    const userDocRef = doc(db, 'users', friendId);
    return onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setFriendStats(prev => ({
          ...prev,
          [friendId]: snapshot.data().stats
        }));
      }
    });
  });

  return () => unsubscribers.forEach(unsub => unsub());
}, [friendIds]);
```

---

## UI/UX Design

### Friends Page Layout
```
┌─────────────────────────────────────────┐
│  Friends                                │
├─────────────────────────────────────────┤
│  [Search friends...]  [Add by code]     │
├─────────────────────────────────────────┤
│  Friend Requests (2)                    │
│  ┌─────────────────────────────────┐   │
│  │ @alice wants to connect         │   │
│  │ [Accept] [Decline]              │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  My Friends (5)                         │
│  ┌─────────────────────────────────┐   │
│  │ @bob                            │   │
│  │ 🌳 Oak Tree • 24.5h this week   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ @carol                          │   │
│  │ 🌸 Cherry Blossom • 18h/week    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Leaderboard Page Layout
```
┌─────────────────────────────────────────┐
│  Leaderboard                            │
├─────────────────────────────────────────┤
│  [Weekly ▼] [Total Hours ▼]            │
├─────────────────────────────────────────┤
│  🥇 1. @alice - 42.5 hours             │
│  🥈 2. @bob - 38.2 hours               │
│  🥉 3. @you - 24.5 hours               │
│     4. @carol - 18.0 hours             │
│     5. @dave - 12.5 hours              │
├─────────────────────────────────────────┤
│  Your Rank: #3 of 5 friends            │
│  Keep going! Just 13.7h to reach #2    │
└─────────────────────────────────────────┘
```

---

## Security Considerations

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any user profile (for friend discovery)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }

    // Friend requests
    match /friendRequests/{requestId} {
      allow create: if request.auth != null
        && request.resource.data.fromUserId == request.auth.uid;
      allow read: if request.auth.uid == resource.data.fromUserId
        || request.auth.uid == resource.data.toUserId;
      allow update: if request.auth.uid == resource.data.toUserId
        && request.resource.data.status in ['accepted', 'declined'];
    }

    // Friendships
    match /friendships/{friendshipId} {
      allow read: if request.auth.uid == resource.data.user1Id
        || request.auth.uid == resource.data.user2Id;
      allow delete: if request.auth.uid == resource.data.user1Id
        || request.auth.uid == resource.data.user2Id;
    }
  }
}
```

### Privacy Features
1. **Opt-in sharing**: Users must explicitly enable stat sharing
2. **Block list**: Users can block other users from sending requests
3. **Data visibility controls**: Fine-grained control over what friends can see
4. **Anonymous mode**: Option to hide from friend search entirely

---

## Performance Optimization

### Pagination
- Limit friend list to 50 friends initially
- Lazy load additional friends on scroll
- Cache friend data locally

### Indexing
Create composite indexes for common queries:
```
friendRequests:
  - (toUserId, status, createdAt)
  - (fromUserId, status, createdAt)

friendships:
  - (user1Id, createdAt)
  - (user2Id, createdAt)
```

### Caching Strategy
- Cache friend list for 5 minutes
- Cache leaderboard data for 1 minute
- Use optimistic updates for instant feedback

---

## Monitoring & Analytics

### Key Metrics to Track
1. Friend request acceptance rate
2. Average number of friends per user
3. Leaderboard engagement (views, time spent)
4. Most compared metrics
5. Feature usage patterns

### Error Handling
- Graceful fallbacks when friend data unavailable
- Retry logic for failed requests
- User-friendly error messages
- Logging for debugging

---

## Testing Strategy

### Unit Tests
- Username uniqueness validation
- Friend code generation
- Stats calculation accuracy
- Ranking algorithm correctness

### Integration Tests
- Complete friend request flow
- Leaderboard data updates
- Real-time synchronization
- Security rules enforcement

### E2E Tests
- Search and add friend
- Accept friend request
- View leaderboard
- Update stats and see ranking change

---

## Future Enhancements

### Phase 7+: Advanced Features
1. **Team Challenges**: Create group study goals
2. **Streaks Competition**: Compare current streaks
3. **Activity Feed**: Timeline of friends' achievements
4. **Achievements/Badges**: Unlock and display badges
5. **Direct Messaging**: Chat with friends (optional)
6. **Study Groups**: Form groups with shared goals
7. **Push Notifications**: Friend request alerts, achievement notifications
8. **Leaderboard History**: Track rank changes over time
9. **Custom Challenges**: Set up 1-on-1 or group challenges
10. **Social Sharing**: Share achievements to external platforms

---

## Migration Plan

### For Existing Users
1. Prompt for username on first app open after update
2. Auto-generate friend code
3. Initialize stats from existing session data
4. No disruption to existing functionality

### Data Migration Script
```javascript
// Cloud Function: Migrate existing users
exports.migrateUsersToV2 = functions.https.onCall(async (data, context) => {
  const usersSnapshot = await db.collection('artifacts/default-app-id/users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;

    // Calculate stats from sessions
    const sessionsSnapshot = await db
      .collection(`artifacts/default-app-id/users/${userId}/sessions`)
      .get();

    const totalMs = sessionsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().duration || 0),
      0
    );

    // Create user profile
    await db.doc(`users/${userId}`).set({
      username: null, // User will set this
      friendCode: generateUniqueCode(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stats: {
        totalHours: totalMs / (1000 * 60 * 60),
        totalSessions: sessionsSnapshot.size,
        currentStreak: 0, // Calculate separately
        goalsCompleted: 0,
        treeLevel: 0,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }
    });
  }
});
```

---

## Estimated Timeline

- **Phase 1**: User Profile Setup - 1 week
- **Phase 2**: Friend Discovery - 1 week
- **Phase 3**: Friend Management - 1 week
- **Phase 4**: Stats Aggregation - 1 week
- **Phase 5**: Leaderboard Display - 1-2 weeks
- **Phase 6**: Real-time Updates - 1 week

**Total**: 6-7 weeks for full implementation

---

## Resources Needed

### Development
- Firebase Cloud Functions (for stat aggregation)
- Additional Firestore indexes
- Testing devices/accounts

### Design
- Friend request notification designs
- Leaderboard UI mockups
- Achievement badge designs

### Infrastructure
- Cloud Functions budget ($5-10/month estimated)
- Additional Firestore reads/writes (~1M free tier should suffice)

---

## Success Criteria

1. **Adoption**: 60% of active users have at least 1 friend
2. **Engagement**: 40% of users check leaderboard weekly
3. **Performance**: Leaderboard loads in <2 seconds
4. **Reliability**: 99.9% uptime for friend features
5. **User Satisfaction**: Positive feedback on friend functionality

---

## Notes

- Start with MVP: friend requests + basic leaderboard
- Iterate based on user feedback
- Keep privacy and security as top priorities
- Ensure mobile responsiveness
- Consider rate limiting for friend requests (prevent spam)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Author**: Nous Development Team
