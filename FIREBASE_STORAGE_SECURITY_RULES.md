# Firebase Storage Security Rules - CreateGen Studio

## Overview

This document describes the comprehensive, production-ready Firebase Storage Security Rules for CreateGen Studio. The rules follow the **principle of least privilege** and implement a **default deny** security posture for all file operations.

## Security Architecture

### 🔒 Core Security Principles

1. **Default Deny**: All file access is denied unless explicitly allowed
2. **Authentication Required**: All operations require valid Firebase Auth
3. **User-Specific Folders**: Users can only access files in their own folders
4. **File Validation**: Size and type restrictions prevent abuse
5. **No Public Access**: No anonymous reads or writes allowed

## Rule Structure

### 1. Default Deny Foundation
```javascript
match /{allPaths=**} {
  allow read, write: if false;
}
```
- **Purpose**: Denies all access not explicitly allowed
- **Position**: Last rule in the ruleset
- **Security**: Prevents unauthorized access to any undocumented paths

### 2. User-Specific Folder Rules (`/users/{userId}/{allPaths=**}`)

#### Path Structure
```
/users/{userId}/{subfolder}/{filename}
```

**Examples**:
- `/users/user123/images/profile.jpg`
- `/users/user123/uploads/document.pdf`
- `/users/user123/generated/thumbnail.png`
- `/users/user123/exports/canvas-export.zip`

#### Access Rules

**Read Access**:
```javascript
allow read: if request.auth != null && request.auth.uid == userId;
```
- **Scope**: Users can read any file in their own folder
- **Security**: Complete isolation between users

**Write Access**:
```javascript
allow write: if request.auth != null 
             && request.auth.uid == userId
             && isValidFileOperation();
```
- **Operations**: Covers create, update, delete
- **Validation**: Includes file operation validation

**Create Access**:
```javascript
allow create: if request.auth != null 
              && request.auth.uid == userId
              && isValidFileUpload();
```
- **Validation**: File size and type checking
- **Security**: Prevents unauthorized uploads

**Update Access**:
```javascript
allow update: if request.auth != null 
              && request.auth.uid == userId
              && isValidFileUpdate();
```
- **Scope**: Can modify existing files they own
- **Validation**: Ensures valid file operations

**Delete Access**:
```javascript
allow delete: if request.auth != null 
              && request.auth.uid == userId
              && isValidFileDelete();
```
- **Scope**: Can delete their own files
- **Validation**: Confirms file exists and ownership

## File Validation

### Size Limits
```javascript
function isValidFileSize() {
  return request.resource.size <= 50 * 1024 * 1024; // 50MB
}
```
- **Limit**: 50MB per file
- **Purpose**: Prevents storage abuse and large uploads
- **Adjustable**: Can be modified based on needs

### File Type Validation
```javascript
function isValidFileType() {
  return request.resource.contentType.matches('image/.*') ||           // Images
         request.resource.contentType.matches('video/.*') ||           // Videos  
         request.resource.contentType.matches('audio/.*') ||           // Audio
         request.resource.contentType.matches('text/.*') ||            // Text files
         request.resource.contentType.matches('application/json') ||   // JSON
         request.resource.contentType.matches('application/pdf') ||    // PDF
         request.resource.contentType.matches('application/.*zip.*') || // Zip files
         request.resource.contentType.matches('application/.*office.*') || // Office docs
         request.resource.contentType.matches('application/vnd.openxmlformats.*'); // Modern Office
}
```

**Allowed File Types**:
- **Images**: JPG, PNG, GIF, WebP, SVG, etc.
- **Videos**: MP4, WebM, MOV, AVI, etc.
- **Audio**: MP3, WAV, AAC, etc.
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Data**: JSON, TXT, CSV
- **Archives**: ZIP, RAR, etc.

## Helper Functions

### Basic Validation
```javascript
function isValidFileOperation() {
  return request.auth != null 
         && request.auth.uid != null
         && request.auth.uid != '';
}
```

### Upload Validation
```javascript
function isValidFileUpload() {
  return request.auth != null
         && request.resource != null
         && isValidFileSize()
         && isValidFileType();
}
```

### Update Validation
```javascript
function isValidFileUpdate() {
  return request.auth != null
         && resource != null
         && request.resource != null
         && isValidFileSize()
         && isValidFileType();
}
```

### Delete Validation
```javascript
function isValidFileDelete() {
  return request.auth != null
         && resource != null;
}
```

## Use Cases for CreateGen Studio

### 1. User Generated Content
- **Profile images**: `/users/{userId}/profile/avatar.jpg`
- **Uploaded assets**: `/users/{userId}/uploads/source-image.png`
- **Generated thumbnails**: `/users/{userId}/generated/thumbnail-{id}.jpg`

### 2. Canvas Exports
- **Image exports**: `/users/{userId}/exports/canvas-{timestamp}.png`
- **PDF exports**: `/users/{userId}/exports/design-{id}.pdf`
- **Project files**: `/users/{userId}/projects/project-{id}.json`

