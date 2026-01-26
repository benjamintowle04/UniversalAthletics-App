$api = "https://ua-backend-app-cb2d657adc39.herokuapp.com"

Write-Host "Detailed delete debugging against $api" -ForegroundColor Cyan

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

    # OPTIONS
    try {
        $opt = Invoke-WebRequest -Uri "$api/api/coaches/delete/$($c.firebaseID)" -Method OPTIONS -UseBasicParsing -ErrorAction Stop
        Write-Host "OPTIONS status: $($opt.StatusCode)" -ForegroundColor Green
        if ($opt.Headers['Allow']) { Write-Host "Allow: $($opt.Headers['Allow'])" }
    } catch {
        if ($_.Exception.Response) {
            $code = $_.Exception.Response.StatusCode.Value__
            Write-Host "OPTIONS failed: HTTP $code" -ForegroundColor Yellow
            try { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host $reader.ReadToEnd() } catch {}
        } else {
            Write-Host "OPTIONS failed: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    # GET by firebaseID
    try {
        $g = Invoke-WebRequest -Uri "$api/api/coaches/$($c.firebaseID)" -Method GET -UseBasicParsing -ErrorAction Stop
        Write-Host "GET status: $($g.StatusCode)" -ForegroundColor Green
        Write-Host "GET Content length: $($g.Content.Length)"
    } catch {
        if ($_.Exception.Response) {
            $code = $_.Exception.Response.StatusCode.Value__
            Write-Host "GET failed: HTTP $code" -ForegroundColor Red
            try { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host "GET body:"; Write-Host $reader.ReadToEnd() } catch {}
        } else {
            Write-Host "GET failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # POST delete
    try {
        $d = Invoke-WebRequest -Uri "$api/api/coaches/delete/$($c.firebaseID)" -Method POST -UseBasicParsing -ErrorAction Stop
        Write-Host "DELETE status: $($d.StatusCode)" -ForegroundColor Green
        Write-Host "DELETE Content length: $($d.Content.Length)"
        Write-Host $d.Content
    } catch {
        if ($_.Exception.Response) {
            $code = $_.Exception.Response.StatusCode.Value__
            Write-Host "DELETE failed: HTTP $code" -ForegroundColor Red
            try { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Host "DELETE body:"; Write-Host $reader.ReadToEnd() } catch {}
            Write-Host "Response headers:" -ForegroundColor Gray
            try { $_.Exception.Response.Headers.GetEnumerator() | ForEach-Object { Write-Host "  $($_)" } } catch {}
        } else {
            Write-Host "DELETE failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Start-Sleep -Milliseconds 250
}
