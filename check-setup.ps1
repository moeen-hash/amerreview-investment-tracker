# Quick Start Check Script

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "AmerReview Setup Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    $allGood = $false
}

# Check if server dependencies are installed
Write-Host "`nChecking server dependencies..." -ForegroundColor Yellow
if (Test-Path ".\server\node_modules") {
    Write-Host "✅ Server dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Server dependencies not installed. Run: cd server && npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check if frontend dependencies are installed
Write-Host "`nChecking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path ".\node_modules") {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend dependencies not installed. Run: npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check .env files
Write-Host "`nChecking environment files..." -ForegroundColor Yellow
if (Test-Path ".\.env") {
    Write-Host "✅ Frontend .env exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend .env not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".\.env.example" ".\.env" -ErrorAction SilentlyContinue
}

if (Test-Path ".\server\.env") {
    Write-Host "✅ Backend .env exists" -ForegroundColor Green
    $envContent = Get-Content ".\server\.env" -Raw
    if ($envContent -match "mongodb://localhost:27017") {
        Write-Host "⚠️  Using local MongoDB. Make sure MongoDB is installed and running!" -ForegroundColor Yellow
        Write-Host "   See MONGODB_SETUP.md for instructions" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Backend .env not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".\server\.env.example" ".\server\.env" -ErrorAction SilentlyContinue
    Write-Host "   ⚠️  Please configure MongoDB connection in server/.env" -ForegroundColor Yellow
    Write-Host "   See MONGODB_SETUP.md for instructions" -ForegroundColor Yellow
    $allGood = $false
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ All checks passed!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure MongoDB is running (see MONGODB_SETUP.md)" -ForegroundColor White
    Write-Host "2. Start backend:  cd server && npm run dev" -ForegroundColor White
    Write-Host "3. Start frontend: npm run dev (in new terminal)" -ForegroundColor White
} else {
    Write-Host "⚠️  Some issues found. Please fix them and try again." -ForegroundColor Yellow
}
Write-Host "========================================`n" -ForegroundColor Cyan
