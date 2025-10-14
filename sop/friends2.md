# Assistant Task: Implement Friends Page & Leaderboard Components

## Context
You are helping implement a friend system for the Nous habit tracking app. The main index.html file already has:
- Firebase imports and configuration
- React 18 setup with createElement patterns
- Icon components (UsersIcon, TrophyIcon, SearchIcon, CheckIcon, XIcon)
- Helper functions (formatTime, formatDate, generateFriendCode, calculateTotalHours)
- Header navigation with Friends and Leaderboard buttons already added
- Existing pages: Dashboard, Goals, Reports, Settings

## Your Task
Implement TWO major components that will be added to index.html:

### 1. Friends Page Component
Location: Add after the Goals component (around line 1667)

**Requirements:**
```javascript
const Friends = ({ db, userId, setNotification, userProfile }) => {
    // State needed:
    // - friendRequests (pending incoming requests)
    // - friends (accepted friendships)
    // - searchTerm for username search
    // - searchResult
    // - friendCodeInput
    // - isLoading

    // Features to implement:
    // A. Friend Request Inbox
    //    - Query: /friendRequests where toUserId == userId && status == 'pending'
    //    - Show sender username and profile info
    //    - Accept button: updates status to 'accepted', creates /friendships doc
    //    - Decline button: updates status to 'declined'

    // B. Friend Search by Username
    //    - Input field for username
    //    - Search button queries /users collection where username == searchTerm
    //    - Show result with "Send Friend Request" button
    //    - Creates doc in /friendRequests with fromUserId, toUserId, status: 'pending'
    //    - Don't allow duplicate requests or requests to self

    // C. Friend Search by Code
    //    - Input field for 8-character friend code
    //    - Search button queries /users where friendCode == input
    //    - Same as username search after finding user

    // D. My Friends List
    //    - Query: /friendships where user1Id == userId OR user2Id == userId
    //    - Show friend's username, total hours, tree type
    //    - Show their study stats (totalHours, currentStreak)
    //    - Unfriend button: deletes friendship doc

    // E. My Friend Code Display
    //    - Show userProfile.friendCode in a copyable format
    //    - "Copy Code" button
};
```

**UI Layout:**
```
┌─────────────────────────────────────────┐
│  Friends                                │
├─────────────────────────────────────────┤
│  My Friend Code: ABC12345 [Copy]       │
├─────────────────────────────────────────┤
│  Add Friends                            │
│  [Search username...] [Search]          │
│  [Friend code...] [Add by code]         │
├─────────────────────────────────────────┤
│  Friend Requests (2)                    │
│  ┌─────────────────────────────────┐   │
│  │ @alice • 24h studied            │   │
│  │ [Accept] [Decline]              │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  My Friends (5)                         │
│  ┌─────────────────────────────────┐   │
│  │ @bob                            │   │
│  │ 🌳 Oak Tree • 24.5h • 7 day 🔥  │   │
│  │ [View] [Unfriend]               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 2. Leaderboard Page Component
Location: Add after Friends component

**Requirements:**
```javascript
const Leaderboard = ({ db, userId, setNotification, userProfile }) => {
    // State needed:
    // - friendsData (array of friend stats)
    // - selectedMetric ('totalHours' | 'currentStreak' | 'totalSessions')
    // - selectedPeriod ('all' | 'week' | 'month')
    // - isLoading

    // Features to implement:
    // A. Fetch All Friends' Stats
    //    - Get all friendships for current user
    //    - For each friend, fetch their /users doc to get stats
    //    - Include current user in the leaderboard
    //    - Sort by selected metric (descending)

    // B. Metric Selector Buttons
    //    - Total Hours (default)
    //    - Current Streak
    //    - Total Sessions

    // C. Period Selector (optional for MVP)
    //    - All Time (default, easiest)
    //    - This Week (requires filtering sessions)
    //    - This Month (requires filtering sessions)

    // D. Leaderboard Display
    //    - Rank medals: 🥇 🥈 🥉 for top 3
    //    - Show position, username, metric value
    //    - Highlight current user's row
    //    - Show tree emoji based on their selected tree type

    // E. User's Rank Summary
    //    - "Your Rank: #3 of 12 friends"
    //    - Motivational message based on position
};
```

**UI Layout:**
```
┌─────────────────────────────────────────┐
│  Leaderboard                            │
├─────────────────────────────────────────┤
│  [Total Hours] [Streak] [Sessions]     │
├─────────────────────────────────────────┤
│  🥇 1. @alice - 42.5 hours             │
│  🥈 2. @bob - 38.2 hours               │
│  🥉 3. @you - 24.5 hours  ← highlighted│
│     4. @carol - 18.0 hours             │
│     5. @dave - 12.5 hours              │
├─────────────────────────────────────────┤
│  Your Rank: #3 of 5 friends            │
│  Keep going! 13.7h to reach #2 🚀      │
└─────────────────────────────────────────┘
```

### 3. User Profile Initialization Hook
Location: Add to the App component's useEffect (after Firebase initialization)

**Requirements:**
```javascript
// When a user logs in, check if they have a profile in /users collection
// If not, create one with:
useEffect(() => {
    if (!db || !userId) return;

    const userDocRef = doc(db, 'users', userId);
    onSnapshot(userDocRef, async (snapshot) => {
        if (!snapshot.exists()) {
            // Create new user profile
            await setDoc(userDocRef, {
                username: `user_${userId.substring(0, 8)}`, // temporary username
                email: auth.currentUser?.email || '',
                friendCode: generateFriendCode(),
                createdAt: Timestamp.now(),
                settings: {
                    showStats: true,
                    showActivity: true,
                    allowFriendRequests: true
                },
                stats: {
                    totalHours: 0,
                    currentStreak: 0,
                    totalSessions: 0,
                    goalsCompleted: 0,
                    treeLevel: 0,
                    lastUpdated: Timestamp.now()
                }
            });

            // Prompt user to set a custom username
            setNotification({ type: 'success', message: 'Set your username in Settings!' });
        }
    });
}, [db, userId]);
```

### 4. Stats Update Function
Create a function that updates user stats whenever a session is saved:

```javascript
const updateUserStats = async (db, userId, sessions) => {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userDocRef = doc(db, 'users', userId);

    const totalHours = calculateTotalHours(sessions);
    const totalSessions = sessions.length;

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    const sortedSessions = [...sessions].sort((a, b) =>
        b.startTime.toMillis() - a.startTime.toMillis()
    );

    for (let i = 0; i < 365; i++) { // Check up to 1 year back
        const dayStart = new Date(checkDate);
        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        const hasSessionOnDay = sortedSessions.some(s => {
            const sessionDate = s.startTime.toDate();
            return sessionDate >= dayStart && sessionDate <= dayEnd;
        });

        if (hasSessionOnDay) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0 && checkDate.getTime() === today.getTime()) {
            // No session today, but check yesterday
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break; // Streak broken
        }
    }

    await setDoc(userDocRef, {
        stats: {
            totalHours,
            currentStreak: streak,
            totalSessions,
            goalsCompleted: 0, // Can be calculated from goals collection
            treeLevel: Math.floor(totalHours / 10),
            lastUpdated: Timestamp.now()
        }
    }, { merge: true });
};
```

Call this function in Dashboard's stopTimer after saving a session.

### 5. Settings Page Enhancement
Add username editing to the Settings page:

```javascript
// Add to Settings component state
const [username, setUsername] = useState('');
const [isEditingUsername, setIsEditingUsername] = useState(false);

