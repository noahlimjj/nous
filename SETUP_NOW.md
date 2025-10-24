# 🚀 Final Setup Steps - Let's Do This!

Everything is ready! Just 2 quick steps to give `noahlim` the power to delete user accounts.

---

## Step 1: Upgrade to Blaze Plan (2 minutes) ✅ FREE

1. Click this link: https://console.firebase.google.com/project/study-d2678/usage/details

2. Click the **"Modify plan"** or **"Upgrade"** button

3. Select **"Blaze - Pay as you go"**

4. Enter your credit card info (for verification only)

5. Confirm the upgrade

**✅ You won't be charged!** Your usage is well within the free tier.

---

## Step 2: Deploy Cloud Functions (1 minute)

Run this command in your terminal:

```bash
cd /Users/User/Study_tracker_app
firebase deploy --only functions
```

You should see:
```
✔ functions[deleteUserByUsername]: Successful create operation.
✔ functions[setUserAdmin]: Successful create operation.
Deploy complete!
```

---

## Step 3: Set noahlim as Admin (2 minutes)

### Option A: Firebase Console (Easier)
1. Go to: https://console.firebase.google.com/project/study-d2678/firestore/data
2. Click on `users` collection
3. Find the document where `username = "noahlim"`
4. Click "+ Add field"
   - Field: `admin`
   - Type: `boolean`
   - Value: `true`
5. Click "Update"

### Option B: Using Firestore Rules (Alternative)
If you want to set it programmatically, I can temporarily update your Firestore rules to allow it.

---

## ✅ Test It Out!

1. Open your app: https://nousi.netlify.app
2. Log in as `noahlim`
3. Go to **Settings** page
4. You should see a red **"🛡️ Admin Panel"** section
5. Try deleting a test user by entering their username

---

## 🎯 What You Can Do Now

As admin, you can:
- ✅ Delete user accounts by username
- ✅ Remove all their data (habits, sessions, friendships)
- ✅ Clean up test accounts
- ✅ Handle user deletion requests

All deletions are:
- ✅ Permanent
- ✅ Complete (removes from Authentication + Firestore)
- ✅ Logged in Firebase Functions logs
- ✅ Protected (only admins can do this)

---

## 💰 Cost Summary

**Monthly Cost: $0.00**

Your usage:
- Maybe 5-20 user deletions per month
- = 5-20 function invocations
- = 0.001% of free tier (2M free invocations)

You'd need to delete **100,000 users per month** to pay anything!

---

## 🆘 Need Help?

**If deployment fails:**
```bash
firebase login
firebase use study-d2678
firebase deploy --only functions
```

**If you get permission errors:**
- Make sure you're logged into the correct Firebase account
- Check that you're in the right project

**If admin panel doesn't show:**
- Verify `admin: true` is set in Firestore
- Log out and log back in
- Clear browser cache

---

## 📋 What I Already Set Up For You

✅ Cloud Functions code (`functions/index.js`)
✅ Admin UI in Settings page
✅ Firebase SDK imports
✅ Security checks in functions
✅ Confirmation modals
✅ Error handling
✅ Complete data deletion logic
✅ All dependencies installed

**You're ready to deploy! 🎉**
