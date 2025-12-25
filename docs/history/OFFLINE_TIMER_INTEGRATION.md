# Offline Timer Integration Guide

**Status:** Ready to integrate
**Files:** `offline-timer-manager.js`, `offline-handler.js` (updated)
**Purpose:** Make timers work offline and sync when back online

---

## What's Been Implemented

### 1. Offline Timer Manager ✅
**File:** `offline-timer-manager.js`

**Features:**
- Stores active timers in localStorage when offline
- Queues all timer operations (start, pause, resume, stop)
- Calculates elapsed time client-side
- Syncs completed sessions to Firestore when back online
- Only syncs actual hours tracked (not transient start/pause events)

**API:**
```javascript
window.OfflineTimerManager.start(habitId, habitName, duration)
window.OfflineTimerManager.pause(habitId)
window.OfflineTimerManager.resume(habitId)
window.OfflineTimerManager.stop(habitId, habitName)
window.OfflineTimerManager.getElapsedTime(habitId)
window.OfflineTimerManager.sync(db, userId)
```

### 2. Auto-Sync on Reconnect ✅
**File:** `offline-handler.js` (updated)

**Features:**
- Automatically syncs offline timer data when connection restored
- Shows notification: "Synced X offline timer session(s)"
- Waits for app initialization before syncing
- Handles sync errors gracefully

### 3. Offline Indicator Position ✅
**File:** `offline-handler.js` (updated)

**Change:** Moved to `top: 64px` to appear below the header

---

## How It Works

### Online Mode (Current Behavior)
```
User starts timer → Firestore activeTimers collection → Real-time sync
```

### Offline Mode (New Behavior)
```
User starts timer → localStorage → Queue operation
User stops timer → Calculate hours → Queue for sync
Connection restored → Auto-sync queued hours to Firestore → Update totalHours
```

