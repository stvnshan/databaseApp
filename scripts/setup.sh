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
npm run drop
# Create the database relations
npm run create


# Install
cd '../frontend'
# Install frontend dependencies
npm install
