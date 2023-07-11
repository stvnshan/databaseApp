#!/bin/bash
set -e

cd "$(git rev-parse --show-toplevel)"

# Create the database
source 'scripts/mac/create_user_and_db.sh'


# Backend
cd './backend'
# Install backend dependencies
npm install
# Reset the database
npm run resetdb


# Frontend
cd '../frontend'
# Install frontend dependencies
npm install
