# Comprehensive Habit Tracker Test Checklist

**URL:** https://nousi.netlify.app  
**Version:** v36 (hard refresh required: Cmd+Shift+R or Ctrl+Shift+R)

---

## Pre-Test Setup
- [ ] Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Open browser console (F12) to check for errors
- [ ] Verify you're logged in (guest or account)

---

## 1. CREATE HABIT

### Steps:
1. [ ] Click the **+ FAB button** (floating blue button, bottom-right)
2. [ ] Type "Meditation" in the habit name field
3. [ ] Select a **purple color** from the color picker
4. [ ] Select the **moon icon** (🌙) from the icon grid
5. [ ] Select **"easy"** difficulty
6. [ ] Click **"add habit"** button
7. [ ] Verify the modal closes
8. [ ] Verify "Meditation" appears in the habits list

### Expected Results:
- ✅ Modal opens when FAB is clicked
- ✅ All fields are editable
- ✅ Habit appears in list after creation
- ✅ Habit shows with purple color and moon icon
- ✅ Shows "5c" (coins for easy difficulty)

### Potential Issues to Check:
- ❌ FAB button not visible
- ❌ Modal doesn't open
- ❌ Form doesn't submit
- ❌ Habit doesn't appear after creation
- ❌ Error message appears

**Status:** ⬜ WORKS / ⬜ DOES NOT WORK  
**Notes:** 

---

## 2. EDIT HABIT

### Steps:
1. [ ] Find a habit in the list
2. [ ] Click the **pencil/edit icon** (✏️) next to the habit name
3. [ ] Verify edit modal opens
4. [ ] Change the name to "Morning Meditation"
5. [ ] Click **"save"** button
6. [ ] Verify modal closes
7. [ ] Verify the habit name updated in the list

### Expected Results:
- ✅ Edit icon is visible and clickable
- ✅ Modal opens with current habit data
- ✅ Name field is editable
- ✅ Changes save successfully
- ✅ Habit name updates in list

### Potential Issues to Check:
- ❌ Edit icon not visible
- ❌ Modal doesn't open
- ❌ Changes don't save
- ❌ Error: "Failed to rename habit"
- ❌ Name doesn't update in UI

**Status:** ⬜ WORKS / ⬜ DOES NOT WORK  
**Notes:** 

---

## 3. COMPLETE HABIT

### Steps:
1. [ ] Find a habit in the list
2. [ ] Locate the **circle button** for today (should have blue border if today)
3. [ ] Click the circle button for today
4. [ ] Verify the circle turns **GREEN**
5. [ ] Verify a **checkmark** (✓) appears inside
6. [ ] Check the **coin display** in the header (top-right)
7. [ ] Verify coins increased (easy=5, medium=10, hard=20)
8. [ ] Verify confetti animation appears (if available)

### Expected Results:
- ✅ Circle button is clickable
- ✅ Button turns green when clicked
- ✅ Checkmark appears
- ✅ Coins increase in header
- ✅ Confetti animation (optional)

### Potential Issues to Check:
- ❌ Circle button not clickable
- ❌ Button doesn't turn green
- ❌ Coins don't increase
- ❌ No visual feedback
- ❌ Error in console

**Status:** ⬜ WORKS / ⬜ DOES NOT WORK  
**Notes:** 

---

## 4. STREAK

### Steps:
1. [ ] Mark the same habit as complete for **today**
2. [ ] Use the week navigation arrows to go to **yesterday**
3. [ ] Mark the same habit as complete for **yesterday**
4. [ ] Go back to **today** (click "today" button or navigate)
5. [ ] Verify the **streak number** (🔥) appears next to the habit
6. [ ] Verify the streak shows **2** (or appropriate number)
7. [ ] Mark it for **2 days ago** and verify streak increases to **3**

### Expected Results:
- ✅ Week navigation works (left/right arrows)
- ✅ Can mark habits for past days
- ✅ Streak emoji (🔥) appears when streak > 0
- ✅ Streak number is correct
- ✅ Streak increases with consecutive days

### Potential Issues to Check:
- ❌ Week navigation doesn't work
- ❌ Can't mark past days
- ❌ Streak doesn't calculate
- ❌ Streak number is wrong
- ❌ Streak doesn't increase

**Status:** ⬜ WORKS / ⬜ DOES NOT WORK  
**Notes:** 

---

