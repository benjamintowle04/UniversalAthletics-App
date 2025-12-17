# Delete All Coaches Script
# WARNING: This will delete ALL coaches from the database

$apiBase = "https://ua-backend-app-cb2d657adc39.herokuapp.com"

Write-Host "========================================" -ForegroundColor Red
Write-Host "WARNING: Delete ALL Coaches" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "This will permanently delete ALL coaches from the database!" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Type 'DELETE ALL' to confirm"
if ($confirm -ne "DELETE ALL") {
    Write-Host "Operation cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Fetching all coaches..." -ForegroundColor Yellow

# Get all coaches - we need to use the GET by firebaseID endpoint in a loop
# First, let's try to get them via the sort endpoint with a simple location
try {
    $response = Invoke-WebRequest `
        -Uri "$apiBase/api/coaches/sort" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"userLatitude":0,"userLongitude":0}' `
        -UseBasicParsing
    
    $coaches = $response.Content | ConvertFrom-Json
    
    Write-Host "Found $($coaches.Count) coaches" -ForegroundColor Cyan
    Write-Host ""
    
    if ($coaches.Count -eq 0) {
        Write-Host "No coaches to delete" -ForegroundColor Yellow
        exit 0
    }
    
    $deletedCount = 0
    $failedCount = 0
    
    foreach ($coach in $coaches) {
        Write-Host "Deleting: $($coach.firstName) $($coach.lastName) (Firebase ID: $($coach.firebaseID))..." -ForegroundColor Yellow
        
        try {
            $deleteResponse = Invoke-WebRequest `
                -Uri "$apiBase/api/coaches/$($coach.firebaseID)" `
                -Method DELETE `
                -UseBasicParsing
            
            Write-Host "  Deleted successfully" -ForegroundColor Green
            $deletedCount++
        } catch {
            Write-Host "  Failed to delete: $($_.Exception.Message)" -ForegroundColor Red
            $failedCount++
        }
        
        Start-Sleep -Milliseconds 300  # Brief delay between deletions
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Summary:" -ForegroundColor Cyan
    Write-Host "  Deleted: $deletedCount coaches" -ForegroundColor Green
    if ($failedCount -gt 0) {
        Write-Host "  Failed: $failedCount coaches" -ForegroundColor Red
    }
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "ERROR: Failed to fetch coaches" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
