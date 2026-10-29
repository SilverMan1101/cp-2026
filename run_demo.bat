@echo off
title EmotionSense Platform Launcher
echo ==================================================================
echo  EmotionSense Platform - Launching Microservices
echo ==================================================================

echo [1/2] Starting Python ML Service on Port 8000...
start "EmotionSense ML Service" cmd /k "cd /d %~dp0ml-service && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React Frontend on Port 5173...
start "EmotionSense Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==================================================================
echo  Services started!
echo   Frontend Dashboard:  http://localhost:5173
echo   ML API Swagger Docs: http://localhost:8000/docs
echo ==================================================================
echo.
