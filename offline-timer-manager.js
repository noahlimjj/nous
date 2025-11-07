// Offline Timer Manager
// Handles timer operations when offline and syncs to Firestore when back online

(function() {
    'use strict';

    const OFFLINE_TIMERS_KEY = 'nous_offline_timers';
    const OFFLINE_QUEUE_KEY = 'nous_offline_sync_queue';

    // Get offline timers from localStorage
    function getOfflineTimers() {
        try {
            const data = localStorage.getItem(OFFLINE_TIMERS_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('[Offline Timer] Error reading timers:', error);
            return {};
        }
    }

    // Save offline timers to localStorage
    function saveOfflineTimers(timers) {
        try {
            localStorage.setItem(OFFLINE_TIMERS_KEY, JSON.stringify(timers));
        } catch (error) {
            console.error('[Offline Timer] Error saving timers:', error);
        }
    }

    // Get sync queue
    function getSyncQueue() {
        try {
            const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('[Offline Timer] Error reading queue:', error);
            return [];
        }
    }

    // Add operation to sync queue
    function queueOperation(operation) {
        try {
            const queue = getSyncQueue();
            queue.push({
                ...operation,
                queuedAt: Date.now()
            });
            localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
            console.log('[Offline Timer] Queued operation:', operation.type, operation.habitId);
        } catch (error) {
            console.error('[Offline Timer] Error queuing operation:', error);
        }
    }

    // Clear sync queue
    function clearSyncQueue() {
        try {
            localStorage.removeItem(OFFLINE_QUEUE_KEY);
            console.log('[Offline Timer] Sync queue cleared');
        } catch (error) {
            console.error('[Offline Timer] Error clearing queue:', error);
        }
    }

    // Start timer offline
    function startTimerOffline(habitId, habitName, duration) {
        const timers = getOfflineTimers();

        const timerData = {
            habitId,
            habitName,
            startTime: Date.now(),
            pausedTime: null,
            elapsedTime: 0,
            duration: duration || 0,
            mode: duration > 0 ? 'countdown' : 'stopwatch',
            isRunning: true
        };

        timers[habitId] = timerData;
        saveOfflineTimers(timers);

        queueOperation({
            type: 'start',
            habitId,
            habitName,
            duration,
            timestamp: Date.now()
        });

        console.log('[Offline Timer] Started:', habitName);
        return timerData;
    }

    // Pause timer offline
    function pauseTimerOffline(habitId) {
        const timers = getOfflineTimers();
        const timer = timers[habitId];

        if (!timer) {
            console.warn('[Offline Timer] Timer not found:', habitId);
            return null;
        }

        const now = Date.now();
        const elapsed = timer.isRunning ? (now - timer.startTime) + timer.elapsedTime : timer.elapsedTime;

        timer.isRunning = false;
        timer.pausedTime = now;
        timer.elapsedTime = elapsed;

        timers[habitId] = timer;
        saveOfflineTimers(timers);

        queueOperation({
            type: 'pause',
            habitId,
            elapsedTime: elapsed,
            timestamp: now
        });

        console.log('[Offline Timer] Paused:', habitId);
        return timer;
    }

    // Resume timer offline
    function resumeTimerOffline(habitId) {
        const timers = getOfflineTimers();
        const timer = timers[habitId];

        if (!timer) {
            console.warn('[Offline Timer] Timer not found:', habitId);
            return null;
        }

        timer.isRunning = true;
        timer.startTime = Date.now();
        timer.pausedTime = null;

        timers[habitId] = timer;
        saveOfflineTimers(timers);

        queueOperation({
            type: 'resume',
            habitId,
            timestamp: Date.now()
        });

        console.log('[Offline Timer] Resumed:', habitId);
        return timer;
    }

    // Stop timer offline (complete the session)
    function stopTimerOffline(habitId, habitName) {
        const timers = getOfflineTimers();
        const timer = timers[habitId];

        if (!timer) {
            console.warn('[Offline Timer] Timer not found:', habitId);
            return null;
        }

        const now = Date.now();
        const elapsed = timer.isRunning ? (now - timer.startTime) + timer.elapsedTime : timer.elapsedTime;
        const hoursTracked = elapsed / (1000 * 60 * 60); // Convert to hours

        // Queue this session for sync
        queueOperation({
            type: 'complete',
            habitId,
            habitName,
            elapsedTime: elapsed,
            hoursTracked,
            completedAt: now,
            timestamp: now
        });

        // Remove from active timers
        delete timers[habitId];
        saveOfflineTimers(timers);

        console.log('[Offline Timer] Stopped:', habitName, `(${hoursTracked.toFixed(2)} hours)`);

        return {
            habitId,
            habitName,
            elapsedTime: elapsed,
            hoursTracked
        };
    }

    // Get current elapsed time for a timer
    function getElapsedTime(habitId) {
        const timers = getOfflineTimers();
        const timer = timers[habitId];

        if (!timer) return 0;

        if (timer.isRunning) {
            const now = Date.now();
            return (now - timer.startTime) + timer.elapsedTime;
        } else {
            return timer.elapsedTime;
        }
    }

    // Sync offline data to Firestore when back online
    async function syncToFirestore(db, userId) {
        const queue = getSyncQueue();

        if (queue.length === 0) {
            console.log('[Offline Timer] No operations to sync');
            return { success: true, synced: 0 };
        }

        console.log(`[Offline Timer] Syncing ${queue.length} operations...`);

        const appId = 'study-tracker-app-v1';
        let syncedCount = 0;
        const errors = [];

        for (const op of queue) {
            try {
                if (op.type === 'complete') {
                    // Add hours to habit
                    const habitRef = window.doc(db, `/artifacts/${appId}/users/${userId}/habits/${op.habitId}`);
                    const habitSnap = await window.getDoc(habitRef);

                    if (habitSnap.exists()) {
                        const habitData = habitSnap.getData();
                        const newTotalHours = (habitData.totalHours || 0) + op.hoursTracked;

                        await window.updateDoc(habitRef, {
                            totalHours: newTotalHours,
                            lastStudied: new Date(op.completedAt)
                        });

                        console.log(`[Offline Timer] Synced: ${op.habitName} +${op.hoursTracked.toFixed(2)}h`);
                        syncedCount++;
                    } else {
                        console.warn(`[Offline Timer] Habit not found: ${op.habitId}`);
                    }
                }
                // Note: start/pause/resume operations are not synced as they're transient
                // Only completed sessions (hours tracked) are synced
            } catch (error) {
                console.error(`[Offline Timer] Sync error for ${op.type}:`, error);
                errors.push({ operation: op, error: error.message });
            }
        }

        // Clear queue after sync
        clearSyncQueue();

        console.log(`[Offline Timer] Sync complete: ${syncedCount}/${queue.length} operations`);

        return {
            success: errors.length === 0,
            synced: syncedCount,
            total: queue.length,
            errors
        };
    }

    // Expose API
    window.OfflineTimerManager = {
        // Timer operations
        start: startTimerOffline,
        pause: pauseTimerOffline,
        resume: resumeTimerOffline,
        stop: stopTimerOffline,
        getElapsedTime,

        // Data management
        getTimers: getOfflineTimers,
        saveTimers: saveOfflineTimers,

        // Sync
        sync: syncToFirestore,
        getQueue: getSyncQueue,
        clearQueue: clearSyncQueue,

        // Utilities
        isOffline: () => !navigator.onLine
    };

    console.log('✓ Offline Timer Manager initialized');
})();
