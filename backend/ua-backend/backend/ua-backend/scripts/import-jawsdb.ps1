<#
import-jawsdb.ps1

Imports the SQL found at `create.sql` into the JawsDB MySQL instance attached to a Heroku app.

Usage (from project root or from backend/ua-backend):
  powershell -ExecutionPolicy Bypass -File .\scripts\import-jawsdb.ps1 -AppName your-heroku-app -SqlPath ..\..\database\create.sql

Notes:
- Requires Heroku CLI and (optionally) the `mysql` client installed locally. If the mysql client
  is not available, the script will print the exact mysql command you should run locally.
- The script reads JAWSDB_URL from Heroku config and uses it to construct the mysql command.
#>

param(
	[string]$AppName = "",
	[string]$SqlPath = "..\..\database\create.sql"
)

function Exec-Heroku {
	param($cmd)
	Write-Host "> heroku $cmd"
	$out = & heroku $cmd 2>&1
	if ($LASTEXITCODE -ne 0) { Write-Error "Heroku command failed: $out"; exit 1 }
	return $out
}

if (-not (Get-Command heroku -ErrorAction SilentlyContinue)) {
	Write-Error "Heroku CLI not found. Install and login (heroku login) before running this script."
	exit 1
}

if ($AppName -eq "") {
	Write-Error "Please provide the Heroku app name with -AppName <your-app>"
	exit 1
}

if (-not (Test-Path $SqlPath)) {
	Write-Error "SQL file not found at path: $SqlPath. Provide -SqlPath with the correct path to create.sql"
	exit 1
}

Write-Host "Retrieving JAWSDB_URL for app: $AppName"
$jaw = Exec-Heroku "config:get JAWSDB_URL -a $AppName"
$jaw = $jaw.Trim()
if (-not $jaw) { Write-Error "JAWSDB_URL not found in Heroku config for app $AppName."; exit 1 }

if ($jaw -match 'mysql://([^:]+):([^@]+)@([^/:]+)(?::(\d+))?/(.+)') {
	$user = $Matches[1]; $pass = $Matches[2]; $host = $Matches[3]; $port = $Matches[4]; $db = $Matches[5]
	if (-not $port) { $port = 3306 }
	Write-Host "Parsed JAWSDB info: host=$host port=$port db=$db user=$user"
} else {
	Write-Error "Unable to parse JAWSDB_URL: $jaw"; exit 1
}

$FullSqlPath = Resolve-Path -Path $SqlPath

if (Get-Command mysql -ErrorAction SilentlyContinue) {
	# Build command for cmd.exe so the input redirection '<' works as expected on Windows
	$cmd = "mysql -h $host -P $port -u $user -p$pass $db < \"$FullSqlPath\""
	Write-Host "Found mysql client locally. Running import..."
	Write-Host "Command: $cmd"
	$res = & cmd.exe /c $cmd
	if ($LASTEXITCODE -ne 0) {
		Write-Error "mysql import command failed. Output:\n$res"
		exit 1
	}
	Write-Host "SQL import completed successfully."
} else {
	Write-Host "mysql client not found on this machine. To import the SQL, run the following command locally (replace path if needed):"
	Write-Host ""
	Write-Host "mysql -h $host -P $port -u $user -p$pass $db < $FullSqlPath"
	Write-Host ""
	Write-Host "If you want me to attempt to run the import from this machine, install the mysql client and re-run this script."
}

Write-Host "Done. Verify inserted rows by connecting to the DB or checking your app endpoints."

