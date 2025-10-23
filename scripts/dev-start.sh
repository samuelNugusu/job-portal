#!/bin/bash

# Development Server Start Script
# Starts the JobHub development server with various options

echo "🚀 Starting JobHub Development Server"
echo "===================================="

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not found. Please run setup first:"
    echo "   ./scripts/setup.sh"
    exit 1
fi

# Default values
PORT=3000
HOST="localhost"
OPEN_BROWSER=true
HTTPS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --port|-p)
            PORT="$2"
            shift 2
            ;;
        --host|-h)
            HOST="$2"
            shift 2
            ;;
        --no-open)
            OPEN_BROWSER=false
            shift
            ;;
        --https)
            HTTPS=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --port, -p <port>    Port number (default: 3000)"
            echo "  --host, -h <host>    Host address (default: localhost)"
            echo "  --no-open           Don't open browser automatically"
            echo "  --https             Use HTTPS (requires certificates)"
            echo "  --help              Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Set environment variables
export VITE_PORT=$PORT
export VITE_HOST=$HOST

if [ "$HTTPS" = true ]; then
    export VITE_HTTPS=true
    if [ -f "certs/localhost.pem" ] && [ -f "certs/localhost-key.pem" ]; then
        export VITE_HTTPS_CERT="certs/localhost.pem"
        export VITE_HTTPS_KEY="certs/localhost-key.pem"
        echo "✅ Using HTTPS with certificates"
    else
        echo "⚠️  HTTPS certificates not found. Run setup with certificate generation."
        HTTPS=false
    fi
fi

# Start the development server
echo "🌐 Starting server on ${HTTPS:+https://}${HOST}:${PORT}"
echo "📁 Project: JobHub React Application"
echo "🔧 Mode: Development"
echo ""

if [ "$OPEN_BROWSER" = true ]; then
    npm run dev -- --port $PORT --host $HOST ${HTTPS:+--https} --open
else
    npm run dev -- --port $PORT --host $HOST ${HTTPS:+--https}
fi
