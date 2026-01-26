$api = "https://ua-backend-app-cb2d657adc39.herokuapp.com"

Write-Host "Debugging coach delete behavior against $api" -ForegroundColor Cyan

try {
    $coaches = Invoke-RestMethod -Uri "$api/api/coaches/sort" -Method POST -ContentType "application/json" -Body '{"userLatitude":0,"userLongitude":0}'
} catch {
    Write-Host "Failed to fetch coaches: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

foreach ($c in $coaches) {
    Write-Host "========================================"
    Write-Host "FirebaseID: $($c.firebaseID)"
    Write-Host "Name: $($c.firstName) $($c.lastName)"

    # GET by firebaseID
    try {
        $g = Invoke-WebRequest -Uri "$api/api/coaches/$($c.firebaseID)" -Method GET -UseBasicParsing -ErrorAction Stop
        Write-Host "GET status: $($g.StatusCode)" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response) {
            $code = $_.Exception.Response.StatusCode.Value__
            Write-Host "GET failed: HTTP $code" -ForegroundColor Red
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "GET body: "
            Write-Host $reader.ReadToEnd()
        } else {
            Write-Host "GET failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # Try delete
    try {
        $d = Invoke-WebRequest -Uri "$api/api/coaches/delete/$($c.firebaseID)" -Method POST -UseBasicParsing -ErrorAction Stop
        Write-Host "DELETE status: $($d.StatusCode)" -ForegroundColor Green
        Write-Host $d.Content
    } catch {
        if ($_.Exception.Response) {
            $code = $_.Exception.Response.StatusCode.Value__
            Write-Host "DELETE failed: HTTP $code" -ForegroundColor Red
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host "DELETE body:"
            Write-Host $reader.ReadToEnd()
        } else {
            Write-Host "DELETE failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Start-Sleep -Milliseconds 200
}
