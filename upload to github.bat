@echo off
SETLOCAL

REM Change to the project directory
cd /d "%~dp0"

REM Check if .gitignore exists, if not create it
IF NOT EXIST .gitignore (
    echo Creating .gitignore file
    echo .env > .gitignore
)

REM Initialize Git repository if not already initialized
IF NOT EXIST .git (
    echo Initializing Git repository
    git init
)

REM Remove .env file if it exists
IF EXIST .env (
    echo Removing .env file
    del .env
)

REM Show status and ask for confirmation
git status
SET /P CONFIRM="Do you want to proceed with these changes? (Y/N): "
IF /I "%CONFIRM%" NEQ "Y" (
    echo Upload cancelled.
    pause
    exit /b
)

REM Add all files to staging
echo Adding files to staging
git add .

REM Commit changes
echo Committing changes
SET /P COMMIT_MSG="Enter commit message: "
git commit -m "%COMMIT_MSG%"

REM Check if remote origin exists
git remote -v | findstr /C:"origin" > nul
IF %ERRORLEVEL% NEQ 0 (
    echo Adding remote origin
    git remote add origin https://github.com/scratchgamingone/Custom-bot.git
) ELSE (
    echo Remote origin already exists
)

REM Push to GitHub
echo Pushing to GitHub
git push -u origin master

echo Upload complete!
pause