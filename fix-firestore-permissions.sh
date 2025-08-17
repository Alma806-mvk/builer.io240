#!/bin/bash

echo "🔧 Fixing Firestore Permissions..."
echo "================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase (if not already logged in)
echo "🔐 Checking Firebase authentication..."
firebase login:ci --no-localhost || firebase login

# Deploy only the Firestore rules
echo "📋 Deploying updated Firestore rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Firestore rules deployed successfully!"
    echo ""
    echo "🎉 The following permissions have been fixed:"
    echo "   • user_credits collection - read/write access for authenticated users"
    echo "   • credit_transactions collection - read/write access with proper userId validation"
    echo "   • Added create, update permissions for better error handling"
    echo ""
    echo "🔄 Please refresh your app to see the changes take effect."
    echo ""
else
    echo ""
    echo "❌ Failed to deploy Firestore rules."
    echo ""
    echo "🛠️  Manual steps to fix:"
    echo "   1. Run: firebase login"
    echo "   2. Run: firebase use --add (select your project)"
    echo "   3. Run: firebase deploy --only firestore:rules"
    echo ""
    echo "📋 Or update rules manually in Firebase Console:"
    echo "   → Go to Firebase Console → Firestore Database → Rules"
    echo "   → Copy the rules from firestore.rules file"
fi

echo ""
echo "📖 For more help, see: https://firebase.google.com/docs/firestore/security/get-started"
