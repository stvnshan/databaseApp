# CS 348 Group Project
## Setup
The latter sections of the README provide an explanation on how to set up the database application.
## Sample and Production datasets
We provide a set of unit tests performed on the implemented database queries. The tests are run whenever `npm run resetdb` is invoked. They can also be manually run inside the `backend` directory by executing the command `npm run testdb`.
### Sample Data
To load and test the database with **sample data**, in the file `backend/.env`, change the value of `ENVIRONMENT=` to `ENVIRONMENT=sample`. Then run `npm run resetdb` and `npm run testdb`. The expected output of `npm run testdb` for `ENVIRONMENT=sample` can be found in `/test-sample.out`.
### Production Data
To load and test the database with **production data**, in the file `backend/.env`, change the value of `ENVIRONMENT=` to `ENVIRONMENT=production`. Then *re-run* `npm run resetdb` and `npm run testdb` to reset the database and run the tests again. The expected output of `npm run testdb` for `ENVIRONMENT=production` can be found in `/test-production.out`.

## Feature support
Requests are sent through the backend. HTTP requests are routed via `backend/src/routes/routes.js`, and handled in `backend/src/controllers/controller.js`. The controllers then call the according model functions in `backend/src/models` that then communicate with the database to retrieve the requested data.
For now, the web UI should be run with the *sample dataset*. Frontend files are found in `frontend/src/web`.
1. Feature 1 -- Agencies Webpage: a page that provides information on different agencies. The frontend is implemented in the `search.js`, `Agency.js`, and `AgencyIncident.js` files. Model functions are found in `backend/src/models/agency.js` and `backend/src/models/incident.js`.
2. Feature 2 -- Map Visualizer: a map visualization of all incidents. The frontend is implemented in the `mapview.js` file. Model functions are found in `backend/src/models/incident.js` . 
3. Feature 3 -- Incident Search: a page to search incidents according to various attributes. The frontend is implemented in the `search2.js` and `Incident.js` files. Model functions are found in `backend/src/models/incident.js`.

## Mac setup
1. Install brew (https://brew.sh/).
2. Install Node.js: `brew install node`.
3. Clone the repository and `cd` to it.
4. Run `scripts/setup.sh`.
5. In one terminal, `cd` to the `backend` folder and run `npm start`.
6. In another terminal,`cd` to the `frontend` folder and run `npm start`.
## Windows setup
1. Download and install PostgreSQL server version 14.8 (https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
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
