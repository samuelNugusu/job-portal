#!/bin/bash

# Package Installation Script for JobHub
# Installs all required dependencies with different package managers

set -e

echo "📦 JobHub Package Installation Script"
echo "====================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to install with npm
install_with_npm() {
    print_info "Installing with npm..."
    
    # Install dependencies
    npm install react@^19.0.0 react-dom@^19.0.0
    npm install react-router-dom@^6.28.0
    npm install @tanstack/react-query@^5.59.20
    npm install @reduxjs/toolkit@^2.3.0 react-redux@^9.1.2 redux-persist@^6.0.0
    npm install date-fns@^4.1.0
    npm install lucide-react@^0.460.0
    npm install clsx@^2.1.1 tailwind-merge@^2.5.4
    npm install react-hook-form@^7.53.2 @hookform/resolvers@^3.9.1
    npm install zod@^3.23.8
    npm install sonner@^1.7.1
    
    # Install dev dependencies
    npm install -D @types/react@^18.3.12 @types/react-dom@^18.3.1
    npm install -D @typescript-eslint/eslint-plugin@^8.15.0 @typescript-eslint/parser@^8.15.0
    npm install -D @vitejs/plugin-react-swc@^3.7.1
    npm install -D autoprefixer@^10.4.20 postcss@^8.4.49 tailwindcss@^3.4.14
    npm install -D eslint@^9.15.0 eslint-plugin-react-hooks@^5.0.0 eslint-plugin-react-refresh@^0.4.14
    npm install -D typescript@^5.6.3
    npm install -D vite@^6.0.1 vite-plugin-pwa@^0.21.1
    npm install -D workbox-window@^7.1.0
    
    print_status "npm installation completed!"
}

# Function to install with yarn
install_with_yarn() {
    print_info "Installing with yarn..."
    
    # Install dependencies
    yarn add react@^19.0.0 react-dom@^19.0.0
    yarn add react-router-dom@^6.28.0
    yarn add @tanstack/react-query@^5.59.20
    yarn add @reduxjs/toolkit@^2.3.0 react-redux@^9.1.2 redux-persist@^6.0.0
    yarn add date-fns@^4.1.0
    yarn add lucide-react@^0.460.0
    yarn add clsx@^2.1.1 tailwind-merge@^2.5.4
    yarn add react-hook-form@^7.53.2 @hookform/resolvers@^3.9.1
    yarn add zod@^3.23.8
    yarn add sonner@^1.7.1
    
    # Install dev dependencies
    yarn add -D @types/react@^18.3.12 @types/react-dom@^18.3.1
    yarn add -D @typescript-eslint/eslint-plugin@^8.15.0 @typescript-eslint/parser@^8.15.0
    yarn add -D @vitejs/plugin-react-swc@^3.7.1
    yarn add -D autoprefixer@^10.4.20 postcss@^8.4.49 tailwindcss@^3.4.14
    yarn add -D eslint@^9.15.0 eslint-plugin-react-hooks@^5.0.0 eslint-plugin-react-refresh@^0.4.14
    yarn add -D typescript@^5.6.3
    yarn add -D vite@^6.0.1 vite-plugin-pwa@^0.21.1
    yarn add -D workbox-window@^7.1.0
    
    print_status "yarn installation completed!"
}

# Function to install with pnpm
install_with_pnpm() {
    print_info "Installing with pnpm..."
    
    # Install dependencies
    pnpm add react@^19.0.0 react-dom@^19.0.0
    pnpm add react-router-dom@^6.28.0
    pnpm add @tanstack/react-query@^5.59.20
    pnpm add @reduxjs/toolkit@^2.3.0 react-redux@^9.1.2 redux-persist@^6.0.0
    pnpm add date-fns@^4.1.0
    pnpm add lucide-react@^0.460.0
    pnpm add clsx@^2.1.1 tailwind-merge@^2.5.4
    pnpm add react-hook-form@^7.53.2 @hookform/resolvers@^3.9.1
    pnpm add zod@^3.23.8
    pnpm add sonner@^1.7.1
    
    # Install dev dependencies
    pnpm add -D @types/react@^18.3.12 @types/react-dom@^18.3.1
    pnpm add -D @typescript-eslint/eslint-plugin@^8.15.0 @typescript-eslint/parser@^8.15.0
    pnpm add -D @vitejs/plugin-react-swc@^3.7.1
    pnpm add -D autoprefixer@^10.4.20 postcss@^8.4.49 tailwindcss@^3.4.14
    pnpm add -D eslint@^9.15.0 eslint-plugin-react-hooks@^5.0.0 eslint-plugin-react-refresh@^0.4.14
    pnpm add -D typescript@^5.6.3
    pnpm add -D vite@^6.0.1 vite-plugin-pwa@^0.21.1
    pnpm add -D workbox-window@^7.1.0
    
    print_status "pnpm installation completed!"
}

# Main installation function
main() {
    echo ""
    echo "Choose your package manager:"
    echo "1) npm"
    echo "2) yarn"
    echo "3) pnpm"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            install_with_npm
            ;;
        2)
            if command -v yarn &> /dev/null; then
                install_with_yarn
            else
                echo "Yarn not found. Installing with npm..."
                install_with_npm
            fi
            ;;
        3)
            if command -v pnpm &> /dev/null; then
                install_with_pnpm
            else
                echo "pnpm not found. Installing with npm..."
                install_with_npm
            fi
            ;;
        *)
            echo "Invalid choice. Installing with npm..."
            install_with_npm
            ;;
    esac
    
    echo ""
    print_status "All packages installed successfully! 🎉"
}

main
