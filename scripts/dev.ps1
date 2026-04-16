$root = Split-Path -Parent $PSScriptRoot

Write-Host "Starting backend on http://localhost:8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\\backend'; npm run start"

Write-Host "Starting frontend on http://localhost:5173"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\\frontend'; npm run dev"
