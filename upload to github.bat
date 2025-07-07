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

REM Check if .env file exists in the current directory
IF EXIST .env (
    echo .env file detected. Moving to Documents folder for safety.
    move .env "%USERPROFILE%\Documents\.env"
    IF ERRORLEVEL 1 (
        echo Failed to move .env file. Please move it manually before proceeding.
        pause
        exit /b
    ) ELSE (
        echo .env file successfully moved to %USERPROFILE%\Documents\.env
    )
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
    git remote add origin https://github.com/scratchgamingone/Discord-bot.git
) ELSE (
    echo Remote origin already exists
)

REM Pull from GitHub
echo Pulling from GitHub
git pull origin master

REM Push to GitHub
echo Pushing to GitHub
git push -u origin master

echo Upload complete!

REM Check if .env file was moved and ask if user wants to restore it
IF EXIST "%USERPROFILE%\Documents\.env" (
    SET /P RESTORE="Do you want to restore the .env file? (Y/N): "
    IF /I "%RESTORE%" EQU "Y" (
        move "%USERPROFILE%\Documents\.env" .env
        IF ERRORLEVEL 1 (
            echo Failed to restore .env file. Please move it back manually from %USERPROFILE%\Documents\.env
        ) ELSE (
            echo .env file restored successfully.
        )
    ) ELSE (
        echo .env file remains in %USERPROFILE%\Documents\.env
    )
)

pause