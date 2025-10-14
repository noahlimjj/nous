# Testing Guide: Multi-Participant Nous Together

## Overview
This guide will help you test the new multi-participant Nous Together feature that allows up to 5 people to study together, each tracking time to their own chosen habit.

## Prerequisites
- Server running at http://localhost:8080
- 2-3 browser windows or incognito tabs for simulating multiple users
- Firebase configuration set up correctly

## Test Setup

### Step 1: Create Test Users

**Browser Window 1 (Alice):**
1. Open http://localhost:8080
2. Click "try as guest"
3. Dashboard appears - you're logged in anonymously

**Browser Window 2 (Bob):**
1. Open http://localhost:8080 in a new incognito window
2. Click "try as guest"
3. Dashboard appears

**Browser Window 3 (Carol) - Optional:**
1. Open http://localhost:8080 in another incognito window
2. Click "try as guest"
3. Dashboard appears

### Step 2: Set Up User Profiles

**For Each User (Alice, Bob, Carol):**

1. **Go to Settings page** (gear icon in header)
2. **Set username:**
   - Click on username field
   - Enter: "alice", "bob", or "carol"
   - Click away to save

3. **Copy Friend Code:**
   - Note down the 6-character friend code shown
   - Example: Alice = "ABC123", Bob = "DEF456", Carol = "GHI789"

### Step 3: Add Friends

**Alice's Browser:**
1. Go to **Friends** page
2. Under "add friends", enter Bob's friend code: "DEF456"
3. Click "Add by code"
4. Success: "Friend request sent!"

**Bob's Browser:**
1. Go to **Friends** page
2. You should see friend request from Alice
3. Click "Accept" (green checkmark)
4. Success: Alice is now your friend

**Repeat** so Alice and Bob are both friends with Carol.

### Step 4: Create Habits

Each user needs at least one habit to select during Nous Together.

**Alice's Browser:**
1. Go to **Dashboard**
2. In "Add new habit" field, type: "Study Math"
3. Click "Add" or press Enter
4. Add another: "Read Books"

**Bob's Browser:**
1. Go to **Dashboard**
2. Add habit: "Exercise"
3. Add habit: "Code Project"

**Carol's Browser:**
1. Go to **Dashboard**
2. Add habit: "Study Science"
3. Add habit: "Practice Piano"

---

## Test Cases

### ✅ Test Case 1: Single Friend Nous Session

**Goal:** Test basic 2-person Nous Together with habit selection

**Steps:**

1. **Alice sends request:**
   - Go to Friends page
   - Click "Nous together" button on Bob's profile
   - **Modal should appear** with:
     - Friend list showing Bob with checkbox
     - Habit list showing "Study Math" and "Read Books"
   - Check ✅ Bob
   - Select ⭕ "Study Math"
   - Click "Send Request"
   - Success notification: "Nous request sent to 1 friend!"

2. **Bob accepts request:**
   - Go to Dashboard (or Friends page if notification appears there)
   - Should see: "nous together requests (1)"
   - Request shows: "@alice wants to Nous together"
   - Click "accept" button
   - **Modal should appear** with:
     - Header: "Nous with @alice"
     - Text: "They're working on: Study Math"
     - Habit list: "Exercise", "Code Project"
   - Select ⭕ "Exercise"
   - Click "Accept & Join"
   - Success: "Nous session started with 2 participants!"

3. **Verify shared timer appears:**
   - Both Alice and Bob go to Dashboard
   - Should see purple timer card at top with:
     ```
     Nous Together (2 participants)
     👤 You • Study Math        (in Alice's view)
     👥 @bob • Exercise

     [00:00:00.00]
     [Pause] [Stop] [Chat 💬]
     ```
   - Bob's view shows:
     ```
     Nous Together (2 participants)
     👤 You • Exercise          (in Bob's view)
     👥 @alice • Study Math
     ```

4. **Test timer controls:**
   - Click ▶️ Pause → timer pauses for both
   - Click ▶️ Play → timer resumes for both
   - Let it run for ~30 seconds
   - Click 🛑 Stop

