# Quick Fix for the TurboModuleRegistry Error

Follow these steps to fix the error:

## Step 1: Stop the current Expo server
Press Ctrl+C in your terminal to stop the running server

## Step 2: Pull the latest changes
```bash
git pull
```

## Step 3: Delete node_modules and reinstall
```bash
rm -rf node_modules
npm install
```

## Step 4: Clear Expo cache and restart
```bash
npm start --clear
```

## Step 5: Reload the app in Expo Go
- Scan the QR code again with your phone
- Or press 'r' in the terminal to reload

## What was fixed:
- Downgraded from Expo SDK 52 to 51 (more stable)
- Added missing core modules: expo-constants, expo-linking, expo-modules-core
- Updated all package versions to match Expo 51 compatibility

The app should now load without the TurboModuleRegistry error!