### 3. History and Backups
- **Content history**: `/users/{userId}/history/content-{timestamp}.json`
- **Backup files**: `/users/{userId}/backups/data-{date}.zip`
- **Templates**: `/users/{userId}/templates/template-{id}.json`

### 4. YouTube Integration
- **Thumbnail uploads**: `/users/{userId}/youtube/thumbnails/thumb-{video-id}.jpg`
- **Analytics exports**: `/users/{userId}/youtube/analytics/report-{date}.pdf`

## Security Testing

### ✅ Allowed Operations

**User accessing their own files**:
```javascript
// ✅ Reading own file
firebase.storage().ref('/users/user123/images/photo.jpg').getDownloadURL()

// ✅ Uploading to own folder  
firebase.storage().ref('/users/user123/uploads/document.pdf').put(file)

// ✅ Deleting own file
firebase.storage().ref('/users/user123/generated/old-thumbnail.png').delete()
```

### ❌ Denied Operations

**User accessing others' files**:
```javascript
// ❌ Reading other user's file
firebase.storage().ref('/users/user456/images/photo.jpg').getDownloadURL()

// ❌ Uploading to other user's folder
firebase.storage().ref('/users/user456/uploads/malicious.exe').put(file)

// ❌ Anonymous access
firebase.storage().ref('/users/user123/images/photo.jpg').getDownloadURL() // No auth
```

**Invalid file operations**:
```javascript
// ❌ File too large (>50MB)
firebase.storage().ref('/users/user123/uploads/huge-file.zip').put(largeFile)

// ❌ Invalid file type
firebase.storage().ref('/users/user123/uploads/malicious.exe').put(exeFile)

// ❌ Access to root or other paths
firebase.storage().ref('/admin/config.json').getDownloadURL()
```

## Integration with Frontend

### File Upload Service
```typescript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from './firebase';

export class FileUploadService {
  private storage = getStorage();

  async uploadUserFile(file: File, path: string): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Automatically scope to user's folder
    const fileRef = ref(this.storage, `users/${user.uid}/${path}`);
    
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  async deleteUserFile(path: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const fileRef = ref(this.storage, `users/${user.uid}/${path}`);
    await deleteObject(fileRef);
  }
}
```

### Canvas Export Integration
```typescript
// Example: Exporting canvas to user's storage
export const exportCanvasToStorage = async (canvasData: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const blob = new Blob([JSON.stringify(canvasData)], { type: 'application/json' });
  const fileRef = ref(storage, `users/${user.uid}/exports/canvas-${Date.now()}.json`);
  
  await uploadBytes(fileRef, blob);
  return await getDownloadURL(fileRef);
};
```

## Deployment and Testing

### 1. Deploy Storage Rules
```bash
firebase deploy --only storage
```

### 2. Test Rules with Emulator
```bash
firebase emulators:start --only storage
```

### 3. Validate Rules
```bash
# Test file in Firebase Console > Storage > Rules playground
```

## Performance Considerations

### Optimized Operations
- **Direct path access**: No wildcard queries needed
- **User-scoped paths**: Natural data isolation
- **Efficient validation**: Minimal function calls

### Best Practices
- Use specific paths rather than listing directories
- Implement client-side validation before upload
- Cache download URLs when possible
- Use appropriate file naming conventions

## Future Enhancements

### Advanced Features (Ready to Uncomment)

**Public Assets**:
```javascript
match /public/{allPaths=**} {
  allow read: if true;
  allow write: if false;
}
```

**Shared Resources**:
```javascript
match /shared/{resourceId}/{allPaths=**} {
  allow read: if request.auth != null 
              && isAuthorizedForSharedResource(resourceId);
  allow write: if request.auth != null 
               && isOwnerOfSharedResource(resourceId);
}
```

**Advanced Validation**:
- File name pattern validation
- Upload quota checking
- Rate limiting integration
- Virus scanning integration

### Potential Improvements
1. **Firestore Integration**: Check user quotas before upload
2. **Advanced Rate Limiting**: Prevent abuse
3. **File Processing**: Automatic image optimization
4. **Backup Integration**: Automatic file backup
5. **CDN Integration**: Optimized file delivery
6. **Team Collaboration**: Shared workspace folders

## Monitoring and Maintenance

### Security Monitoring
- Monitor denied requests in Firebase Console
- Track unusual upload patterns
- Review file size trends
- Alert on security rule violations

### Performance Monitoring
- Upload success rates
- Download latency
- Storage usage per user
- File type distribution

### Regular Audits
- Review and update file type restrictions
- Adjust size limits based on usage
- Update security rules for new features
- Test rules with new use cases

These storage rules provide a secure, scalable foundation for file management in CreateGen Studio while maintaining the flexibility needed for content creation workflows.
