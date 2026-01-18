#!/bin/bash
cd /home/user/shusho

# Create a simple 1x1 blue PNG and then resize it
# This is a base64 encoded 1x1 blue pixel PNG
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > assets/temp.png

# For now, just copy the temp file to all needed assets
cp assets/temp.png assets/icon.png
cp assets/temp.png assets/splash.png
cp assets/temp.png assets/adaptive-icon.png
cp assets/temp.png assets/favicon.png

rm assets/temp.png

echo "Basic placeholder assets created"
