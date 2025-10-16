# Nous Request Feature - Debugging Guide

## Issue
The "Nous together" button is showing "Failed to send Nous request" error.

## What I Did
I've added extensive logging to the `handleNousRequest` function to help identify the issue. The enhanced logging will now show:
- Friend data
- User ID
- User profile
- Database connection
- Request data being sent
- Specific error messages with details

## How to Debug

### Step 1: Test with Enhanced Logging
1. Make sure the server is running: `npm start`
2. Open the app at `http://localhost:8080`
3. Log in (as guest or with your account)
4. Open browser console (F12 or Cmd+Option+J)
5. Go to the Friends page
6. Click "Nous together" button on any friend
7. Check the console output

The console will now show:
```
Attempting to send Nous request...
Friend: {userId: "...", username: "...", ...}
User ID: ...
User Profile: {username: "...", ...}
Database: ...
```

### Step 2: Common Issues and Solutions

#### Issue 1: Firestore Security Rules
**Error**: `Missing or insufficient permissions`

**Solution**: Update your Firestore security rules to allow the `nousRequests` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ... existing rules ...

    // Nous Requests Collection
    match /nousRequests/{requestId} {
      // Allow users to create requests they're sending
      allow create: if request.auth != null &&
                      request.resource.data.fromUserId == request.auth.uid;

      // Allow users to read requests where they're the sender or receiver
      allow read: if request.auth != null &&
                    (resource.data.fromUserId == request.auth.uid ||
                     resource.data.toUserId == request.auth.uid);

      // Allow users to update requests they received
      allow update: if request.auth != null &&
                      resource.data.toUserId == request.auth.uid;

      // Allow users to delete their own sent requests
      allow delete: if request.auth != null &&
                      resource.data.fromUserId == request.auth.uid;
    }
  }
}
```

#### Issue 2: Missing User Profile
**Error**: `Your profile is incomplete`

**Solution**: Make sure your user profile has a username:
1. Go to Settings page
2. Check if you have a username set
3. If not, set one

#### Issue 3: Missing Database Connection
**Error**: `Missing required data`

**Solution**: Refresh the page to reinitialize the database connection.

### Step 3: Test the Create Test Friend Script
If you haven't already, run the test friend creation script to ensure all permissions are working:

1. Open browser console
2. Copy and paste the script from `create-test-friend-browser.js`
3. Run it
4. If it successfully creates a test friend, the permissions are correct

### Step 4: Check What Works
Compare with the friend request feature which uses similar code:
- Friend requests use the `friendRequests` collection
- Nous requests use the `nousRequests` collection
- Both should work identically

If friend requests work but Nous requests don't, it's definitely a security rules issue.

## Expected Console Output (Success)
```
Attempting to send Nous request...
Friend: {userId: "test_friend_123", username: "testfriend", ...}
User ID: abc123
User Profile: {username: "yourname", ...}
Database: Firestore instance
Checking for existing requests...
Creating Nous request...
Request data: {fromUserId: "abc123", fromUsername: "yourname", ...}
Nous request sent successfully!
```

## Expected Console Output (Error)
```
Attempting to send Nous request...
Friend: {userId: "test_friend_123", username: "testfriend", ...}
User ID: abc123
User Profile: {username: "yourname", ...}
Database: Firestore instance
Checking for existing requests...
Creating Nous request...
Request data: {fromUserId: "abc123", fromUsername: "yourname", ...}
Error sending Nous request: FirebaseError: Missing or insufficient permissions
Error details: Missing or insufficient permissions code: permission-denied
```

## Next Steps
1. Run the test and check the console
2. Share the console output with me
3. I'll help fix the specific issue

## Firestore Collections Used
- `nousRequests` - Stores Nous together requests
- `friendRequests` - Stores friend requests (for comparison)
- `friendships` - Stores accepted friendships
- `users` - Stores user profiles

All these collections need appropriate security rules.
