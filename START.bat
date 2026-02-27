@echo off
echo ========================================
echo Invoice & Billing Platform - Quick Start
echo ========================================
echo.
echo This script will:
echo 1. Install all dependencies
echo 2. Start the development server
echo.
echo Please wait...
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo Installing dependencies...
call npm install

echo.
echo ========================================
echo Installation complete!
echo Starting the application...
echo ========================================
echo.

call npm start

pause