// Add username section in Settings UI
React.createElement('div', { className: "bg-white rounded-lg shadow-sm p-6 mb-6" },
    React.createElement('h3', { className: "text-xl text-gray-700 mb-4" }, "profile"),
    React.createElement('div', { className: "space-y-3" },
        React.createElement('div', { className: "flex justify-between items-center py-2 border-b" },
            React.createElement('span', { className: "text-gray-600" }, "Username:"),
            isEditingUsername ?
                React.createElement('input', {
                    type: "text",
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    onBlur: handleSaveUsername,
                    className: "border px-2 py-1 rounded"
                }) :
                React.createElement('span', {
                    className: "text-gray-800 cursor-pointer hover:text-blue-600",
                    onClick: () => setIsEditingUsername(true)
                }, userProfile?.username || 'Set username')
        ),
        React.createElement('div', { className: "flex justify-between items-center py-2" },
            React.createElement('span', { className: "text-gray-600" }, "Friend Code:"),
            React.createElement('span', { className: "font-mono text-gray-800" },
                userProfile?.friendCode || 'Loading...'
            )
        )
    )
)
```

## Code Style Requirements
- Use React.createElement() syntax (no JSX)
- Use Tailwind CSS classes for styling
- Match existing color scheme: calm colors (#5d6b86, #6B8DD6, etc.)
- Use fontWeight: 300 or 400 (no bold fonts)
- Use soft-shadow and soft-shadow-lg classes
- Follow existing notification patterns
- Handle loading states with LoaderIcon
- Use try-catch for all Firebase operations
- Use setNotification for success/error messages

## Firestore Collection Structure
```
/users/{userId}
  - username: string
  - email: string
  - friendCode: string (8 chars, unique)
  - createdAt: timestamp
  - settings: { showStats, showActivity, allowFriendRequests }
  - stats: { totalHours, currentStreak, totalSessions, goalsCompleted, treeLevel, lastUpdated }

/friendRequests/{requestId}
  - fromUserId: string
  - fromUsername: string
  - toUserId: string
  - toUsername: string
  - status: 'pending' | 'accepted' | 'declined'
  - createdAt: timestamp

/friendships/{friendshipId}
  - user1Id: string
  - user1Username: string
  - user2Id: string
  - user2Username: string
  - createdAt: timestamp
```

## Deliverable Format
Please provide the complete code for:
1. Friends component (complete implementation)
2. Leaderboard component (complete implementation)
3. User profile initialization code snippet
4. updateUserStats function
5. Settings page username section

Format as JavaScript code blocks that can be directly inserted into index.html.

## Testing Checklist
After implementation, verify:
- [ ] Users get a profile and friend code on first login
- [ ] Can search for friends by username
- [ ] Can search for friends by code
- [ ] Can send friend requests
- [ ] Can accept/decline requests
- [ ] Friend requests create friendships when accepted
- [ ] Can see list of friends with their stats
- [ ] Leaderboard shows all friends sorted by metric
- [ ] Stats update after completing study sessions
- [ ] Can edit username in Settings
- [ ] No crashes when viewing friends/leaderboard with 0 friends

Good luck! Focus on clean, working code that matches the existing style. Start with the core functionality and keep it simple.
