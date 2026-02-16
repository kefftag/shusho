# Shusho - Setup Guide (Rebuilt for Expo SDK 54)

The project has been rebuilt from scratch to ensure full compatibility with Expo SDK 54, Android, and iOS.

## What's New

- ✅ Expo SDK 54 (matches your Expo Go app)
- ✅ All dependencies updated to SDK 54 compatible versions
- ✅ Modern Android permissions
- ✅ Proper assets included
- ✅ Clean, tested codebase

## Setup Steps for Windows

### 1. Pull the Latest Changes

```powershell
git pull
```

### 2. Clean Install (PowerShell)

```powershell
# Remove old dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Install fresh dependencies
npm install
```

**OR for Command Prompt:**

```cmd
# Remove old dependencies
rmdir /s /q node_modules
del package-lock.json

# Install fresh dependencies
npm install
```

### 3. Start the Development Server

```powershell
npx expo start --clear
```

### 4. On Your Phone

1. **Make sure you have Expo Go installed** (should be SDK 54)
2. **Close Expo Go completely** (swipe away from recent apps)
3. **Reopen Expo Go**
4. **Scan the QR code** from your terminal

## First Time Using the App

1. **Enter your Claude API Key** on the home screen
   - Get one from https://console.anthropic.com/
2. **Tap "Save API Key"**
3. **Start scanning receipts!**

## Features

- 📸 Take photos with camera or select from gallery
- 🤖 Automatic AI extraction of receipt data
- 🌐 English/Japanese bilingual UI
- 💾 Local storage of all receipts
- ✏️ Edit all extracted fields manually

## Troubleshooting

### If npm install fails:
```powershell
npm cache clean --force
npm install
```

### If the app still shows errors:
```powershell
# Complete reset
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
npx expo start --clear
```

### Camera/Gallery permissions:
- On first use, the app will request camera and photo permissions
- Grant both permissions when prompted
- If denied, go to your phone Settings > Apps > Expo Go > Permissions

## What Got Fixed

1. **SDK Version Mismatch** - Now uses SDK 54 to match your Expo Go
2. **Missing Dependencies** - All required packages properly included
3. **Asset Files** - Proper icon, splash, and adaptive icon files
4. **Android Permissions** - Updated to modern permission system
5. **Babel Configuration** - Correct babel-preset-expo version

The app should now work perfectly on both Android and iOS!