## 5. REWARDS PAGE

### Steps:
1. [ ] Click the **shopping cart icon** (🛒) in the header
2. [ ] Verify the page shows **"rewards"** heading (not "daily habits")
3. [ ] Verify you see a grid of reward cards (or empty state)
4. [ ] Click **"add reward"** button (or + button)
5. [ ] Type "Coffee Break" in the reward name field
6. [ ] Enter **10** in the cost field
7. [ ] Click **"add reward"** button
8. [ ] Verify modal closes
9. [ ] Verify "Coffee Break" appears in the rewards grid
10. [ ] Verify it shows "10 coins"

### Expected Results:
- ✅ Shopping cart icon is visible in header
- ✅ Clicking it navigates to rewards page
- ✅ Page shows "rewards" heading
- ✅ Add reward modal opens
- ✅ Reward is created successfully
- ✅ Reward appears in grid with correct cost

### Potential Issues to Check:
- ❌ Shopping cart icon not visible
- ❌ Clicking doesn't navigate
- ❌ Shows habits page instead of rewards
- ❌ Add reward button doesn't work
- ❌ Reward doesn't appear after creation
- ❌ Wrong page displayed

**Status:** ⬜ WORKS / ⬜ DOES NOT WORK  
**Notes:** 

---

## 6. BUY REWARD

### Steps:
1. [ ] Ensure you have enough coins (complete some habits first if needed)
2. [ ] Navigate to rewards page (shopping cart icon)
3. [ ] Find a reward you can afford
4. [ ] Click on the reward card
5. [ ] Verify **confetti animation** appears
6. [ ] Verify **"🎉 congratulations! reward claimed!"** message appears
7. [ ] Check coin display in header
8. [ ] Verify coins decreased by the reward cost
9. [ ] Try clicking a reward you **can't afford**
10. [ ] Verify it shows **"not enough coins!"** message (or is disabled)

### Expected Results:
- ✅ Clickable reward cards
- ✅ Confetti animation on purchase
- ✅ Success message appears
- ✅ Coins decrease correctly
- ✅ Can't buy if insufficient coins
- ✅ Error message for insufficient coins

### Potential Issues to Check:
- ❌ Reward not clickable
- ❌ No confetti animation
- ❌ Coins don't decrease
- ❌ Can buy without enough coins
- ❌ No error message for insufficient coins
- ❌ Confetti library not loaded

**Status:** ⬜ WORKS / ⬜ DOES NOT WORK  
**Notes:** 

---

## 7. DELETE HABIT

### Steps:
1. [ ] Find a habit in the list
2. [ ] Click the **pencil/edit icon** (✏️) to open edit modal
3. [ ] Verify edit modal opens
4. [ ] Click the **"delete"** button (red button at bottom)
5. [ ] Verify confirmation dialog appears: "Delete habit?"
6. [ ] Click **"OK"** to confirm
7. [ ] Verify modal closes
8. [ ] Verify the habit is **removed** from the list
9. [ ] Verify habit doesn't reappear after refresh

### Expected Results:
- ✅ Delete button visible in edit modal
- ✅ Confirmation dialog appears
- ✅ Habit is deleted after confirmation
- ✅ Habit disappears from list
- ✅ Deletion persists after refresh

### Potential Issues to Check:
- ❌ Delete button not visible
- ❌ No confirmation dialog
- ❌ Habit not deleted
- ❌ Error message appears
- ❌ Habit reappears after refresh

**Status:** ⬜ WORKS / ⬜ DOES NOT WORK  
**Notes:** 

---

## Additional Checks

### Console Errors:
- [ ] Open browser console (F12)
- [ ] Check for any red error messages
- [ ] Note any warnings

### Visual/UI Issues:
- [ ] Check if all icons render correctly
- [ ] Verify colors display properly
- [ ] Check mobile responsiveness (if testing on mobile)
- [ ] Verify modals are centered and visible

### Data Persistence:
- [ ] Refresh the page
- [ ] Verify all habits/rewards persist
- [ ] Verify coin balance persists
- [ ] Verify streak data persists

---

## Summary

**Total Features Tested:** 7  
**Features Working:** ___ / 7  
**Features Broken:** ___ / 7  

### Critical Issues Found:
1. 
2. 
3. 

### Minor Issues Found:
1. 
2. 
3. 

---

## Notes
_Add any additional observations, screenshots, or details here_

