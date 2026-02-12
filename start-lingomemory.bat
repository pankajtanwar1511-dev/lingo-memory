@echo off
REM LingoMemory Launcher for Windows
REM Double-click this file to start the app and open in Chrome

echo ========================================
echo   Starting LingoMemory...
echo ========================================
echo.

REM Navigate to the script's directory
cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo node_modules not found. Running npm install...
    echo This may take a few minutes...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

echo Starting development server...
echo.

REM Start npm dev in a new window
start "LingoMemory Server" cmd /c "npm run dev"

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Try to open Chrome (multiple possible locations)
echo Opening Chrome browser...
echo.

REM Try Chrome in Program Files
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:3000"
    goto :success
)

REM Try Chrome in Program Files (x86)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://localhost:3000"
    goto :success
)

REM Try using default browser as fallback
echo Chrome not found in default location. Opening in default browser...
start "" "http://localhost:3000"

:success
echo.
echo ========================================
echo   LingoMemory is running!
echo   URL: http://localhost:3000
echo ========================================
echo.
echo The server window will stay open.
echo Close it when you're done using the app.
echo.
echo Press any key to close this launcher window...
pause >nul
