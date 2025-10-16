# Timer/Stopwatch Toggle Feature

## Overview
Added the ability to toggle between **stopwatch mode** (count up) and **timer mode** (countdown) for each habit and Nous Together sessions.

## Features Implemented

### 1. For Individual Habits

#### Toggle Between Modes
- Each habit now has a toggle button to switch between:
  - **Stopwatch mode** (default): Counts up from 00:00
  - **Timer mode**: Counts down from a set duration

#### Duration Selection
- When in timer mode, a dropdown appears to select target duration:
  - 5 minutes
  - 10 minutes
  - 15 minutes
  - 25 minutes (default)
  - 30 minutes
  - 45 minutes
  - 60 minutes

#### How It Works
- In **stopwatch mode**: Timer counts up and shows elapsed time
- In **countdown mode**: Timer counts down from selected duration
- Both modes save the actual elapsed time to your total hours
- Duration selector is disabled while timer is running

### 2. For Nous Together Sessions

- Same toggle functionality available for shared timers
- All participants see the same timer mode
- Anyone can toggle the mode (synced across all participants)
- Duration changes only allowed when timer is paused

## User Interface

### Habit Timer Display
```
[⏱️ icon] [duration selector if timer mode]  ← Stopwatch mode
  or
[🕐 icon] [duration selector]                ← Countdown mode

        24:35.12                              ← Large timer display
[▶ Play] [⏸ Pause] [⏹ Stop] [➕] [🗑️]       ← Action buttons
```

### Icons Used
- **Stopwatch mode**: ⏱️ Stopwatch icon with top button (circle with timer hand + top knob)
- **Countdown mode**: ⌛ Hourglass icon (classic sand timer showing time flowing down)
- Icons are clean, minimal SVG graphics that match the app's aesthetic
- Hover states provide visual feedback (background darkens slightly)
- Tooltips explain each mode on hover
- Hourglass perfectly represents "time running out" concept

### Nous Together Display
```
Nous Together (2 participants)
👤 You • Test Habit
👥 @friend • Reading

[⏱️ icon] [duration selector if timer mode]  ← Toggle between modes
        24:35.12                              ← Shared timer display
[⏸ Pause/▶ Play] [⏹ Stop] [💬] [👥] [👋]    ← Shared controls
```

## Data Structure

### Habit Document
```javascript
{
  name: "Study Session",
  timerMode: "stopwatch" | "timer",  // default: "stopwatch"
  targetDuration: 1500000,           // in milliseconds (25 min default)
  createdAt: Timestamp,
  order: 0
}
```

### Shared Timer Document
```javascript
{
  participants: [...],
  timerMode: "stopwatch" | "timer",  // default: "stopwatch"
  targetDuration: 1500000,           // in milliseconds (25 min default)
  startTime: Timestamp,
  elapsedBeforePause: 0,
  isPaused: false,
  // ... other fields
}
```

## Testing

### Manual Testing Steps

1. **Test Stopwatch Mode (Default)**
   - Add a new habit
   - Verify it shows "stopwatch" button
   - Start the timer
   - Observe it counting up from 00:00
   - Stop and verify session is saved

2. **Test Timer Mode**
   - Click "stopwatch" button to toggle to "countdown"
   - Verify duration selector appears
   - Select a duration (e.g., 5 minutes)
   - Start the timer
   - Observe it counting down from 05:00
   - Stop and verify session is saved with correct duration

3. **Test Mode Persistence**
   - Toggle to timer mode
   - Refresh the page
   - Verify the habit stays in timer mode

4. **Test Nous Together**
   - Create a Nous Together session
   - Toggle between stopwatch and countdown
   - Verify both participants see the change
   - Start countdown timer
   - Verify it counts down correctly
   - Stop and verify all participants get the session saved

### Automated Tests
- `tests/test-timer-stopwatch.js` - Comprehensive Playwright test suite
- `tests/test-simple-timer.js` - Simple manual verification script

## Implementation Details

### Key Functions

#### `getTimerElapsedTime(timer, habit)`
- Calculates time to display based on mode
- For stopwatch: returns elapsed time
- For countdown: returns `targetDuration - elapsedTime`
- Always returns non-negative values

#### `toggleTimerMode(habitId)`
- Switches between stopwatch and timer mode
- Updates Firebase habit document
- Shows success notification

#### `updateTimerDuration(habitId, duration)`
- Updates target duration for countdown
- Only works when timer is not running

#### `toggleSharedTimerMode(sessionId)`
- Same as toggleTimerMode but for Nous Together sessions
- Syncs across all participants

#### `updateSharedTimerDuration(sessionId, duration)`
- Updates countdown duration for shared sessions
- Only works when timer is paused

### Session Saving
- Both stopwatch and countdown modes save actual elapsed time
- Countdown timer at 25:00 started and stopped at 23:30 saves 1.5 minutes
- Time is always added to user's total hours regardless of mode

## Benefits

1. **Flexibility**: Users can choose the timing method that works best for them
2. **Pomodoro Technique**: Timer mode perfect for 25-minute focus sessions
3. **Open-ended Work**: Stopwatch mode for tasks without time limits
4. **Shared Sessions**: Groups can use countdown for synchronization
5. **Accurate Tracking**: All time is properly recorded regardless of mode

## Future Enhancements

Possible future additions:
- Sound notification when countdown reaches 00:00
- Auto-stop when countdown completes
- Custom duration input (not just presets)
- Different notification sounds for timer vs stopwatch
- Statistics showing timer mode preferences

## Deployment

Changes have been committed and pushed to the repository:
- Commit: Add timer/stopwatch toggle feature for habits and Nous Together
- Files modified: `index.html`
- Test files added: `tests/test-timer-stopwatch.js`, `tests/test-simple-timer.js`

The feature is now live on the deployed Netlify site: https://nousi.netlify.app
