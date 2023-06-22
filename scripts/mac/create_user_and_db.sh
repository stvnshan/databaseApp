#!/bin/bash
set -e

# Extract the desired credentials for the user and database from .env
cd "$(git rev-parse --show-toplevel)"
set -o allexport
source 'backend/.env' set +o allexport

# Start the postgresql server
brew services start postgresql

# Create the user and specify the target database explicitly
psql postgres -tXAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
psql -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Create the database and assign ownership to the user
psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME || \
psql -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Grant necessary privileges to the user
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "PostgreSQL user, database, and privileges created successfully."
