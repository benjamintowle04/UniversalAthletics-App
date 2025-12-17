# Quick Coach Creator - Interactive Menu
# Usage: .\quick-add-coach.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Universal Athletics - Quick Coach Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for coach details
Write-Host "Enter coach details:" -ForegroundColor Yellow
Write-Host ""

$firstName = Read-Host "First Name"
$lastName = Read-Host "Last Name"
$email = Read-Host "Email"
$phone = Read-Host "Phone (e.g., 5551234567)"

Write-Host ""
Write-Host "Optional fields (press Enter to use defaults):" -ForegroundColor Yellow
Write-Host ""

$bio1 = Read-Host "Biography Line 1 (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($bio1)) {
    $bio1 = "Experienced coach dedicated to helping athletes reach their full potential."
}

$bio2 = Read-Host "Biography Line 2 (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($bio2)) {
    $bio2 = "Specializing in personalized training programs."
}

$location = Read-Host "Location (or press Enter for 'New York, NY')"
if ([string]::IsNullOrWhiteSpace($location)) {
    $location = "New York, NY"
}

Write-Host ""
Write-Host "Available Skills:" -ForegroundColor Yellow
Write-Host "  1  - Basketball"
Write-Host "  2  - Soccer"
Write-Host "  3  - Tennis"
Write-Host "  4  - Swimming"
Write-Host "  5  - Track & Field"
Write-Host "  6  - Football"
Write-Host "  7  - Baseball"
Write-Host "  8  - Volleyball"
Write-Host "  9  - Gymnastics"
Write-Host "  10 - Weightlifting"
Write-Host "  11 - CrossFit"
Write-Host "  12 - Yoga"
Write-Host ""

$skills = Read-Host "Skill IDs (comma-separated, e.g., 1,2,3 or press Enter for default 1,2,3)"
if ([string]::IsNullOrWhiteSpace($skills)) {
    $skills = "1,2,3"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Review Coach Details" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Name: $firstName $lastName"
Write-Host "Email: $email"
Write-Host "Phone: $phone"
Write-Host "Location: $location"
Write-Host "Bio 1: $bio1"
Write-Host "Bio 2: $bio2"
Write-Host "Skills: $skills"
Write-Host ""

$confirm = Read-Host "Create this coach? (Y/N)"

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

# Call the insert script
$scriptPath = Join-Path $PSScriptRoot "insert-coach.ps1"

if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: Could not find insert-coach.ps1 script" -ForegroundColor Red
    Write-Host "Expected location: $scriptPath" -ForegroundColor Red
    exit 1
}

& $scriptPath `
    -FirstName $firstName `
    -LastName $lastName `
    -Email $email `
    -Phone $phone `
    -Biography1 $bio1 `
    -Biography2 $bio2 `
    -Location $location `
    -Skills $skills
