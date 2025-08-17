# Firestore Rules Setup for Credit System

## Issue

The credit system requires Firestore security rules to be deployed for the new collections:

- `user_credits` - stores user credit balances
- `credit_transactions` - stores credit transaction history

## Current Error

```
FirebaseError: [code=permission-denied]: Missing or insufficient permissions.
```

## Solution

Deploy the updated Firestore rules using the Firebase CLI:

### Step 1: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase project (if not already done)

```bash
firebase init
```

### Step 4: Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
```

## Rules Added

The following rules have been added to `firestore.rules`:

```javascript
// Allow users to read and write their own credit data
match /user_credits/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Allow users to read and write their own credit transactions
match /credit_transactions/{transactionId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
}
```

## Fallback for Development

Until the rules are deployed, the credit system will:

1. Show a warning in the console
2. Use fallback credit data (25 credits)
3. Allow local credit deductions for testing
4. Display empty transaction history

## Verification

After deploying the rules, the errors should disappear and the credit system should work fully.