5. **Verify session saved:**
   - Alice: Check Dashboard → should see session under "Study Math" habit
   - Bob: Check Dashboard → should see session under "Exercise" habit
   - Both should have ~30 seconds duration
   - Sessions should be marked as "shared"

**Expected Result:** ✅ PASS if both users get time added to their individual habits

---

### ✅ Test Case 2: Multi-Friend Nous Session (3 people)

**Goal:** Test 3-person Nous Together with different habits

**Steps:**

1. **Alice sends request to multiple friends:**
   - Go to Friends page
   - Click "Nous together" on Bob's profile
   - Modal appears with all friends
   - Check ✅ Bob
   - Check ✅ Carol
   - Counter shows: "Select friends (2/4 selected)"
   - Select habit: "Read Books"
   - Click "Send Request"
   - Success: "Nous request sent to 2 friends!"

2. **Bob accepts:**
   - Dashboard shows Nous request from Alice
   - Click "accept"
   - Modal shows: "They're working on: Read Books"
   - Select habit: "Code Project"
   - Click "Accept & Join"
   - Message: "You accepted! Waiting for 1 more..."

3. **Carol accepts:**
   - Dashboard shows Nous request from Alice
   - Click "accept"
   - Modal shows: "They're working on: Read Books"
   - Select habit: "Practice Piano"
   - Click "Accept & Join"
   - Message: "Nous session started with 3 participants!"

4. **Verify 3-person timer:**
   - All three users go to Dashboard
   - Should see:
     ```
     Nous Together (3 participants)
     👤 You • [your habit]
     👥 @alice • Read Books
     👥 @bob • Code Project
     👥 @carol • Practice Piano
     ```
   - Note: Order may vary based on who's viewing

5. **Let timer run for 1-2 minutes, then stop**

6. **Verify each person's sessions:**
   - Alice: +1-2 min on "Read Books"
   - Bob: +1-2 min on "Code Project"
   - Carol: +1-2 min on "Practice Piano"

**Expected Result:** ✅ PASS if all 3 users get time on their chosen habit

---

### ✅ Test Case 3: Maximum Participants (5 people)

**Goal:** Test the 4-friend limit (5 total)

**Note:** You'll need 5 browser windows for this. If you only have 3, skip to Test Case 4.

**Steps:**
1. Create 2 more test users (Dave, Eve)
2. Alice sends Nous request to Bob, Carol, Dave, Eve (4 friends)
3. Try to check a 5th friend → Should show error: "Maximum 4 friends (5 total participants)!"
4. All 4 friends accept with their chosen habits
5. Verify timer shows all 5 participants
6. Stop and verify all 5 get their time

**Expected Result:** ✅ PASS if limit enforced and all 5 users tracked correctly

---

### ✅ Test Case 4: Habit Selection Required

**Goal:** Ensure habit selection is mandatory

**Steps:**

1. **Alice sends request:**
   - Friends page → "Nous together" → select Bob
   - Don't select a habit
   - Click "Send Request"
   - Should show error: "Please select what you're working on!"

2. **Bob accepts without selecting:**
   - See request, click "accept"
   - Modal opens
   - Don't select a habit
   - Click "Accept & Join"
   - Should show error: "Please select what you're working on!"

**Expected Result:** ✅ PASS if validation prevents submission without habit

---

### ✅ Test Case 5: No Habits Available

**Goal:** Test behavior when user has no habits

**Steps:**

1. **Create new user (Frank) with no habits:**
   - New incognito window
   - Guest login
   - Don't create any habits
   - Add Alice as friend

2. **Frank tries to send Nous request:**
   - Click "Nous together" on Alice
   - Modal shows: "No habits yet. Create one in the Dashboard first!"
   - Cannot select any habit
   - "Send Request" button should be disabled

3. **Alice sends request to Frank:**
   - Alice sends request to Frank
   - Frank accepts
   - Modal shows: "No habits yet. Create one in the Dashboard first!"
   - Cannot accept

**Expected Result:** ✅ PASS if gracefully handles no-habit scenario

---

### ✅ Test Case 6: Chat During Multi-Participant Session

**Goal:** Verify chat works with 3+ people

**Steps:**

