# Delete Coach Script - API Version
# This script deletes a coach from the database using the backend API

param(
    [string]$FirebaseID = "",
    [string]$Email = ""
)

$apiBase = "https://ua-backend-app-cb2d657adc39.herokuapp.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Universal Athletics - Coach Deletion" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Interactive mode if no parameters provided
if (-not $FirebaseID -and -not $Email) {
    Write-Host "Delete coach by:" -ForegroundColor Yellow
    Write-Host "  1. Firebase ID" -ForegroundColor White
    Write-Host "  2. Email address" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Enter choice (1 or 2)"
    
    if ($choice -eq "1") {
        $FirebaseID = Read-Host "Enter Firebase ID"
    } elseif ($choice -eq "2") {
        $Email = Read-Host "Enter Email"
    } else {
        Write-Host "Invalid choice" -ForegroundColor Red
        exit 1
    }
}

# Find coach by email if provided
if ($Email -and -not $FirebaseID) {
    Write-Host "Looking up coach by email: $Email..." -ForegroundColor Yellow
    
    # Note: This would require a GET endpoint that searches by email
    # For now, we'll need the Firebase ID
    Write-Host "ERROR: Email lookup not yet implemented in API" -ForegroundColor Red
    Write-Host "Please use Firebase ID instead" -ForegroundColor Yellow
    exit 1
}

# Get coach details before deletion
Write-Host "Fetching coach details..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest `
        -Uri "$apiBase/api/coaches/$FirebaseID" `
        -Method GET `
        -UseBasicParsing
    
    $coach = $response.Content | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "Found coach:" -ForegroundColor Green
    Write-Host "  Name: $($coach.firstName) $($coach.lastName)" -ForegroundColor White
    Write-Host "  Email: $($coach.email)" -ForegroundColor White
    Write-Host "  Phone: $($coach.phone)" -ForegroundColor White
    Write-Host "  Location: $($coach.location)" -ForegroundColor White
    if ($coach.skillsWithLevels) {
        Write-Host "  Skills: $($coach.skillsWithLevels.Count)" -ForegroundColor White
    }
    Write-Host ""
    
} catch {
    Write-Host "ERROR: Coach not found with Firebase ID: $FirebaseID" -ForegroundColor Red
    exit 1
}

# Confirm deletion
$confirm = Read-Host "Are you sure you want to delete this coach? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Deletion cancelled" -ForegroundColor Yellow
    exit 0
}

# Delete coach
Write-Host ""
Write-Host "Deleting coach..." -ForegroundColor Yellow

try {
    $deleteResponse = Invoke-WebRequest `
        -Uri "$apiBase/api/coaches/delete/$FirebaseID" `
        -Method POST `
        -UseBasicParsing
    
    if ($deleteResponse.StatusCode -eq 204 -or $deleteResponse.StatusCode -eq 200) {
        Write-Host ""
        Write-Host "SUCCESS! Coach deleted" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Deleted: $($coach.firstName) $($coach.lastName)" -ForegroundColor Cyan
        Write-Host "Firebase ID: $FirebaseID" -ForegroundColor Cyan
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to delete coach" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
