# Script to list all available skills from the database
# Usage: .\list-skills.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Universal Athletics - Skills Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get JawsDB connection details
Write-Host "Connecting to database..." -ForegroundColor Yellow
$jawsUrl = heroku config:get JAWSDB_URL --app ua-backend-app 2>$null

if (!$jawsUrl) {
    Write-Host "ERROR: Could not retrieve JawsDB URL from Heroku" -ForegroundColor Red
    exit 1
}

if ($jawsUrl -match "mysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)") {
    $dbUser = $matches[1]
    $dbPass = $matches[2]
    $dbHost = $matches[3]
    $dbPort = $matches[4]
    $dbName = $matches[5]
} else {
    Write-Host "ERROR: Could not parse JawsDB URL" -ForegroundColor Red
    exit 1
}

# Query all skills
$skillQuery = "SELECT skill_id, title, icon FROM skill ORDER BY skill_id;"
Write-Host ""
Write-Host "Fetching skills..." -ForegroundColor Yellow

$skillsResult = $skillQuery | mysql -h $dbHost -P $dbPort -u $dbUser -p"$dbPass" -D $dbName -t 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to fetch skills" -ForegroundColor Red
    Write-Host $skillsResult
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Available Skills" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host $skillsResult
Write-Host ""
Write-Host "Use these Skill IDs when creating coaches." -ForegroundColor Yellow
Write-Host "Example: -Skills '1,2,3' for Basketball, Soccer, Tennis" -ForegroundColor Yellow
Write-Host ""
