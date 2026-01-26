$api = "https://ua-backend-app-cb2d657adc39.herokuapp.com"
$fid = "xUNacc0OaijeZeKasiFvEmacA7pR"  # existing test coach

Write-Host "Trying delete variants for $fid" -ForegroundColor Cyan

function InvokeTry($desc, $invokeScript) {
    Write-Host "--- $desc ---" -ForegroundColor Yellow
    try {
        & $invokeScript
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 250
}

# Variant 1: simple POST (no headers)
InvokeTry "Simple POST (no headers)" { Invoke-WebRequest -Uri "$api/api/coaches/delete/$fid" -Method POST -UseBasicParsing -ErrorAction Stop | Out-String | Write-Host }

# Variant 2: POST with Content-Type: application/json and empty body
InvokeTry "POST with Content-Type JSON, empty body" { Invoke-WebRequest -Uri "$api/api/coaches/delete/$fid" -Method POST -ContentType 'application/json' -Body '{}' -UseBasicParsing -ErrorAction Stop | Out-String | Write-Host }

# Variant 3: POST with Accept: application/json
InvokeTry "POST with Accept JSON" { Invoke-WebRequest -Uri "$api/api/coaches/delete/$fid" -Method POST -Headers @{ Accept = 'application/json' } -UseBasicParsing -ErrorAction Stop | Out-String | Write-Host }

# Variant 4: POST with trailing slash
InvokeTry "POST with trailing slash" { Invoke-WebRequest -Uri "$api/api/coaches/delete/$fid/" -Method POST -UseBasicParsing -ErrorAction Stop | Out-String | Write-Host }

# Variant 5: POST using RestMethod (returns object or throws)
InvokeTry "Invoke-RestMethod POST" { Invoke-RestMethod -Uri "$api/api/coaches/delete/$fid" -Method Post -ErrorAction Stop | ConvertTo-Json | Write-Host }

# Variant 6: DELETE method on same path
InvokeTry "HTTP DELETE method" { Invoke-WebRequest -Uri "$api/api/coaches/$fid" -Method Delete -UseBasicParsing -ErrorAction Stop | Out-String | Write-Host }

Write-Host "Variants complete" -ForegroundColor Cyan
