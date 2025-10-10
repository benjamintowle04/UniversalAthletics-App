<#
heroku_setup.ps1
Automates common Heroku setup steps for the Spring Boot app:
- Creates a Heroku app (optional specified name)
- Adds JawsDB MySQL add-on
- Reads JAWSDB_URL and sets SPRING_DATASOURCE_URL/USERNAME/PASSWORD env vars
- Prints the mysql import command you can run locally to load `database/create.sql`

Prerequisites:
- Heroku CLI installed and you're logged in (run `heroku login`)
- git available and repo initialized
- mysql client installed locally to run the final import command

Usage:
    # Run interactively
    powershell -ExecutionPolicy Bypass -File .\heroku_setup.ps1 -AppName my-ua-backend

Parameters:
    -AppName (optional) : desired heroku app name. If omitted, Heroku will generate one.
#>
param(
    [string]$AppName = ""
)

function Exec-Heroku {
    param($cmd)
    Write-Host "> $cmd"
    $out = & heroku $cmd 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Error "Heroku command failed: $out"; exit 1 }
    return $out
}

if (-not (Get-Command heroku -ErrorAction SilentlyContinue)) {
    Write-Error "Heroku CLI not found. Install it: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
}

# Create or use existing app
if ($AppName -ne "") {
    Write-Host "Creating Heroku app: $AppName"
    Exec-Heroku "apps:create $AppName"
} else {
    Write-Host "No app name given — creating a Heroku app with generated name"
    $createOut = Exec-Heroku "apps:create"
    # parse created app name
    if ($createOut -match "Creating \(https://(.+)\.herokuapp\.com/\)") {
        $AppName = $Matches[1]
    } else {
        Write-Host "Created app output:\n$createOut"
        Write-Host "Please set -AppName if script cannot determine the name."
    }
}

# Add JawsDB
Write-Host "Adding JawsDB MySQL add-on..."
Exec-Heroku "addons:create jawsdb:kitefin -a $AppName"

# Get JAWSDB_URL
Write-Host "Retrieving JAWSDB_URL..."
$jaw = Exec-Heroku "config:get JAWSDB_URL -a $AppName"
$jaw = $jaw.Trim()
if (-not $jaw) { Write-Error "JAWSDB_URL not found in Heroku config."; exit 1 }
Write-Host "JAWSDB_URL=$jaw"

# Parse JAWSDB_URL: mysql://user:pass@host:port/db
if ($jaw -match 'mysql://([^:]+):([^@]+)@([^/:]+)(?::(\d+))?/(.+)') {
    $user = $Matches[1]; $pass = $Matches[2]; $host = $Matches[3]; $port = $Matches[4]; $db = $Matches[5]
    if (-not $port) { $port = 3306 }
    $jdbc = "jdbc:mysql://$host`:$port/$db?useSSL=false&serverTimezone=UTC"
    Write-Host "Parsed: host=$host port=$port db=$db user=$user"
    Write-Host "Setting SPRING_DATASOURCE_* config vars on Heroku..."
    Exec-Heroku "config:set SPRING_DATASOURCE_URL='$jdbc' SPRING_DATASOURCE_USERNAME='$user' SPRING_DATASOURCE_PASSWORD='$pass' -a $AppName"
    Write-Host "Also setting ALLOWED_ORIGINS to allow Netlify and localhost (edit as needed)..."
    Exec-Heroku "config:set ALLOWED_ORIGINS='https://your-netlify-site.netlify.app,http://localhost:19006' -a $AppName"
} else {
    Write-Error "Unable to parse JAWSDB_URL: $jaw"; exit 1
}

Write-Host "All done. Next steps:"
Write-Host "1) Build your Spring Boot jar locally: from backend/ua-backend run: mvn clean package -DskipTests"
Write-Host "2) Push to Heroku (from backend/ua-backend): git push heroku main"
Write-Host "3) Import your local SQL into the remote JawsDB database (run locally):"
Write-Host "   mysql -h $host -P $port -u $user -p$pass $db < path\\to\\database\\create.sql"
Write-Host "   (Replace path\\to\\database\\create.sql with the actual path on your machine.)"

Write-Host "If you'd like, I can produce the exact import command tailored to your machine path."
