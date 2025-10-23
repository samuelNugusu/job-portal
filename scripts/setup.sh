#!/bin/bash

# JobHub React App Setup Script
# This script sets up the development environment for the JobHub job search application

set -e  # Exit on any error

echo "🚀 Setting up JobHub React Application..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if Node version is 18 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
            print_info "Please update Node.js: https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Node.js is not installed"
        print_info "Please install Node.js 18+ from: https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: v$NPM_VERSION"
    else
        print_error "npm is not installed"
        exit 1
    fi
}

# Check if yarn is available (optional)
check_yarn() {
    if command -v yarn &> /dev/null; then
        YARN_VERSION=$(yarn --version)
        print_status "Yarn is available: v$YARN_VERSION"
        return 0
    else
        print_warning "Yarn is not installed (optional)"
        return 1
    fi
}

# Check if pnpm is available (optional)
check_pnpm() {
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        print_status "pnpm is available: v$PNPM_VERSION"
        return 0
    else
        print_warning "pnpm is not installed (optional)"
        return 1
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Ask user for package manager preference
    echo ""
    echo "Choose your package manager:"
    echo "1) npm (default)"
    echo "2) yarn"
    echo "3) pnpm"
    echo ""
    read -p "Enter your choice (1-3) [1]: " choice
    choice=${choice:-1}
    
    case $choice in
        1)
            print_info "Using npm..."
            npm install
            ;;
        2)
            if check_yarn; then
                print_info "Using yarn..."
                yarn install
            else
                print_error "Yarn is not installed. Installing with npm..."
                npm install
            fi
            ;;
        3)
            if check_pnpm; then
                print_info "Using pnpm..."
                pnpm install
            else
                print_error "pnpm is not installed. Installing with npm..."
                npm install
            fi
            ;;
        *)
            print_info "Invalid choice. Using npm..."
            npm install
            ;;
    esac
    
    print_status "Dependencies installed successfully!"
}

# Setup environment files
setup_environment() {
    print_info "Setting up environment files..."
    
    if [ ! -f ".env.local" ]; then
        cat > .env.local << EOF
# JobHub Environment Variables
VITE_APP_NAME=JobHub
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:3001/api
VITE_ENABLE_ANALYTICS=false

# Development settings
VITE_DEV_MODE=true
VITE_SHOW_DEBUG=true
EOF
        print_status "Created .env.local file"
    else
        print_warning ".env.local already exists"
    fi
    
    if [ ! -f ".env.example" ]; then
        cat > .env.example << EOF
# JobHub Environment Variables Example
VITE_APP_NAME=JobHub
VITE_APP_VERSION=1.0.0
VITE_API_URL=your_api_url_here
VITE_ENABLE_ANALYTICS=false

# Development settings
VITE_DEV_MODE=true
VITE_SHOW_DEBUG=true
EOF
        print_status "Created .env.example file"
    fi
}

# Setup Git hooks (optional)
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_info "Setting up Git hooks..."
        
        # Pre-commit hook
        cat > .git/hooks/pre-commit << EOF
#!/bin/sh
# Run linting before commit
npm run lint
EOF
        chmod +x .git/hooks/pre-commit
        print_status "Git pre-commit hook installed"
    else
        print_warning "Not a Git repository. Skipping Git hooks setup."
    fi
}

# Create additional directories
create_directories() {
    print_info "Creating additional directories..."
    
    mkdir -p public/images
    mkdir -p public/icons
    mkdir -p src/assets
    mkdir -p src/utils
    mkdir -p src/constants
    mkdir -p src/services
    mkdir -p src/hooks
    mkdir -p src/contexts
    mkdir -p docs
    
    print_status "Directories created"
}

# Generate development certificates (for HTTPS)
generate_dev_certs() {
    print_info "Generating development certificates..."
    
    if command -v mkcert &> /dev/null; then
        mkdir -p certs
        cd certs
        mkcert localhost 127.0.0.1 ::1
        cd ..
        print_status "Development certificates generated"
    else
        print_warning "mkcert not found. Skipping HTTPS certificate generation."
        print_info "Install mkcert for HTTPS development: https://github.com/FiloSottile/mkcert"
    fi
}

# Main setup function
main() {
    echo ""
    print_info "Starting JobHub setup process..."
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    check_yarn
    check_pnpm
    
    echo ""
    
    # Install dependencies
    install_dependencies
    
    echo ""
    
    # Setup environment
    setup_environment
    
    # Create directories
    create_directories
    
    # Setup Git hooks
    setup_git_hooks
    
    # Ask about HTTPS certificates
    echo ""
    read -p "Generate development HTTPS certificates? (y/N): " generate_certs
    if [[ $generate_certs =~ ^[Yy]$ ]]; then
        generate_dev_certs
    fi
    
    echo ""
    echo "🎉 Setup completed successfully!"
    echo "==============================="
    echo ""
    print_status "Next steps:"
    echo "  1. Start development server: npm run dev"
    echo "  2. Open browser: http://localhost:3000"
    echo "  3. Start coding! 🚀"
    echo ""
    print_info "Available scripts:"
    echo "  npm run dev     - Start development server"
    echo "  npm run build   - Build for production"
    echo "  npm run preview - Preview production build"
    echo "  npm run lint    - Run ESLint"
    echo ""
}

# Run main function
main
