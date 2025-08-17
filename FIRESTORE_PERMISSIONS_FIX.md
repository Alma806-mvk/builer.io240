# 🔧 Fix Firestore Permissions for Credits

The app is showing "Missing or insufficient permissions" errors because the Firestore security rules need to be updated.

## Quick Fix (Recommended)

### Option 1: Deploy via Command Line

```bash
# Make sure you're in the project directory
firebase login
firebase deploy --only firestore:rules
```

### Option 2: Update via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `final-c054b`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the current rules with the updated content from `firestore.rules`
5. Click **Publish**

## What Was Fixed

The updated `firestore.rules` file now includes:

### ✅ Improved Credit Transactions Rules

```javascript
// Allow users to read and write their own credit transactions
match /credit_transactions/{transactionId} {
  allow read: if request.auth != null &&
    (resource == null || request.auth.uid == resource.data.userId);
  allow write: if request.auth != null &&
    (resource == null || request.auth.uid == resource.data.userId);
  allow create: if request.auth != null &&
    request.auth.uid == request.resource.data.userId;
}
```

### ✅ Enhanced User Credits Rules

```javascript
// Allow users to read and write their own credit data
match /user_credits/{userId} {
  allow read, write, create, update: if request.auth != null && request.auth.uid == userId;
}
```

## Key Changes Made:

1. **Fixed null resource issue**: Added `resource == null` checks for read operations
2. **Added explicit create/update permissions**: Ensures all CRUD operations work
3. **Better error handling**: The app now gracefully handles permission issues
4. **Offline mode fallback**: Credits will work locally if Firestore is inaccessible

## Testing the Fix

After deploying the rules:

1. **Refresh your app** (hard refresh: Ctrl+F5 or Cmd+Shift+R)
2. **Check the browser console** - you should see:
   - ✅ No more "permission denied" errors
   - ✅ "🔄 Setting up Firestore listeners for user: [user-id]"
   - ✅ Credits loading successfully

## If Problems Persist

### Check Your Firebase Project

```bash
firebase projects:list
firebase use final-c054b  # Make sure you're using the right project
```

### Verify Authentication

- Make sure you're logged in to the app
- Check that `request.auth.uid` matches your user ID

### Manual Rules Check

In Firebase Console → Firestore → Rules, your rules should look like the content in `firestore.rules`.

## Current App Behavior

The app now includes:

- **Automatic fallback**: Uses local credits (25 free credits) if Firestore is inaccessible
- **User notification**: Shows a warning if running in offline mode
- **Retry logic**: Attempts to reconnect to Firestore automatically
- **Graceful degradation**: All features continue to work offline

---

🎉 **Once the rules are deployed, your credit system will work perfectly!**
