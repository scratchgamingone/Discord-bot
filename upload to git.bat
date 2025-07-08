@echo off
echo Uploading Discord Bot to GitHub...

:: Initialize Git repository (if not already initialized)
git init

:: Add all files to the repository
git add .

:: Commit changes
set /p commit_message=Enter commit message: 
git commit -m "%commit_message%"

:: Set the remote repository URL
git remote add origin https://github.com/scratchgamingone/Discord-bot.git

:: Push to GitHub
git push -u origin master

echo Upload complete!
pause