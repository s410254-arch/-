#!/bin/bash
set -e

cd "$(dirname "$0")"

# allow overriding API_BASE via first argument or existing env var
if [ -n "$1" ]; then
  export API_BASE="$1"
fi
if [ -n "$API_BASE" ]; then
  echo "Using API_BASE=$API_BASE"
fi

# start the server if not already running
if ! lsof -i:3000 -P -n | grep -q LISTEN; then
  echo "Starting BabyCare local server..."
  npm start >/tmp/babycare-server.log 2>&1 &
  sleep 2
fi

# start localtunnel with stable subdomain
echo "Starting localtunnel..."
npx localtunnel --port 3000 --subdomain babycare-babycare999
