@echo off
echo Updating Discord Bot on GitHub...

:: Add all new and changed files to the repository
git add .

:: Commit changes
set /p commit_message=Enter commit message: 
git commit -m "%commit_message%"

:: Ensure we're on the main branch
git checkout main

:: Update the remote URL to the correct repository
git remote set-url origin https://github.com/scratchgamingone/Discord-bot.git

:: Pull any changes from the remote repository
git pull origin main

:: Push to GitHub
git push -u origin main

echo Update complete!
pause