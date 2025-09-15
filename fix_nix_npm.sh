#!/bin/bash
# Ye script aapke Nix aur Node/npm environment ke errors fix karegi

echo "Step 1: Purane Nix builds aur unused store paths delete kar rahe hain..."
sudo nix-collect-garbage -d

echo "Step 2: System packages update kar rahe hain..."
sudo apt-get update

echo "Step 3: Required tools install kar rahe hain (curl, wget, apt-utils)..."
sudo apt-get install -y curl wget apt-utils

echo "Step 4: NPM cache clean kar rahe hain..."
npm cache clean --force

echo "Step 5: Node modules clean install kar rahe hain..."
npm ci

echo "Done! Ab aapka build aur environment properly setup ho gaya hai."
