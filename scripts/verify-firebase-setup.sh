#!/bin/bash

# Firebase Integration Verification Script
# Checks if Firebase is properly configured for the Okoa SEM project

echo "🔍 Okoa SEM Firebase Integration Verification"
echo "=============================================="
echo ""

# Check Node environment
echo "✓ Checking Node.js environment..."
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "  Node: $NODE_VERSION"
echo "  NPM: $NPM_VERSION"
echo ""

# Check Firebase dependency
echo "✓ Checking Firebase dependency..."
if grep -q '"firebase"' package.json; then
    FIREBASE_VERSION=$(grep '"firebase"' package.json | head -1)
    echo "  Firebase: $FIREBASE_VERSION"
else
    echo "  ❌ Firebase not found in package.json"
    exit 1
fi
echo ""

# Check environment file
echo "✓ Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "  ✓ .env.local exists"
    
    # Check required Firebase variables
    REQUIRED_VARS=(
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
        "NEXT_PUBLIC_FIREBASE_APP_ID"
    )
    
    MISSING_VARS=()
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "$var" .env.local; then
            echo "  ✓ $var"
        else
            echo "  ❌ $var (missing)"
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo ""
        echo "⚠️  Missing Firebase environment variables!"
        echo "Please check .env.local and ensure all required variables are set."
        exit 1
    fi
else
    echo "  ❌ .env.local not found"
    echo "  Copy from .env.local.example: cp .env.local.example .env.local"
    exit 1
fi
echo ""

# Check Firebase configuration file
echo "✓ Checking Firebase configuration files..."
if [ -f "src/config/firebase.ts" ]; then
    echo "  ✓ Firebase config module exists"
else
    echo "  ❌ Firebase config not found"
    exit 1
fi
echo ""

# Check authentication service
echo "✓ Checking authentication service..."
if [ -f "src/features/auth/services/firebaseAuthService.ts" ]; then
    echo "  ✓ Firebase auth service exists"
else
    echo "  ❌ Firebase auth service not found"
    exit 1
fi
echo ""

# Check providers
echo "✓ Checking Firebase provider..."
if [ -f "src/app/providers/firebase-provider/FirebaseProvider.tsx" ]; then
    echo "  ✓ Firebase provider exists"
else
    echo "  ❌ Firebase provider not found"
    exit 1
fi
echo ""

# Check monitoring utilities
echo "✓ Checking performance monitoring..."
if [ -f "src/core/monitoring/performanceMonitoring.ts" ]; then
    echo "  ✓ Performance monitoring module exists"
else
    echo "  ❌ Performance monitoring not found"
    exit 1
fi
echo ""

# Check caching strategy
echo "✓ Checking caching strategy..."
if [ -f "src/core/cache/cacheStrategy.ts" ]; then
    echo "  ✓ Caching strategy module exists"
else
    echo "  ❌ Caching strategy not found"
    exit 1
fi
echo ""

# Check documentation
echo "✓ Checking documentation..."
if [ -f "FIREBASE_INTEGRATION.md" ]; then
    echo "  ✓ Firebase integration guide exists"
else
    echo "  ❌ Firebase integration guide not found"
fi
echo ""

echo "=============================================="
echo "✅ Firebase integration verification complete!"
echo ""
echo "Next steps:"
echo "1. Verify all environment variables in .env.local"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo "4. Check browser console for any warnings"
echo ""
echo "For more details, see: FIREBASE_INTEGRATION.md"
