# ==============================================================================
# EmotionSense - Quick Start Runner (PowerShell)
# Launches Python ML Microservice & React Frontend Dashboard
# ==============================================================================

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " EmotionSense Platform - Launching Microservices" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. Start Python FastAPI ML Microservice on Port 8000
Write-Host "[1/2] Starting Python ML & NLP Analytics Engine (Port 8000)..." -ForegroundColor Yellow
$mlJob = Start-Process python -ArgumentList "-m uvicorn main:app --host 0.0.0.0 --port 8000" -WorkingDirectory "$PSScriptRoot\ml-service" -PassThru

Start-Sleep -Seconds 2

# 2. Start React TypeScript Frontend Dashboard on Port 5173
Write-Host "[2/2] Starting React TypeScript Dashboard (Port 5173)..." -ForegroundColor Yellow
$frontendJob = Start-Process npm -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Green
Write-Host " EmotionSense is now running!" -ForegroundColor Green
Write-Host " - Frontend Dashboard:  http://localhost:5173" -ForegroundColor Green
Write-Host " - ML API Swagger Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host " - ML Health Probe:     http://localhost:8000/health" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Press Ctrl+C in this console or close the spawned windows to stop."
