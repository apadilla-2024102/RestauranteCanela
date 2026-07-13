# Script para iniciar Docker Desktop en Windows
Write-Host "Iniciando Docker Desktop..." -ForegroundColor Yellow

$dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

if (Test-Path $dockerPath) {
    Start-Process -FilePath $dockerPath
    Write-Host "Docker Desktop iniciado. Esperando 30 segundos..." -ForegroundColor Green
    Start-Sleep -Seconds 30
    docker ps
} else {
    Write-Host "Docker Desktop no encontrado" -ForegroundColor Red
}
