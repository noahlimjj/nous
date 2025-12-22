# Data Incident Report - 2025-10-24

## Summary
A critical data access issue occurred where users' habits, sessions, and goals data appeared to be missing from the UI. The data was **never deleted** from Firebase, but the application was looking in the wrong location.

## Root Cause
The Firebase database had **three different storage locations** (appId paths) where user data could exist:
1. `artifacts/default-app-id/users/{userId}`
2. `artifacts/study-tracker-app/users/{userId}`
3. `artifacts/studyTrackerApp/users/{userId}`

Different users had their data in different locations depending on when they joined and which version of the app they used.

## Timeline of Events

### Initial State (Working)
- App used `default-app-id` as the default location
- Most users' data was in this location
- App was functioning correctly

### Incident Trigger
1. **CSS/Style Changes**: Made premium dark mode changes and consolidated CSS files
2. **Service Worker Issues**: Service worker was aggressively caching, causing stale code to run
3. **AppId Change**: In an attempt to fix issues, changed default appId from `default-app-id` to `study-tracker-app`
4. **Data Migration**: Created migration tool that moved data to `study-tracker-app`
5. **Reverted Change**: Changed back to `default-app-id`, breaking access to migrated data
6. **Changed Back Again**: Changed to `study-tracker-app`, breaking access for users who didn't migrate

### Result
- Users saw empty UI (no habits, sessions, goals)
- Data was safe in Firebase but app couldn't find it
- Different users had data in different locations

## Technical Details

### The Problem
```javascript
// This line determined where the app looked for data:
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
```

When we changed `'default-app-id'` to `'study-tracker-app'`, all users whose data was in `default-app-id` suddenly couldn't see their data.

### Why Multiple Locations Existed
1. **Legacy Code**: App originally used `default-app-id`
2. **Code Changes**: At some point, code was changed to use different appIds
3. **Inconsistent Migrations**: Not all users' data was migrated together
4. **No Single Source of Truth**: App didn't enforce a single storage location

## Lessons Learned

### 1. **Data Location Must Be Consistent**
- ❌ **Don't** have multiple possible storage locations for user data
- ✅ **Do** enforce a single, consistent path structure
- ✅ **Do** migrate all users' data at once when changing structure

### 2. **Service Workers Are Dangerous for Data Apps**
- ❌ **Don't** aggressively cache JavaScript files that contain data logic
- ✅ **Do** use cache-busting techniques (APP_VERSION)
- ✅ **Do** skip caching for POST/PUT/DELETE requests
- ✅ **Do** provide manual cache clear instructions to users

### 3. **Test Data Changes Thoroughly**
- ❌ **Don't** change data paths without comprehensive testing
- ✅ **Do** test with multiple user accounts
- ✅ **Do** verify data is accessible after changes
- ✅ **Do** have rollback procedures ready

### 4. **Document Data Structure**
- ❌ **Don't** assume everyone knows where data is stored
- ✅ **Do** document the Firebase path structure clearly
- ✅ **Do** maintain a data schema document
- ✅ **Do** version your data structure

### 5. **Migration Best Practices**
- ❌ **Don't** require users to manually run migrations
- ✅ **Do** make migrations automatic and transparent
- ✅ **Do** run migrations once per user
- ✅ **Do** verify migration success before marking complete
- ✅ **Do** preserve original data during migration

## The Solution

### Automatic Data Consolidation
Created `migrateAndConsolidateData()` function that:
1. **Checks all three possible locations** for user data
2. **Collects all data** (habits, sessions, goals)
3. **Deduplicates** data (keeps newest version if duplicates exist)
4. **Writes everything** to single location: `study-tracker-app`
5. **Marks migration complete** (runs only once per user)
6. **Runs automatically** on app load

