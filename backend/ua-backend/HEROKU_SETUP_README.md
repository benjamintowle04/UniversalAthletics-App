Heroku + JawsDB setup helper

This folder contains `heroku_setup.ps1` — a PowerShell script that automates common steps to deploy the Spring Boot backend to Heroku and configure the JawsDB MySQL add-on.

Prerequisites
- Heroku CLI installed and you are logged in (`heroku login`).
- Git installed and your repo is committed.
- MySQL client installed locally to run the final import of `database/create.sql`.
- From your project root, run the script from `backend/ua-backend` or pass the path to the SQL file when running the mysql import command.

Typical flow
1) Build the jar locally:
   mvn -f backend/ua-backend clean package -DskipTests

2) Run the helper (example):
   cd backend/ua-backend
   powershell -ExecutionPolicy Bypass -File .\heroku_setup.ps1 -AppName your-app-name

   The script will:
   - create (or use) the Heroku app
   - add JawsDB add-on
   - read the JAWSDB_URL and set SPRING_DATASOURCE_URL/USERNAME/PASSWORD env vars
   - print the mysql import command to run locally

3) Push your code to Heroku (from backend/ua-backend):
   git push heroku main

4) Import the SQL schema (run locally):
   mysql -h <host> -P <port> -u <user> -p<password> <database> < c:\Universal-Athletics\UniversalAthletics-App\database\create.sql

Notes
- The script sets `SPRING_DATASOURCE_*` config vars so that Spring Boot can use them in production.
- If you'd like me to automate the SQL import as well, I can add that step, but it requires your local machine to have network access to the JawsDB host and the mysql client installed.

Security
- Do not commit secrets (passwords) into version control. The script stores credentials only in Heroku config vars.

Next steps I can take for you
- Create a PowerShell command to automatically run the final mysql import if you confirm you have mysql client installed and allow remote connections.
- Add Flyway migrations so schema is applied automatically when the app starts.
- Create a small CI workflow to deploy automatically from GitHub to Heroku.