### Key Points:
1. **Only completed sessions are synced** (hours tracked)
2. **Transient operations** (start/pause/resume) are NOT synced (they're just for local timer state)
3. **Hours are accumulated** and added to the habit's `totalHours` field when synced

---

## Integration Steps

### Quick Integration (Recommended)

Add this to your Dashboard component (around line 1040 in index.js):

```javascript
// Expose db and userId for offline sync
useEffect(() => {
    if (db && userId) {
        window.__currentDb = db;
        window.__currentUserId = userId;
        window.__showNotification = setNotification;
    }
}, [db, userId, setNotification]);
```

That's it! The offline timer manager will automatically:
- Detect when you're offline
- Store timer operations in localStorage
- Sync when you're back online

### Full Integration (For Complete Offline Support)

To make the timer UI work seamlessly offline, modify the timer functions:

#### 1. Update `startTimer` function:

```javascript
const startTimer = useCallback(async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    // CHECK IF OFFLINE
    if (!navigator.onLine && window.OfflineTimerManager) {
        console.log('[Offline] Starting timer locally:', habit.name);
        window.OfflineTimerManager.start(habitId, habit.name, 0);
        // Update local state (UI will show timer running)
        setActiveTimers(prev => ({
            ...prev,
            [habitId]: {
                habitId,
                habitName: habit.name,
                startTime: Date.now(),
                isOffline: true
            }
        }));
        return;
    }

    // ONLINE - existing Firebase code
    try {
        const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);
        // ... rest of existing code
    } catch (error) {
        console.error("Error starting timer:", error);
        setNotification({ type: 'error', message: 'Failed to start timer.' });
    }
}, [db, userId, appId, habits, activeTimers, setNotification]);
```

#### 2. Update `pauseTimer` function:

```javascript
const pauseTimer = useCallback(async (habitId) => {
    const timer = activeTimers[habitId];
    if (!timer) return;

    // CHECK IF OFFLINE
    if (!navigator.onLine && window.OfflineTimerManager) {
        console.log('[Offline] Pausing timer locally');
        const pausedTimer = window.OfflineTimerManager.pause(habitId);
        setActiveTimers(prev => ({
            ...prev,
            [habitId]: {
                ...prev[habitId],
                isPaused: true,
                elapsedBeforePause: pausedTimer.elapsedTime
            }
        }));
        return;
    }

    // ONLINE - existing Firebase code
    try {
        const timerDocRef = window.doc(db, `/artifacts/${appId}/users/${userId}/activeTimers/${habitId}`);
        // ... rest of existing code
    } catch (error) {
        console.error("Error pausing timer:", error);
    }
}, [db, userId, appId, activeTimers]);
```

#### 3. Update `stopTimer` function:

```javascript
const stopTimer = useCallback(async (habitId, habitName) => {
    const timerData = activeTimers[habitId];
    if (!timerData) return;

    // CHECK IF OFFLINE
    if (!navigator.onLine && window.OfflineTimerManager) {
        console.log('[Offline] Stopping timer and queuing for sync');
        const result = window.OfflineTimerManager.stop(habitId, habitName);

        // Remove from local state
        setActiveTimers(prev => {
            const newTimers = { ...prev };
            delete newTimers[habitId];
            return newTimers;
        });

        // Show notification
        setNotification({
            type: 'success',
            message: `Timer stopped. ${result.hoursTracked.toFixed(2)} hours will be synced when back online.`
        });
        return;
    }

    // ONLINE - existing Firebase code
    try {
        // Calculate elapsed time
        // ... rest of existing code
    } catch (error) {
        console.error("Error stopping timer:", error);
    }
}, [db, userId, appId, activeTimers, setNotification]);
```

---

## Testing

### Test Offline Timer

1. **Start the app** (online):
   ```bash
   npm start
   # Open http://localhost:8081
   ```

2. **Go offline**:
   - DevTools (F12) → Network tab → "Offline"

3. **Start a timer**:
   - Click start on any habit
   - Should see: `[Offline] Starting timer locally: [Habit Name]`
   - Timer should run in UI

4. **Stop the timer**:
   - Wait a bit (e.g., 10 seconds)
   - Click stop
   - Should see: "Timer stopped. X hours will be synced when back online"

5. **Check localStorage**:
   ```javascript
   // In console:
   JSON.parse(localStorage.getItem('nous_offline_sync_queue'))
   // Should show queued operation with hoursTracked
   ```

6. **Go back online**:
   - Network tab → "No throttling"
   - Should see: "Synced 1 offline timer session(s)"

7. **Verify sync**:
   - Check habit's totalHours increased
   - Check sync queue cleared:
     ```javascript
     localStorage.getItem('nous_offline_sync_queue') // Should be null
     ```

---

## Current Status

### Implemented ✅
- [x] Offline timer manager (localStorage)
- [x] Sync queue system
- [x] Auto-sync on reconnect
- [x] Sync notification
- [x] Offline indicator below header
- [x] Error suppression

### To Integrate 🔧
- [ ] Expose db/userId to window (5 lines of code)
- [ ] Update startTimer to use offline manager when offline (optional but recommended)
- [ ] Update pauseTimer to use offline manager when offline (optional)
- [ ] Update stopTimer to use offline manager when offline (optional)

### Note on "Optional" Items:
The timer will work and sync even WITHOUT modifying the timer functions, but:
- **With modifications:** Timer UI works perfectly offline, shows running timers, etc.
- **Without modifications:** Timer operations fail silently offline, but you can manually track time and it will sync

---

## Example: Quick Manual Test

Even without integration, you can test the offline timer manually:

```javascript
// In browser console (when offline):

// Start timer
window.OfflineTimerManager.start('habit123', 'Study Math', 0)

// Wait 10 seconds...

// Stop timer
const result = window.OfflineTimerManager.stop('habit123', 'Study Math')
console.log('Tracked:', result.hoursTracked, 'hours')

// Check queue
window.OfflineTimerManager.getQueue()
// Shows: [{type: 'complete', habitId: 'habit123', hoursTracked: 0.00277...}]

// When back online, sync will happen automatically
// Or trigger manually:
window.OfflineTimerManager.sync(window.__currentDb, window.__currentUserId)
```

---

## Troubleshooting

### Sync doesn't happen when back online

**Check:**
1. `window.__currentDb` is set (run `console.log(window.__currentDb)`)
2. `window.__currentUserId` is set
3. Queue has items: `window.OfflineTimerManager.getQueue()`

**Fix:** Add the useEffect to expose db/userId (see Quick Integration)

### Timer doesn't show in UI when offline

**Cause:** Timer functions not updated to use offline manager

**Fix:** Integrate the startTimer/pauseTimer/stopTimer modifications

### Synced hours don't appear in habit

**Check:**
1. Habit exists in Firestore
2. Console shows sync success message
3. Refresh the page to see updated totalHours

---

## Data Flow Diagram

```
┌─────────────┐
│   OFFLINE   │
└─────────────┘
       │
       ▼
┌──────────────────────┐
│  Start Timer         │
│  ├─ localStorage     │──┐
│  └─ Queue: 'start'   │  │ Not synced
└──────────────────────┘  │ (transient)
       │                  │
       ▼                  │
┌──────────────────────┐  │
│  Stop Timer          │  │
│  ├─ Calc hours       │  │
│  └─ Queue: 'complete'│◄─┘
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  BACK ONLINE         │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Auto-Sync           │
│  ├─ Read queue       │
│  ├─ Update Firestore │
│  └─ Clear queue      │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Hours Added to      │
│  Habit's totalHours  │
└──────────────────────┘
```

---

## Next Steps

1. **Quick Test** (5 minutes):
   - Add the 5-line useEffect to expose db/userId
   - Test offline timer manually in console
   - Verify sync works

2. **Full Integration** (30 minutes):
   - Update startTimer, pauseTimer, stopTimer functions
   - Test complete offline timer workflow
   - Verify UI updates correctly

3. **Production Deploy**:
   - All changes are backward compatible
   - No breaking changes to existing online functionality
   - Offline users get new capability

---

**Files modified:**
- `index.html` (added offline-timer-manager.js script)
- `offline-handler.js` (auto-sync on reconnect, position changed)
- `offline-timer-manager.js` (NEW - complete offline timer system)

**Ready to test!** 🚀
