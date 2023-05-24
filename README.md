# CS 348 Group Project

## Windows initial setup
1. Download and install PostgreSQL server (https://www.postgresql.org/download/windows/)
2. Add the PostgreSQL bin directory path to the PATH environment variable
3. Login to the postgresql server: `psql -U postgres`

## Mac initial setup
1. Install brew (https://brew.sh/)
2. Install PostgreSQL: `brew install postgresql`
3. Start PostgreSQL: `brew services start postgresql`
4. Login to the PostgreSQL server: `psql postgres`

## Sample app creation
1. Ensure node is installed (https://nodejs.org/en)
2. Clone the repository and `cd` to it
3. Install the necessary dependencies with `npm install express pg`

## Sample database creation
1. Create a new user `newUser` and give it the `CREATEDB` permission:
```
CREATE ROLE newUser WITH LOGIN PASSWORD 'password';
ALTER ROLE newUser CREATEDB;
```
2. Create the database and make it accessible to the *newUser* user:
```
CREATE DATABASE test;
GRANT ALL PRIVILEGES ON DATABASE test TO newUser;
\q
```
3. Login to the `test` database with `psql test -U newUser`
4. To test the database, create the following sample relation named **users** and enter a data point:
```
CREATE TABLE users (name TEXT);
INSERT INTO users (name) VALUES ('John');
```
5. Exit the database and run the node app with `node app.js`
6. In a browser, go to the URL `localhost:3000/users` to view a json file containing the sample data

### Useful postgresql commands
* \list: lists all databases
* \connect: connect to a database
* \dt: list tables
* \du: list users
* \q: quit
