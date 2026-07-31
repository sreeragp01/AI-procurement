@echo off
echo ============================================================
echo Starting AI Procurement Copilot (Backend + Frontend)
echo ============================================================

echo Starting Django REST Backend on http://127.0.0.1:8000 ...
start "AI Procurement - Backend" cmd /k "cd /d %~dp0backend && .\.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000"

echo Starting React + Vite Frontend on http://localhost:3000 ...
start "AI Procurement - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo Backend: http://127.0.0.1:8000/api/v1/
echo Frontend: http://localhost:3000/
echo ============================================================
