@echo off
REM Ye script Windows ke liye Nix aur Node/npm environment ke errors fix karegi

echo Step 1: NPM cache clean kar rahe hain...
npm cache clean --force

echo Step 2: Node modules delete kar rahe hain...
if exist node_modules rmdir /s /q node_modules

echo Step 3: Package-lock.json delete kar rahe hain...
if exist package-lock.json del package-lock.json

echo Step 4: Node modules clean install kar rahe hain...
npm install

echo Done! Ab aapka build aur environment properly setup ho gaya hai.
pause
