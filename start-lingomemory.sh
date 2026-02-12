#!/bin/bash

# LingoMemory Launcher for Linux/Mac
# Make executable with: chmod +x start-lingomemory.sh
# Then run with: ./start-lingomemory.sh

echo "========================================"
echo "  Starting LingoMemory..."
echo "========================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install..."
    echo "This may take a few minutes..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: npm install failed!"
        exit 1
    fi
fi

echo "Starting development server..."
echo ""

# Start npm dev in background
npm run dev &
DEV_SERVER_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping development server..."
    kill $DEV_SERVER_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Try to open Chrome (check multiple possible locations)
echo "Opening Chrome browser..."
echo ""

if command -v google-chrome &> /dev/null; then
    google-chrome "http://localhost:3000" &>/dev/null &
elif command -v google-chrome-stable &> /dev/null; then
    google-chrome-stable "http://localhost:3000" &>/dev/null &
elif command -v chromium &> /dev/null; then
    chromium "http://localhost:3000" &>/dev/null &
elif command -v chromium-browser &> /dev/null; then
    chromium-browser "http://localhost:3000" &>/dev/null &
elif command -v xdg-open &> /dev/null; then
    # Fallback to default browser
    echo "Chrome not found. Opening in default browser..."
    xdg-open "http://localhost:3000" &>/dev/null &
else
    echo "Could not auto-open browser. Please visit: http://localhost:3000"
fi

echo "========================================"
echo "  LingoMemory is running!"
echo "  URL: http://localhost:3000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server and exit"
echo ""

# Wait for the background process
wait $DEV_SERVER_PID
