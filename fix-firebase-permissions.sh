#!/bin/bash

echo "🔧 Fixing Firebase permissions for credits..."

# Check if firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it with: npm install -g firebase-tools"
    exit 1
fi

# Deploy Firestore rules
echo "📋 Deploying updated Firestore rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Firestore rules deployed successfully!"
    echo "🎉 Credit permissions should now be fixed."
else
    echo "❌ Failed to deploy Firestore rules."
    echo "💡 Try running 'firebase login' first, then retry this script."
    exit 1
fi

echo "🔄 Refresh your app to see the changes."
