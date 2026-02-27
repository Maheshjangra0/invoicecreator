@echo off
echo ========================================
echo Invoice Platform - Starting in Chrome
echo ========================================
echo.

REM Set Chrome as default browser for npm start
set BROWSER=chrome

REM Navigate to project directory
cd /d "%~dp0"

echo Starting development server...
echo Opening in Google Chrome...
echo.

REM Start the development server
call npm start

pause
