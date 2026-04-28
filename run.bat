@echo off
echo =========================================
echo       Starting StreamShield AI...
echo =========================================
echo.

:: Check if .env file exists
if not exist "backend\.env" (
    echo [WARNING] backend\.env file not found! 
    echo Please copy backend\.env.example to backend\.env and fill in your API keys before running.
    echo.
)

:: Start Backend in a new window
echo Starting FastAPI Backend (Port 8000)...
start "StreamShield Backend" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Start Frontend in a new window
echo Starting React Frontend (Vite)...
cd frontend
start "StreamShield Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows.
echo - Backend API will be available at: http://127.0.0.1:8000
echo - Frontend Dashboard will open in your browser shortly (usually http://localhost:5173).
echo.
pause
