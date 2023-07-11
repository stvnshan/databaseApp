# CS 348 Group Project
## Feature support
The README provides an explanation on how to set up the database application. Onde complete, a React app will begin in the browser that supports a simple search query on the Agency relation.
Additionally, we support a set of unit tests performed on the implemented database queries. The tests are run whenever `npm run resetdb` is invoked. They can also be manually run inside the `backend` directory by executing the command `npm run testdb`. The unit test output can be compared with the expected results in `sample.out`.

## Mac setup
1. Install brew (https://brew.sh/).
2. Install Node.js: `brew install node`.
3. Install PostgreSQL: `brew install postgresql`.
4. Start PostgreSQL: `brew services start postgresql`.
5. Clone the repository and `cd` to it.
6. Run `scripts/setup.sh`.
7. In one terminal, `cd` to the `backend` folder and run `npm start`.
8. In another terminal,`cd` to the `frontend` folder and run `npm start`.
## Windows setup
1. Download and install PostgreSQL server (https://www.postgresql.org/download/windows/).
2. Install node (https://nodejs.org/en).
3. Add the PostgreSQL bin directory path to the PATH environment variable.
4. Login to the postgresql server: `psql -U postgres`.
5. Clone the repository and `cd` to it.
6. The `scripts/setup.sh` setup script only works on Mac, so perform the following steps manually:
7. Create a the user `cs348user` and give it the `CREATEDB` permission:
```
CREATE ROLE cs348user WITH LOGIN PASSWORD 'password';
ALTER ROLE cs348user CREATEDB;
```
8. Create the database *cs348* and make it accessible to the *cs348user* user:
```
CREATE DATABASE cs348;
GRANT ALL PRIVILEGES ON DATABASE cs348 TO cs348user;
\q
```
9. Login to the `cs348` database with `psql cs348 -U cs348user`
10. Now that the database is set up, in a new terminal, return to the repository root directory. `cd` to the `backend` folder and run the following:
```
npm install     # install dependencies
npm run dropdb  # clear tables
npm run initdb  # initialize the database and populate with sample data
npm start       # start the backend app
```
11. In a new terminal, return to the repository root directory, and `cd` to the `frontend` folder and run the following:
```
npm install     # install dependencies
npm start       # start the frontend app
```

### Useful postgresql commands
* \l: lists all databases
* \c <database>: connect to a database
* \dt: list tables
* \du: list users
* \q: quit
