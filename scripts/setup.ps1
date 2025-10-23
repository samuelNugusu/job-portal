# JobHub React App Setup Script for Windows PowerShell
# This script sets up the development environment for the JobHub job search application

param(
    [string]$PackageManager = "npm"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Setting up JobHub React Application..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Function to print colored output
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Check if Node.js is installed
function Test-Node {
    try {
        $nodeVersion = node --version
        Write-Success "Node.js is installed: $nodeVersion"
        
        # Check if Node version is 18 or higher
        $majorVersion = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
        if ($majorVersion -lt 18) {
            Write-Error "Node.js version 18 or higher is required. Current version: $nodeVersion"
            Write-Info "Please update Node.js: https://nodejs.org/"
            exit 1
        }
    }
    catch {
        Write-Error "Node.js is not installed"
        Write-Info "Please install Node.js 18+ from: https://nodejs.org/"
        exit 1
    }
}

# Check if npm is installed
function Test-Npm {
    try {
        $npmVersion = npm --version
        Write-Success "npm is installed: v$npmVersion"
    }
    catch {
        Write-Error "npm is not installed"
        exit 1
    }
}

# Check if yarn is available
function Test-Yarn {
    try {
        $yarnVersion = yarn --version
        Write-Success "Yarn is available: v$yarnVersion"
        return $true
    }
    catch {
        Write-Warning "Yarn is not installed (optional)"
        return $false
    }
}

# Check if pnpm is available
function Test-Pnpm {
    try {
        $pnpmVersion = pnpm --version
        Write-Success "pnpm is available: v$pnpmVersion"
        return $true
    }
    catch {
        Write-Warning "pnpm is not installed (optional)"
        return $false
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Info "Installing dependencies..."
    
    # Ask user for package manager preference if not specified
    if ($PackageManager -eq "npm") {
        Write-Host ""
        Write-Host "Choose your package manager:"
        Write-Host "1) npm (default)"
        Write-Host "2) yarn"
        Write-Host "3) pnpm"
        Write-Host ""
        $choice = Read-Host "Enter your choice (1-3) [1]"
        if ([string]::IsNullOrEmpty($choice)) { $choice = "1" }
        
        switch ($choice) {
            "1" { $PackageManager = "npm" }
            "2" { $PackageManager = "yarn" }
            "3" { $PackageManager = "pnpm" }
            default { $PackageManager = "npm" }
        }
    }
    
    switch ($PackageManager) {
        "npm" {
            Write-Info "Using npm..."
            npm install
        }
        "yarn" {
            if (Test-Yarn) {
                Write-Info "Using yarn..."
                yarn install
            }
            else {
                Write-Error "Yarn is not installed. Installing with npm..."
                npm install
            }
        }
        "pnpm" {
            if (Test-Pnpm) {
                Write-Info "Using pnpm..."
                pnpm install
            }
            else {
                Write-Error "pnpm is not installed. Installing with npm..."
                npm install
            }
        }
    }
    
    Write-Success "Dependencies installed successfully!"
}

# Setup environment files
function Set-Environment {
    Write-Info "Setting up environment files..."
    
    if (-not (Test-Path ".env.local")) {
        $envContent = @"
# JobHub Environment Variables
VITE_APP_NAME=JobHub
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:3001/api
VITE_ENABLE_ANALYTICS=false

# Development settings
VITE_DEV_MODE=true
VITE_SHOW_DEBUG=true
"@
        $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Success "Created .env.local file"
    }
    else {
        Write-Warning ".env.local already exists"
    }
    
    if (-not (Test-Path ".env.example")) {
        $envExampleContent = @"
# JobHub Environment Variables Example
VITE_APP_NAME=JobHub
VITE_APP_VERSION=1.0.0
VITE_API_URL=your_api_url_here
VITE_ENABLE_ANALYTICS=false

# Development settings
VITE_DEV_MODE=true
VITE_SHOW_DEBUG=true
"@
        $envExampleContent | Out-File -FilePath ".env.example" -Encoding UTF8
        Write-Success "Created .env.example file"
    }
}

# Create additional directories
function New-Directories {
    Write-Info "Creating additional directories..."
    
    $directories = @(
        "public/images",
        "public/icons", 
        "src/assets",
        "src/utils",
        "src/constants",
        "src/services",
        "src/hooks",
        "src/contexts",
        "docs"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-Success "Directories created"
}

# Main setup function
function Start-Setup {
    Write-Host ""
    Write-Info "Starting JobHub setup process..."
    Write-Host ""
    
    # Check prerequisites
    Test-Node
    Test-Npm
    Test-Yarn | Out-Null
    Test-Pnpm | Out-Null
    
    Write-Host ""
    
    # Install dependencies
    Install-Dependencies
    
    Write-Host ""
    
    # Setup environment
    Set-Environment
    
    # Create directories
    New-Directories
    
    Write-Host ""
    Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
    Write-Host "===============================" -ForegroundColor Green
    Write-Host ""
    Write-Success "Next steps:"
    Write-Host "  1. Start development server: npm run dev"
    Write-Host "  2. Open browser: http://localhost:3000"
    Write-Host "  3. Start coding! 🚀"
    Write-Host ""
    Write-Info "Available scripts:"
    Write-Host "  npm run dev     - Start development server"
    Write-Host "  npm run build   - Build for production"
    Write-Host "  npm run preview - Preview production build"
    Write-Host "  npm run lint    - Run ESLint"
    Write-Host ""
}

# Run main function
Start-Setup
