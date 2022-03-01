# Agile_Team_Project
Github repository for course 'CM2020 Agile Software Projects'. Members of the team 'Group 44 (Tutor Group 05)'

## How to run tests
- Run local server `node index.js`
- Run Tests`npm test`

## How to launch app:
- Setup MySQL database locally (see DatabasePlan.sql)
- Add MySQL Credentials to `MySQLCredentials.json` in the repo root
- install packages `npm install`
- Add our firebase credentials file to repo root
- run server `node index.js`
- View the website at: `http://localhost:8080/`

## How to deploy app:
- run server `pm2 start index.js`
- stop server `pm2 stop index.js`
- check server Running `pm2 ls`

Further information: https://pm2.keymetrics.io/
