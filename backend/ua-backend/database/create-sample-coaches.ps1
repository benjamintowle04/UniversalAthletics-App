# Batch script to create multiple sample coaches quickly
# Usage: .\create-sample-coaches.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Universal Athletics - Sample Coach Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Sample coaches data
$sampleCoaches = @(
    @{
        FirstName = "Michael"
        LastName = "Johnson"
        Email = "michael.johnson@uacoach.com"
        Phone = "5551234567"
        Biography1 = "Former Olympic track coach with 15 years of experience."
        Biography2 = "Specialized in sprint training and technique refinement."
        Location = "Los Angeles, CA"
        Skills = "1,2,5"  # Basketball, Soccer, Track & Field
    },
    @{
        FirstName = "Sarah"
        LastName = "Williams"
        Email = "sarah.williams@uacoach.com"
        Phone = "5552345678"
        Biography1 = "Professional tennis coach and fitness trainer."
        Biography2 = "Focus on developing mental toughness and strategic play."
        Location = "Miami, FL"
        Skills = "3,4,8"  # Tennis, Swimming, Volleyball
    },
    @{
        FirstName = "David"
        LastName = "Martinez"
        Email = "david.martinez@uacoach.com"
        Phone = "5553456789"
        Biography1 = "NCAA Division I basketball coach."
        Biography2 = "Expert in strength training and game strategy."
        Location = "Chicago, IL"
        Skills = "1,6,7"  # Basketball, Football, Baseball
    },
    @{
        FirstName = "Emily"
        LastName = "Chen"
        Email = "emily.chen@uacoach.com"
        Phone = "5554567890"
        Biography1 = "Youth soccer development specialist."
        Biography2 = "Passionate about building fundamental skills and teamwork."
        Location = "Seattle, WA"
        Skills = "2,8,9"  # Soccer, Volleyball, Gymnastics
    },
    @{
        FirstName = "Robert"
        LastName = "Thompson"
        Email = "robert.thompson@uacoach.com"
        Phone = "5555678901"
        Biography1 = "CrossFit certified trainer and nutrition coach."
        Biography2 = "Helping athletes achieve peak performance through holistic training."
        Location = "Austin, TX"
        Skills = "10,11,12"  # Weightlifting, CrossFit, Nutrition
    }
)

Write-Host "This will create $($sampleCoaches.Count) sample coaches in the database." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continue? (Y/N)"

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""

$scriptPath = Join-Path $PSScriptRoot "insert-coach.ps1"

if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: Could not find insert-coach.ps1 script" -ForegroundColor Red
    Write-Host "Expected location: $scriptPath" -ForegroundColor Red
    exit 1
}

$successCount = 0
$failCount = 0

foreach ($coach in $sampleCoaches) {
    Write-Host ""
    Write-Host "Creating coach: $($coach.FirstName) $($coach.LastName)..." -ForegroundColor Cyan
    
    try {
        & $scriptPath `
            -FirstName $coach.FirstName `
            -LastName $coach.LastName `
            -Email $coach.Email `
            -Phone $coach.Phone `
            -Biography1 $coach.Biography1 `
            -Biography2 $coach.Biography2 `
            -Location $coach.Location `
            -Skills $coach.Skills
        
        if ($LASTEXITCODE -eq 0) {
            $successCount++
        } else {
            $failCount++
        }
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
    Write-Host "----------------------------------------"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Successfully created: $successCount coaches" -ForegroundColor Green
Write-Host "Failed: $failCount coaches" -ForegroundColor Red
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
