#!/bin/bash

# Set the desired credentials for the user and database
USER="test"
PASSWORD="password"
DATABASE="cs348"

brew services start postgresql

# Create the user and specify the target database explicitly
psql -d postgres -c "CREATE USER $USER WITH PASSWORD '$PASSWORD';"

# Create the database and assign ownership to the user
psql -d postgres -c "CREATE DATABASE $DATABASE OWNER $USER;"

# Grant necessary privileges to the user
psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DATABASE TO $USER;"

echo "PostgreSQL user, database, and privileges created successfully"