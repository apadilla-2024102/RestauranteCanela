# Verificar Docker Compose Deployment - RestauranteCanela
# Script para Windows PowerShell

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "RestauranteCanela - Verification" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "[1/8] Checking Docker..." -ForegroundColor Yellow
try {
    $docker = docker --version
    Write-Host "✓ Docker: $docker" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker not found" -ForegroundColor Red
    exit 1
}

# Verificar Docker Compose
Write-Host "[2/8] Checking Docker Compose..." -ForegroundColor Yellow
try {
    $compose = docker compose version
    Write-Host "✓ Docker Compose: $compose" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Compose not found" -ForegroundColor Red
    exit 1
}

# Verificar contenedores corriendo
Write-Host "[3/8] Checking running containers..." -ForegroundColor Yellow
$containers = docker ps --format "table {{.Names}}\t{{.Status}}" | Select-String "restaurante"
if ($containers) {
    Write-Host "✓ Containers running:" -ForegroundColor Green
    $containers | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "✗ No restaurante containers found" -ForegroundColor Red
}

# Health Check - PostgreSQL
Write-Host "[4/8] Health Check - PostgreSQL..." -ForegroundColor Yellow
try {
    $result = docker exec restaurante_postgres pg_isready -U restaurante 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL: OK" -ForegroundColor Green
    } else {
        Write-Host "⚠ PostgreSQL: Warning" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ PostgreSQL: Connection failed" -ForegroundColor Red
}

# Health Check - MongoDB
Write-Host "[5/8] Health Check - MongoDB..." -ForegroundColor Yellow
try {
    $result = docker exec restaurante_mongodb mongosh --eval "db.adminCommand('ping')" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MongoDB: OK" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB: Warning" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ MongoDB: Connection failed" -ForegroundColor Red
}

# Health Check - Auth Service
Write-Host "[6/8] Health Check - Auth Service..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5156/health" -UseBasicParsing -TimeoutSec 5 2>$null
    if ($health.StatusCode -eq 200) {
        Write-Host "✓ Auth Service: OK (5156)" -ForegroundColor Green
    } else {
        Write-Host "⚠ Auth Service: Status $($health.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Auth Service: Not responding" -ForegroundColor Red
}

# Health Check - Order Service
Write-Host "[7/8] Health Check - Order Service..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/health" -UseBasicParsing -TimeoutSec 5 2>$null
    if ($health.StatusCode -eq 200) {
        Write-Host "✓ Order Service: OK (3001)" -ForegroundColor Green
    } else {
        Write-Host "⚠ Order Service: Status $($health.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Order Service: Not responding" -ForegroundColor Red
}

# Summary
Write-Host "[8/8] Summary..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Services URLs:" -ForegroundColor Cyan
Write-Host "  Auth Service:       http://localhost:5156" -ForegroundColor White
Write-Host "  Order Service:      http://localhost:3001" -ForegroundColor White
Write-Host "  Menu Service:       http://localhost:3002" -ForegroundColor White
Write-Host "  Payment Service:    http://localhost:3003" -ForegroundColor White
Write-Host "  Reservation:        http://localhost:3004" -ForegroundColor White
Write-Host "  Restaurant Service: http://localhost:3005" -ForegroundColor White
Write-Host "  Report Service:     http://localhost:3006" -ForegroundColor White
Write-Host ""
Write-Host "Databases:" -ForegroundColor Cyan
Write-Host "  PostgreSQL:  localhost:5432" -ForegroundColor White
Write-Host "  MongoDB:     localhost:27017" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
