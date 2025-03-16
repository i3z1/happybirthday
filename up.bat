@echo off
echo Updating repository...


:: Initialize repository (if needed)
git init

:: Create/switch to main branch
git checkout -b main 2>nul || git checkout main

:: Add all changes
git add .

:: Commit changes (with timestamp)
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set DATE=%%c-%%b-%%a
for /f "tokens=1-3 delims=:." %%a in ('time /t') do set TIME=%%a-%%b-%%c
git commit -m "Auto-update: %DATE% %TIME%"

:: Link to remote repository
git remote add origin https://github.com/i3z1/happybirthday.git 2>nul

:: Forcefully pull and rebase to overwrite local conflicts
git pull origin main --rebase --allow-unrelated-histories

:: Force push to overwrite remote (use with caution!)
git push -u origin main --force

echo Repository updated successfully!
pause