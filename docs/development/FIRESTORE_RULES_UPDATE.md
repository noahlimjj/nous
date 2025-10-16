# Firestore Rules Update Required

## ⚠️ IMPORTANT: You Must Update Your Firestore Security Rules

The multi-participant Nous Together feature requires updated Firestore security rules to work properly.

## What Changed

The new rules support:
1. **Multi-participant requests** - `toUserIds` array instead of single `toUserId`
2. **Backward compatibility** - Still supports old single-person requests
3. **Auto-decline after 2 hours** - Automatic expiration of stale requests

## How to Update

### Option 1: Firebase Console (Recommended)

1. **Go to Firebase Console:**
   - Open https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Rules:**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Copy the new rules:**
   - Open the file: `system/firestore.rules`
   - Copy ALL the contents

4. **Paste and publish:**
   - Delete all existing rules in the Firebase console
   - Paste the new rules from `system/firestore.rules`
   - Click "Publish"

5. **Verify:**
   - Should see success message
   - Rules will be active immediately

### Option 2: Firebase CLI

If you have Firebase CLI installed:

```bash
# From project root directory
firebase deploy --only firestore:rules
```

## Updated Rules Summary

### Nous Requests Collection

**Old (2-person only):**
```javascript
allow read: if request.auth.uid == resource.data.toUserId;
```

**New (multi-participant):**
```javascript
allow read: if request.auth.uid in resource.data.get('toUserIds', []);
```

**Key Changes:**
- `toUserId` → `toUserIds` (array)
- Supports both old and new schema for backward compatibility
- Uses `resource.data.get('toUserIds', [])` to handle missing field gracefully

## Auto-Decline Feature

The app now automatically expires Nous requests after **2 hours**.

**What happens:**
- Every time requests are fetched, age is checked
- Requests older than 2 hours are marked as `status: 'expired'`
- Users won't see expired requests
- Console logs: "Auto-declined expired Nous request from @username"

**No additional rules needed** - handled in application code.

## Testing the Rules

After updating, test with:

1. **Create a multi-participant request:**
   - Should succeed

2. **Accept as one of multiple recipients:**
   - Should succeed

3. **View request as sender:**
   - Should succeed

4. **View request as recipient:**
   - Should succeed

If any of these fail, check:
- Rules were published successfully
- No syntax errors in rules
- User is authenticated
- userId matches toUserIds array

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause:** Rules not updated or syntax error

**Solution:**
1. Check Firebase Console → Firestore → Rules tab
2. Look for error messages
3. Copy rules exactly from `system/firestore.rules`
4. Click "Publish" again

### Error: "Field 'toUserIds' not found"

**Cause:** Trying to read old-schema requests with new query

**Solution:**
- Rules already handle this with `.get('toUserIds', [])`
- If still errors, check that query uses correct field name

### Requests not appearing

**Cause:** Query looking for wrong field

**Solution:**
- Old requests: Query `toUserId == userId`
- New requests: Query `toUserIds array-contains userId`
- Code now uses `toUserIds` only

## Migration Notes

**Old requests still in database?**
- They'll continue to work if they have `toUserId` field
- But won't appear in new queries looking for `toUserIds`
- Consider cleaning up old requests:

```javascript
// Optional: Clean up old single-person requests
// Run once in browser console
const cleanup = async () => {
    const oldRequests = await getDocs(
        query(collection(db, 'nousRequests'),
              where('status', '==', 'pending'))
    );

    for (const doc of oldRequests.docs) {
        const data = doc.data();
        if (data.toUserId && !data.toUserIds) {
            // Old schema - optionally delete or update
            await updateDoc(doc.ref, { status: 'obsolete' });
        }
    }
};
```

## Current Rules Location

**File:** `system/firestore.rules`

**Deployed to:** Firebase Firestore (via console or CLI)

**Last Updated:** [Current date]

**Version:** 2.0 (Multi-participant support)

---

## Summary Checklist

- [ ] Open Firebase Console
- [ ] Navigate to Firestore → Rules
- [ ] Copy contents of `system/firestore.rules`
- [ ] Paste into Firebase Console
- [ ] Click "Publish"
- [ ] Test multi-participant Nous requests
- [ ] Verify auto-decline works after 2 hours

Once complete, your multi-participant Nous Together feature will work correctly! 🎉
