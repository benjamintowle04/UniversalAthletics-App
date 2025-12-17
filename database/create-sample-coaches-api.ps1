# Create Sample Coaches via API
# This script creates 5 sample coaches with various skills

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating Sample Coaches via API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apiBase = "https://ua-backend-app-cb2d657adc39.herokuapp.com"
$coaches = @(
    @{
        firstName = "Emily"
        lastName = "Chen"
        email = "echen@coach.com"
        phone = "5553216549"
        biography1 = "Olympic swimming coach with 15+ years experience"
        biography2 = "Specializing in competitive swimming and technique"
        location = "Seattle, WA"
        skills = @(
            @{ skillId = 4; skillLevel = "EXPERT" }      # Swimming
            @{ skillId = 8; skillLevel = "ADVANCED" }   # Yoga
        )
    },
    @{
        firstName = "Robert"
        lastName = "Thompson"
        email = "rthompson@coach.com"
        phone = "5557894561"
        biography1 = "Multi-sport coach focusing on youth development"
        biography2 = "Building confident athletes one session at a time"
        location = "Austin, TX"
        skills = @(
            @{ skillId = 1; skillLevel = "ADVANCED" }    # Basketball
            @{ skillId = 13; skillLevel = "ADVANCED" }   # Baseball
            @{ skillId = 15; skillLevel = "INTERMEDIATE" } # Track Running
        )
    },
    @{
        firstName = "Jessica"
        lastName = "Rodriguez"
        email = "jrodriguez@coach.com"
        phone = "5559638527"
        biography1 = "Professional tennis instructor and former tour player"
        biography2 = "Passionate about teaching the fundamentals"
        location = "San Diego, CA"
        skills = @(
            @{ skillId = 3; skillLevel = "EXPERT" }      # Tennis
            @{ skillId = 5; skillLevel = "INTERMEDIATE" } # Golf
        )
    },
    @{
        firstName = "Marcus"
        lastName = "Johnson"
        email = "mjohnson@coach.com"
        phone = "5551472583"
        biography1 = "Strength and conditioning specialist"
        biography2 = "Helping athletes maximize their potential"
        location = "Denver, CO"
        skills = @(
            @{ skillId = 9; skillLevel = "EXPERT" }      # Weightlifting
            @{ skillId = 6; skillLevel = "ADVANCED" }    # Running
            @{ skillId = 11; skillLevel = "INTERMEDIATE" } # Boxing
        )
    },
    @{
        firstName = "Amanda"
        lastName = "Parker"
        email = "aparker@coach.com"
        phone = "5558529637"
        biography1 = "Dance instructor and choreographer"
        biography2 = "Making fitness fun through movement"
        location = "Portland, OR"
        skills = @(
            @{ skillId = 10; skillLevel = "EXPERT" }     # Dance
            @{ skillId = 8; skillLevel = "ADVANCED" }    # Yoga
            @{ skillId = 7; skillLevel = "INTERMEDIATE" } # Biking
        )
    }
)

$createdCount = 0

foreach ($coach in $coaches) {
    # Generate Firebase ID
    $firebaseId = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 28 | ForEach-Object {[char]$_})
    $coach.firebaseID = $firebaseId
    
    Write-Host "Creating: $($coach.firstName) $($coach.lastName)..." -ForegroundColor Yellow
    Write-Host "  Location: $($coach.location)" -ForegroundColor Gray
    Write-Host "  Skills: $($coach.skills.Count)" -ForegroundColor Gray
    
    # Rename skills to skillsWithLevels for API
    $coachData = $coach.Clone()
    $coachData.skillsWithLevels = $coachData.skills
    $coachData.Remove('skills')
    
    $json = $coachData | ConvertTo-Json -Depth 5
    
    try {
        $response = Invoke-WebRequest `
            -Uri "$apiBase/api/coaches" `
            -Method POST `
            -ContentType "application/json" `
            -Body $json `
            -UseBasicParsing
        
        if ($response.StatusCode -eq 201) {
            $created = $response.Content | ConvertFrom-Json
            Write-Host "  SUCCESS! Coach ID: $($created.coach_id), Firebase ID: $($created.firebaseID)" -ForegroundColor Green
            $createdCount++
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500  # Brief delay between requests
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary: Created $createdCount out of $($coaches.Count) coaches" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
