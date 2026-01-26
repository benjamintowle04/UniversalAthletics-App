# Agent script: delete all coaches via API then insert a test coach using repo script
$api = "https://ua-backend-app-cb2d657adc39.herokuapp.com"

Write-Host "Starting clear-and-insert operation against $api" -ForegroundColor Cyan

try {
    $resp = Invoke-RestMethod -Uri "$api/api/coaches/sort" -Method POST -ContentType "application/json" -Body '{"userLatitude":0,"userLongitude":0}'
} catch {
    Write-Host "Fetch failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

if ($resp -and $resp.Count -gt 0) {
    Write-Host "Found $($resp.Count) coaches to delete" -ForegroundColor Yellow
    foreach ($c in $resp) {
        Write-Host "Deleting $($c.firstName) $($c.lastName) ($($c.firebaseID))" -ForegroundColor Yellow
        try {
            Invoke-RestMethod -Uri "$api/api/coaches/delete/$($c.firebaseID)" -Method POST
            Write-Host "  Deleted" -ForegroundColor Green
        } catch {
            Write-Host "  Delete failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        Start-Sleep -Milliseconds 200
    }
} else {
    Write-Host "No coaches found" -ForegroundColor Yellow
}

# Insert test coach using repo script
$insertScript = "c:\\Universal-Athletics\\UniversalAthletics-App\\database\\insert-coach-api.ps1"
if (-Not (Test-Path $insertScript)) {
    Write-Host "Insert script not found at $insertScript" -ForegroundColor Red
    exit 1
}

Write-Host "Creating test coach via $insertScript" -ForegroundColor Cyan
& $insertScript -FirstName "Test" -LastName "Coach" -Email "test.coach@example.com" -Phone "5550000000" -Skills "1,2" -Biography1 "Test coach" -Biography2 "Inserted by agent" -Location "Remote"

Write-Host "Operation complete" -ForegroundColor Cyan
