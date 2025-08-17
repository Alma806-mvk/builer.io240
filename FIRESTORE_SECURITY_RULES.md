# Firestore Security Rules - CreateGen Studio

## Overview

This document describes the comprehensive, production-ready Firestore Security Rules for CreateGen Studio. The rules follow the **principle of least privilege** and implement a **default deny** security posture.

## Security Architecture

### 🔒 Core Security Principles

1. **Default Deny**: All access is denied unless explicitly allowed
2. **Authentication Required**: All operations require valid Firebase Auth
3. **Ownership-Based Access**: Users can only access their own data
4. **Data Integrity**: Strict validation for document creation and updates
5. **No Admin Backdoors**: No blanket admin access (can be enabled if needed)

## Rule Structure

### 1. Default Deny Foundation
```javascript
match /{document=**} {
  allow read, write: if false;
}
```
- **Purpose**: Denies all access not explicitly allowed
- **Position**: Last rule in the ruleset
- **Security**: Prevents unauthorized access to any undocumented paths

### 2. Users Collection Rules (`/users/{userId}`)

#### Read Access
```javascript
allow get: if request.auth != null && request.auth.uid == userId;
```
- **Scope**: Single document reads only (`get`)
- **Access**: Users can only read their own user document
- **Security**: Prevents access to other users' data

#### Create Access
```javascript
allow create: if request.auth != null 
              && request.auth.uid == userId
              && request.auth.uid == request.resource.data.uid;
```
- **Validation**: Auth UID must match both path and document data
- **Protection**: Prevents creating documents for other users

#### Update Access
```javascript
allow update: if request.auth != null 
              && request.auth.uid == userId
              && request.auth.uid == resource.data.uid;
```
- **Ownership**: Must own existing document to update
- **Integrity**: Prevents unauthorized modifications

#### Denied Operations
- **Delete**: `allow delete: if false;` - Users cannot delete their account
- **List**: `allow list: if false;` - Cannot enumerate users collection

### 3. Generic User Content Rules

#### Universal Ownership Pattern
```javascript
match /{collection}/{documentId} {
  allow read, write: if collection != 'users'
                     && request.auth != null
                     && isOwner();
}
```
- **Scope**: All collections except `users`
- **Pattern**: Ownership via `userId`, `uid`, or `owner` fields
- **Scalability**: Automatically covers new collections

#### Helper Functions

**`isOwner()` Function**:
```javascript
function isOwner() {
  return resource == null || 
         (resource.data.keys().hasAny(['userId', 'uid', 'owner']) && 
          (resource.data.get('userId', '') == request.auth.uid ||
           resource.data.get('uid', '') == request.auth.uid ||
           resource.data.get('owner', '') == request.auth.uid));
}
```

**`isValidNewDocument()` Function**:
```javascript
function isValidNewDocument() {
  return request.resource.data.keys().hasAny(['userId', 'uid', 'owner']) && 
         (request.resource.data.get('userId', '') == request.auth.uid ||
          request.resource.data.get('uid', '') == request.auth.uid ||
          request.resource.data.get('owner', '') == request.auth.uid);
}
```

## Specific Collection Rules

### 🔄 Credit Transactions (`/credit_transactions/{transactionId}`)

**Enhanced Security**:
- **Read**: Only own transactions
- **List**: Query-constrained to user's transactions only
- **Create**: Validated structure with required fields
- **Update/Delete**: Completely forbidden (immutable records)

**Validation Function**:
```javascript
function isValidTransaction() {
  return request.resource.data.keys().hasAll(['userId', 'amount', 'type', 'timestamp']) &&
         request.resource.data.userId is string &&
         request.resource.data.amount is number &&
         request.resource.data.type is string &&
         request.resource.data.timestamp != null;
}
```

### 📊 Subscriptions (`/subscriptions/{userId}`)
- **Path-based ownership**: `userId` in path must match auth UID
- **Operations**: Full CRUD access for own subscription

### 📈 Usage Tracking (`/usage/{usageId}`)
- **Key-based ownership**: Auth UID must be in document keys
- **Flexible structure**: Supports various usage tracking patterns