### Code Implementation
```javascript
const migrateAndConsolidateData = async (db, userId) => {
    const TARGET_APP_ID = 'study-tracker-app';

    // Check if already migrated
    const migrationComplete = localStorage.getItem(`migration_complete_${userId}`);
    if (migrationComplete === 'true') {
        return TARGET_APP_ID;
    }

    // Collect data from all three locations
    const possibleAppIds = ['default-app-id', 'study-tracker-app', 'studyTrackerApp'];
    const allData = { habits: new Map(), sessions: new Map(), goals: new Map() };

    for (const appId of possibleAppIds) {
        // Collect habits, sessions, goals...
    }

    // Write all data to TARGET_APP_ID
    // Mark complete
    localStorage.setItem(`migration_complete_${userId}`, 'true');
    return TARGET_APP_ID;
};
```

## Current State

### Data Location (After Fix)
- **All data consolidated to**: `artifacts/study-tracker-app/users/{userId}`
- **All components use**: `'study-tracker-app'` as appId
- **Migration runs**: Automatically on first load for each user
- **Migration runs**: Only once per user (cached in localStorage)

### Files Modified
1. `index.js`:
   - Added `migrateAndConsolidateData()` function
   - Updated Dashboard to run migration on load
   - All appId declarations set to `'study-tracker-app'`

2. `service-worker.js`:
   - Updated CACHE_NAME to force cache clear
   - Skips caching POST/PUT/DELETE requests

3. `migrate.html`:
   - Manual migration page (backup option)
   - Consolidates data to `'study-tracker-app'`

## Prevention Measures

### For Future Code Changes
1. **Never change data paths** without:
   - Comprehensive testing with multiple accounts
   - Automatic migration strategy
   - Rollback plan
   - User communication

2. **Always verify data accessibility** after deployments

3. **Monitor Firebase console** to see actual data location

4. **Keep APP_VERSION updated** to force cache clears

### For Users
1. **Hard refresh** (Cmd+Shift+R) if data doesn't appear
2. **Clear service worker** in DevTools → Application → Service Workers
3. **Visit /migrate.html** as last resort (should not be needed with auto-migration)

## Data Safety Confirmation

### ✅ Data Was Never Deleted
- All user data remained safe in Firebase throughout the incident
- The issue was **UI only** - data access problem, not data loss
- Migration consolidates existing data, doesn't create new data

### ✅ Current Safety Measures
- Auto-migration preserves all data
- Deduplication prevents overwrites
- Migration only runs once per user
- Original data remains in original locations (not deleted)

## Firebase Data Structure (Current)

```
Firestore
├── artifacts/
│   ├── study-tracker-app/          ← SINGLE SOURCE OF TRUTH
│   │   └── users/
│   │       └── {userId}/
│   │           ├── habits/         ← User's habits
│   │           ├── sessions/       ← User's study sessions
│   │           ├── goals/          ← User's goals
│   │           └── notebooks/      ← User's notes & todos
│   │
│   ├── default-app-id/             ← Legacy (data will be migrated from here)
│   └── studyTrackerApp/            ← Legacy (data will be migrated from here)
```

## Testing Checklist

Before future deployments involving data:
- [ ] Test with account that has data in `default-app-id`
- [ ] Test with account that has data in `study-tracker-app`
- [ ] Test with account that has data in `studyTrackerApp`
- [ ] Test with brand new account (no data)
- [ ] Verify all data appears in UI
- [ ] Verify Firebase shows data in correct location
- [ ] Test service worker cache clearing
- [ ] Test hard refresh behavior

## Conclusion

This incident taught us the critical importance of:
1. **Consistent data architecture** from day one
2. **Careful service worker implementation** in data-driven apps
3. **Automatic, transparent migrations** for users
4. **Thorough testing** with multiple user scenarios
5. **Clear documentation** of data structure

The fix ensures all users will automatically have their data consolidated into a single location without manual intervention, preventing future issues.

---

**Status**: Resolved with automatic migration system
**Data Loss**: None
**User Action Required**: None (automatic migration)
**Last Updated**: 2025-10-24 12:05 PM
