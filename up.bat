@echo off
echo Updating repository...



:: Initialize Git repository (if not already initialized)
git init

:: Add all changes to the staging area
git add .

:: Commit changes with a generic message
git commit -m "Auto-update: Updated files and added new changes"

:: Rename branch to main (if not already done)
git branch -M main

:: Add remote origin (if not already added)
git remote add origin https://github.com/i3z1/happybirthday.git 2>nul

:: Pull changes from remote to avoid conflicts
git pull origin main --rebase

:: Push changes to remote repository
git push -u origin main

echo Repository updated successfully!
pause