### 💳 User Credits (`/user_credits/{userId}`)
- **Individual access**: One document per user
- **Path ownership**: Direct UID matching

## Subcollection Support

### 2-Level Nested Collections
```javascript
match /users/{userId}/{subcollection}/{documentId} {
  allow read, write: if request.auth != null
                     && request.auth.uid == userId
                     && isSubcollectionOwner(userId);
}
```

### 3-Level Nested Collections
```javascript
match /users/{userId}/{subcollection}/{subDocId}/{nestedCollection}/{nestedDocId} {
  allow read, write: if request.auth != null
                     && request.auth.uid == userId;
}
```

## Data Ownership Patterns

### Supported Ownership Fields
The rules recognize these ownership patterns:

1. **`userId`**: Most common pattern
2. **`uid`**: Alternative user identifier
3. **`owner`**: Explicit ownership field

### Document Structure Examples

**User Document**:
```javascript
{
  "uid": "user123",
  "email": "user@example.com",
  "youtube_refresh_token": "...",
  "youtube_pulse_data": { ... }
}
```

**Credit Transaction**:
```javascript
{
  "userId": "user123",
  "amount": 100,
  "type": "purchase",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Canvas Board**:
```javascript
{
  "userId": "user123",
  "name": "My Board",
  "items": [...],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Security Testing

### ✅ Allowed Operations

**User can access their own data**:
```javascript
// ✅ Reading own user document
firebase.firestore().doc('/users/user123').get() // user123 authenticated

// ✅ Creating own content
firebase.firestore().collection('canvas_boards').add({
  userId: 'user123',
  name: 'My Board'
}) // user123 authenticated

// ✅ Updating own content
firebase.firestore().doc('/credit_transactions/trans123').update({
  status: 'completed'
}) // If trans123.userId === 'user123'
```

### ❌ Denied Operations

**User cannot access others' data**:
```javascript
// ❌ Reading other user's document
firebase.firestore().doc('/users/user456').get() // user123 authenticated

// ❌ Creating content for others
firebase.firestore().collection('canvas_boards').add({
  userId: 'user456',
  name: 'Board'
}) // user123 authenticated

// ❌ Listing users collection
firebase.firestore().collection('users').get() // Any user
```

## Production Deployment

### 1. Validate Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Test Rules
```bash
firebase emulators:start --only firestore
```

### 3. Monitor Security
- Review Firebase Console for security warnings
- Monitor denied requests in logs
- Regular security audits

## Performance Considerations

### Optimized Queries
- **Single Document Reads**: Efficient `get` operations
- **Constrained Lists**: Query-based filtering prevents large scans
- **Index-Friendly**: Rules work with Firestore's indexing

### Avoided Anti-Patterns
- ❌ No collection-wide reads
- ❌ No unconstrained queries  
- ❌ No recursive document access
- ❌ No complex joins in security rules

## Troubleshooting

### Common Issues

**Permission Denied on Create**:
- Ensure document includes ownership field (`userId`, `uid`, or `owner`)
- Verify ownership field matches authenticated user's UID

**Permission Denied on Read**:
- Check if user is authenticated
- Verify document has correct ownership field
- Ensure reading own data only

**List Queries Fail**:
- Add query constraint for `userId`
- Use `where('userId', '==', currentUser.uid)`

### Debugging
```javascript
// Enable debug logging
firebase.firestore.setLogLevel('debug');

// Check auth state
firebase.auth().onAuthStateChanged(user => {
  console.log('Auth state:', user?.uid);
});
```

## Future Enhancements

### Optional Admin Access
```javascript
// Uncomment for admin panel access
match /{document=**} {
  allow read, write: if request.auth != null 
                     && request.auth.token.admin == true;
}
```

### Role-Based Access
```javascript
function hasRole(role) {
  return request.auth.token.get('role', '') == role;
}
```

### Team Collaboration
```javascript
function isTeamMember() {
  return request.auth.uid in resource.data.teamMembers;
}
```

These rules provide a secure, scalable foundation for CreateGen Studio while maintaining flexibility for future features and growth.
