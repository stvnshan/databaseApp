#!/bin/bash
set -e

cd "$(git rev-parse --show-toplevel)"

# Create the database
source 'scripts/mac/create_user_and_db.sh'


# Backend
cd './backend'
# Install backend dependencies
npm install
# Drop the tables if they exist
npm run dropdb
# Create the database relations and populate with sample data
npm run initdb
# Start the backend
# npm start


# Frontend
cd '../frontend'
# Install frontend dependencies
npm install
# Start the frontend
npm start