1. Start a 3-person Nous session (Alice, Bob, Carol)
2. All users see the timer with Chat button
3. Alice clicks Chat button (💬)
4. Chat box appears
5. Alice types: "Hey everyone!" and sends
6. Bob and Carol should see message from Alice
7. Bob replies: "Hi Alice!"
8. All three should see both messages
9. Unread badge should appear for those who haven't opened chat

**Expected Result:** ✅ PASS if all participants see all messages

---

### ✅ Test Case 7: Session Flow Option B (Independent Timers)

**Goal:** Verify each person's timer starts from 0 when they join

**Steps:**

1. **Alice sends request to Bob and Carol**
2. **Bob accepts immediately** → his timer starts at 00:00:00
3. **Wait 1 minute**
4. **Carol accepts** → her timer starts at 00:00:00 (not 01:00:00)
5. **Alice's timer shows** 01:00:00+ (started when she sent)
6. **Bob's timer shows** 01:00:00+ (started when he accepted)
7. **Carol's timer shows** 00:00:00+ (just started)

**Important:** Currently the implementation starts timer when ALL accept. This is option A, not option B.

**To implement option B properly, we would need:**
- Each participant has their own start time
- UI shows each person's individual time
- When stopped, each person gets their own elapsed time

**Current behavior:** All participants get same time (start time = when all accepted)

**Expected Result:**
- ⚠️ Currently FAILS - implements option A (shared start time)
- Need to modify if option B (individual start times) is required

---

## Browser Console Testing

For detailed database inspection, run this in browser console:

```javascript
// Copy the contents of tests/test-multi-participant-nous.js
// Paste into browser console while logged in
```

This will show:
- Pending requests with participant details
- Active timers with all participants
- Your habits available for selection
- Friendships

---

## Common Issues & Solutions

### Issue 1: Modal doesn't appear
**Solution:**
- Check browser console for JavaScript errors
- Ensure you're on Friends page
- Refresh page and try again

### Issue 2: Request not showing for receiver
**Solution:**
- Check Firestore rules allow read/write to nousRequests
- Verify both users are logged in
- Check toUserIds array contains correct userId

### Issue 3: Timer doesn't start after all accept
**Solution:**
- Check browser console for errors
- Verify Firestore rules allow sharedTimers creation
- Ensure participantHabits object is populated

### Issue 4: Sessions not saved to correct habits
**Solution:**
- Check stopSharedTimer function in index.html
- Verify participantHabits[userId] contains correct habitId
- Check Firebase console for session documents

### Issue 5: Can't see other participants in timer
**Solution:**
- Verify sharedTimer has participants array
- Check participantNames and participantHabits are populated
- Refresh Dashboard page

---

## Success Criteria

All test cases should PASS for feature to be considered complete:

- ✅ Test Case 1: Single friend (2 people)
- ✅ Test Case 2: Multiple friends (3 people)
- ✅ Test Case 3: Maximum participants (5 people)
- ✅ Test Case 4: Habit selection validation
- ✅ Test Case 5: No habits handling
- ✅ Test Case 6: Multi-participant chat
- ⚠️ Test Case 7: Option B timer flow (needs clarification/implementation)

---

## Next Steps After Testing

1. **Document any bugs found**
2. **Test on deployed environment** (not just localhost)
3. **Update Firestore security rules** for new schema
4. **Add email invitation feature** (if desired)
5. **Create automated Playwright tests**

---

## Quick Test Script

Minimal test to verify feature works:

1. Open 2 incognito windows → Guest login both
2. Window 1: Settings → username "alice"
3. Window 2: Settings → username "bob"
4. Exchange friend codes → become friends
5. Both: Create habit (Window 1: "Study", Window 2: "Exercise")
6. Window 1: Friends → "Nous together" → select Bob → select "Study" → Send
7. Window 2: Dashboard → Accept → select "Exercise" → Accept & Join
8. Both: Dashboard → See timer with 2 participants
9. Both: Let run 30 sec → Stop
10. Both: Check your habit has +30 seconds

✅ If all above works = Feature working!

---

**Testing Timestamp:** [Run date]
**Tested By:** [Your name]
**Environment:** localhost:8080
**Browser:** [Chrome/Firefox/Safari]
