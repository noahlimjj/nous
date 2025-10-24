# Quick Admin Setup - Manual Steps Required

I've opened the Firebase Console for you. Here's what you need to do:

## ⚠️ Current Situation

Your Firebase project is on the **Spark (free) plan**, which doesn't support Cloud Functions. You have two options:

### Option A: Full Setup with Cloud Functions (Recommended)

**Step 1: Upgrade to Blaze Plan**
1. Go to: https://console.firebase.google.com/project/study-d2678/usage/details
2. Click "Upgrade" to Blaze (pay-as-you-go) plan
3. Note: Cloud Functions have a generous free tier (2M invocations/month)

**Step 2: Deploy Cloud Functions**
```bash
firebase deploy --only functions
```

**Step 3: Set Admin Flag** (see instructions below)

### Option B: Admin Flag Only (Limited)

Set the admin flag manually, but you won't be able to delete users through the app (only mark them for manual deletion).

---

## 🔧 Setting Admin Flag (Required for Both Options)

The Firebase Console should be open. Follow these steps:

1. **Navigate to Firestore Database**
   - You should see the Firestore data browser
   - Click on the `users` collection

2. **Find noahlim's document**
   - Look through the documents for one where `username = "noahlim"`
   - Click on that document to open it

3. **Add the admin field**
   - Click "+ Add field" button
   - Field name: `admin`
   - Field type: `boolean`
   - Value: `true`
   - Click "Update"

4. **Verify**
   - You should now see `admin: true` in the document

---

## ✅ Testing

1. Log in as `noahlim` in your app
2. Go to Settings page
3. You should see a red "Admin Panel" section

**If you chose Option A (Cloud Functions):**
- You can delete users by entering their username

**If you chose Option B (No Cloud Functions):**
- The admin panel will show, but the delete function won't work
- You'll see an error when trying to delete users

---

## 💰 Cost Information (Blaze Plan)

Firebase Blaze plan includes:
- All Spark plan features
- Pay-as-you-go for usage beyond free tier

**Cloud Functions Free Tier (per month):**
- 2,000,000 invocations
- 400,000 GB-seconds
- 200,000 CPU-seconds
- 5 GB network egress

**Estimated cost for your use case:** $0/month
(User deletions are rare, will easily stay within free tier)

---

## 🎯 What I've Already Done

✅ Created Cloud Functions code (`functions/index.js`)
✅ Added admin UI to Settings page
✅ Updated Firebase configuration
✅ Installed all dependencies
✅ Created documentation

**Ready to deploy as soon as you upgrade to Blaze!**

---

## 🆘 Need Help?

If you have issues:
1. Make sure you're logged into Firebase Console
2. Check that you're in the correct project (study-d2678)
3. Verify the username "noahlim" exists in the users collection
4. Try refreshing the app after setting the admin flag
