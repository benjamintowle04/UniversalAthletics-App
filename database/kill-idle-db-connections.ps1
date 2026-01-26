# Kill idle MySQL connections older than threshold using Heroku JAWSDB_URL
param(
    [int]$IdleSecondsThreshold = 300
)

Write-Host "Fetching JAWSDB_URL from Heroku..."
$raw = (heroku config:get JAWSDB_URL -a ua-backend-app) -as [string]
if (-not $raw) {
    Write-Host "Failed to read JAWSDB_URL" -ForegroundColor Red
    exit 1
}

if ($raw -match '^mysql://(?<user>[^:]+):(?<pass>[^@]+)@(?<host>[^:]+):(?<port>\d+)/(?<db>.+)$') {
    $dbUser = $matches['user']
    $dbPass = $matches['pass']
    $dbHost = $matches['host']
    $dbPort = $matches['port']
    $dbName = $matches['db']
} else {
    Write-Host "Could not parse JAWSDB_URL: $raw" -ForegroundColor Red
    exit 1
}

Write-Host "DB host: $dbHost  DB: $dbName  User: $dbUser"

# Locate mysql executable
$mysqlPath = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'
if (Test-Path $mysqlPath) { $mysqlCmd = $mysqlPath } else { $mysqlCmd = 'mysql' }

# Query for idle Sleep connections older than threshold
$sql = "SET @myid=CONNECTION_ID(); SELECT ID,USER,HOST,DB,COMMAND,TIME,STATE,INFO FROM INFORMATION_SCHEMA.PROCESSLIST WHERE ID<>@myid AND COMMAND='Sleep' AND TIME>$IdleSecondsThreshold;"

Write-Host "Listing Sleep connections older than $IdleSecondsThreshold seconds..."
Write-Host "Running: $mysqlCmd -h $dbHost -P $dbPort -u $dbUser -p***** $dbName -e <sql>"

$listing = & "$mysqlCmd" -h $dbHost -P $dbPort -u $dbUser -p$dbPass $dbName -e "$sql" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "mysql command failed:" -ForegroundColor Red
    Write-Host $listing
    exit 1
}

Write-Host "Process list:" -ForegroundColor Cyan
Write-Host $listing

# Parse IDs from the output lines (skip header)
$ids = @()
$lines = $listing -split "\r?\n"
if ($lines.Count -le 1) {
    Write-Host "No matching idle connections found." -ForegroundColor Yellow
    exit 0
}
for ($i = 1; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    # Columns separated by tabs or multiple spaces
    $cols = $line -split "\t+|\s{2,}"
    if ($cols.Length -ge 1) {
        $id = $cols[0]
        if ($id -match '^\d+$') { $ids += $id }
    }
}

if ($ids.Count -eq 0) {
    Write-Host "No idle connection IDs parsed." -ForegroundColor Yellow
    exit 0
}

Write-Host "Killing connections: $($ids -join ', ')" -ForegroundColor Yellow
foreach ($id in $ids) {
    $killSql = "KILL $id;"
    Write-Host "KILL $id"
    $out = & "$mysqlCmd" -h $dbHost -P $dbPort -u $dbUser -p$dbPass $dbName -e "$killSql" 2>&1
    Write-Host $out
}

Write-Host "Done." -ForegroundColor Green
