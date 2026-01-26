<#
.SYNOPSIS
    Insert a new coach into the Universal Athletics database using the REST API.
    
.DESCRIPTION
    This script creates a new coach account by calling the backend API.
    This avoids database connection limits and uses the same validation as the app.
    
.PARAMETER FirstName
    Coach's first name
    
.PARAMETER LastName
    Coach's last name
    
.PARAMETER Email
    Coach's email address
    
.PARAMETER Phone
    Phone number (10 digits)
    
.PARAMETER Biography1
    First line of biography (optional)
    
.PARAMETER Biography2
    Second line of biography (optional)
    
.PARAMETER Location
    Coach location, e.g., "Chicago, IL" (optional)
    
.PARAMETER FirebaseID
    Firebase authentication ID (auto-generated if not provided)
    
.PARAMETER ProfilePic
    Profile picture filename, e.g., "profiles/coach_name.jpg" (optional)
    
.PARAMETER Skills
    Comma-separated skill IDs, e.g., "1,2,5"
    
.EXAMPLE
    .\insert-coach-api.ps1 -FirstName "John" -LastName "Doe" -Email "jdoe@coach.com" -Phone "5551234567" -Skills "1,2,3"
#>

param(
    [string]$FirstName = "",
    [string]$LastName = "",
    [string]$Email = "",
    [string]$Phone = "",
    [string]$Biography1 = "Experienced coach dedicated to helping athletes reach their full potential.",
    [string]$Biography2 = "Let's work together to achieve your goals!",
    [string]$Location = "New York, NY",
    [string]$FirebaseID = "",
    [string]$ProfilePic = "",
    [string]$Skills = ""
)

# API endpoint
$apiBase = "https://ua-backend-app-cb2d657adc39.herokuapp.com"

# Function to generate Firebase-like ID
function New-FirebaseID {
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    $id = ""
    for ($i = 0; $i -lt 28; $i++) {
        $id += $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)]
    }
    return $id
}

# Function to fetch and display available skills
function Show-AvailableSkills {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Available Skills in Database" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "$apiBase/api/skills" -Method GET
        $skills = $response.Content | ConvertFrom-Json
        
        Write-Host ("{0,-5} {1}" -f "ID", "Skill Name") -ForegroundColor Yellow
        Write-Host ("{0,-5} {1}" -f "----", "--------------------") -ForegroundColor Yellow
        
        foreach ($skill in $skills | Sort-Object skill_id) {
            $id = $skill.skill_id.ToString().PadLeft(3)
            $title = $skill.title
            Write-Host ("{0,-5} {1}" -f $id, $title) -ForegroundColor White
        }
    } catch {
        Write-Host "  Could not fetch skills from API" -ForegroundColor Red
        Write-Host "  Using common skill IDs:" -ForegroundColor Yellow
        Write-Host "    1 - basketball"
        Write-Host "    2 - soccer"
        Write-Host "    3 - tennis"
        Write-Host "    4 - swimming"
        Write-Host "    5 - golf"
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Universal Athletics - Coach Creator (API)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Interactive mode if parameters not provided
if (-not $FirstName -or -not $LastName -or -not $Email -or -not $Phone) {
    Write-Host "Interactive Mode - Enter coach details" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not $FirstName) {
        $FirstName = Read-Host "First Name"
    }
    
    if (-not $LastName) {
        $LastName = Read-Host "Last Name"
    }
    
    if (-not $Email) {
        $Email = Read-Host "Email"
    }
    
    if (-not $Phone) {
        $Phone = Read-Host "Phone (e.g., 5551234567)"
    }
    
    Write-Host ""
    $useDefaults = Read-Host "Use default biography and location? (Y/N)"
    
    if ($useDefaults -ne "Y" -and $useDefaults -ne "y") {
        $Biography1 = Read-Host "Biography Line 1"
        $Biography2 = Read-Host "Biography Line 2"
        $Location = Read-Host "Location (City, State)"
    }
    
    # Show available skills from API
    Show-AvailableSkills
    
    if (-not $Skills) {
        $Skills = Read-Host "Skill IDs (comma-separated, e.g., 1,2,5)"
    }
}

# Generate Firebase ID if not provided
if (-not $FirebaseID) {
    $FirebaseID = New-FirebaseID
}

# Display what we're creating
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating Coach Account (via API)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Name: $FirstName $LastName"
Write-Host "Email: $Email"
Write-Host "Phone: $Phone"
Write-Host "Location: $Location"
Write-Host "Firebase ID: $FirebaseID"
Write-Host "Skills: $Skills"
Write-Host ""

# Parse skills into array of skill objects (CoachSkillDTO format)
$skillsArray = @()
if ($Skills) {
    $skillIds = $Skills -split ","
    foreach ($skillId in $skillIds) {
        $skillsArray += @{
            skillId = [int]$skillId.Trim()
            skillLevel = "INTERMEDIATE"  # Options: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
        }
    }
}

# Create coach JSON object
$coachData = @{
    firstName = $FirstName
    lastName = $LastName
    email = $Email
    phone = $Phone
    biography1 = $Biography1
    biography2 = $Biography2
    location = $Location
    firebaseID = $FirebaseID
    skillsWithLevels = $skillsArray
}

if ($ProfilePic) {
    $coachData.profilePic = $ProfilePic
}

$json = $coachData | ConvertTo-Json -Depth 5

Write-Host "Calling API..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$apiBase/api/coaches" `
        -Method POST `
        -ContentType "application/json" `
        -Body $json

    if ($response.StatusCode -eq 201) {
        $createdCoach = $response.Content | ConvertFrom-Json
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "SUCCESS! Coach Created" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Coach ID: $($createdCoach.coach_id)"
        Write-Host "Firebase ID: $($createdCoach.firebaseID)"
        Write-Host ""
        Write-Host "IMPORTANT: Save this Firebase ID for login:" -ForegroundColor Yellow
        Write-Host "  Firebase ID: $($createdCoach.firebaseID)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "You can now use this coach account in your app!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Unexpected response code $($response.StatusCode)" -ForegroundColor Red
        Write-Host $response.Content
        exit 1
    }
} catch {
    Write-Host "ERROR: Failed to create coach via API" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
    exit 1
}
