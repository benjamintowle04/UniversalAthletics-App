# Script to insert a coach into the JawsDB database
# Usage: .\insert-coach.ps1 -FirstName "John" -LastName "Doe" -Email "john.doe@email.com" -Phone "1234567890"

param(
    [Parameter(Mandatory=$false)]
    [string]$FirstName,
    
    [Parameter(Mandatory=$false)]
    [string]$LastName,
    
    [Parameter(Mandatory=$false)]
    [string]$Email,
    
    [Parameter(Mandatory=$false)]
    [string]$Phone,
    
    [Parameter(Mandatory=$false)]
    [string]$Biography1 = "Experienced coach dedicated to helping athletes reach their full potential.",
    
    [Parameter(Mandatory=$false)]
    [string]$Biography2 = "Specializing in personalized training programs.",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "New York, NY",
    
    [Parameter(Mandatory=$false)]
    [string]$ProfilePic = $null,
    
    [Parameter(Mandatory=$false)]
    [string]$Skills = ""  # Comma-separated skill IDs
)

# Function to fetch and display available skills from API
function Show-AvailableSkills {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Available Skills in Database" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri 'https://ua-backend-app-cb2d657adc39.herokuapp.com/api/skills' -Method GET
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
Write-Host "Universal Athletics - Coach Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get JawsDB connection details early for skill lookup
Write-Host "Connecting to database..." -ForegroundColor Yellow
$jawsUrl = heroku config:get JAWSDB_URL --app ua-backend-app 2>$null

if (!$jawsUrl) {
    Write-Host "ERROR: Could not retrieve JawsDB URL from Heroku" -ForegroundColor Red
    exit 1
}

if ($jawsUrl -match "mysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)") {
    $dbUser = $matches[1]
    $dbPass = $matches[2]
    $dbHost = $matches[3]
    $dbPort = $matches[4]
    $dbName = $matches[5]
} else {
    Write-Host "ERROR: Could not parse JawsDB URL" -ForegroundColor Red
    exit 1
}

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
    
    # Show available skills from database
    Show-AvailableSkills
    
    if (-not $Skills) {
        $Skills = Read-Host "Skill IDs (comma-separated, e.g., 1,2,5)"
    }
}

# Generate a random Firebase ID (simulating a real one)
$FirebaseID = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 28 | ForEach-Object {[char]$_})

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating Coach Account" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Name: $FirstName $LastName"
Write-Host "Email: $Email"
Write-Host "Phone: $Phone"
Write-Host "Location: $Location"
Write-Host "Firebase ID: $FirebaseID"
if ($Skills) {
    Write-Host "Skills: $Skills"
}
Write-Host ""

Write-Host "Inserting into database..." -ForegroundColor Yellow

# Create SQL for inserting coach
$profilePicValue = if ($ProfilePic) { "'$ProfilePic'" } else { "NULL" }

$sql = @"
INSERT INTO coach (first_name, last_name, email, phone, biography1, biography2, location, firebase_id, profile_pic)
VALUES ('$FirstName', '$LastName', '$Email', '$Phone', '$Biography1', '$Biography2', '$Location', '$FirebaseID', $profilePicValue);
SELECT LAST_INSERT_ID() as coach_id;
"@

Write-Host "Inserting coach into database..." -ForegroundColor Yellow

# Execute SQL using pipeline (PowerShell compatible)
$result = $sql | mysql -h $dbHost -P $dbPort -u $dbUser -p"$dbPass" -D $dbName 2>&1

# Check for errors
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to insert coach" -ForegroundColor Red
    Write-Host $result
    exit 1
}

# Extract coach ID from result
$coachId = ($result | Select-String -Pattern "\d+" | Select-Object -First 1).Matches.Value

if ($coachId) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Coach Created" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Coach ID: $coachId"
    Write-Host "Firebase ID: $FirebaseID"
    Write-Host ""
    
    # Insert skills if provided
    if ($Skills) {
        Write-Host "Adding skills to coach..." -ForegroundColor Yellow
        $skillIds = $Skills -split ","
        
        foreach ($skillId in $skillIds) {
            $skillSql = "INSERT INTO coach_skills (coach_id, skill_id) VALUES ($coachId, $($skillId.Trim()));"
            
            $skillResult = $skillSql | mysql -h $dbHost -P $dbPort -u $dbUser -p"$dbPass" -D $dbName 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  [OK] Added skill $skillId" -ForegroundColor Green
            }
        }
    }
    
    Write-Host ""
    Write-Host "IMPORTANT: Save this Firebase ID for login:" -ForegroundColor Yellow
    Write-Host "  Firebase ID: $FirebaseID" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can now use this coach account in your app!" -ForegroundColor Green
    
} else {
    Write-Host "ERROR: Could not determine coach ID" -ForegroundColor Red
    Write-Host $result
    exit 1
}
