# Coach Management Scripts - Quick Start Guide

## Recommended: API-Based Scripts

The API-based scripts are the recommended way to create coaches. They avoid database connection limits and use the same logic as the mobile app.

### Quick Start

1. **Create a single coach** (interactive mode):
```powershell
.\insert-coach-api.ps1
```

2. **Create a single coach** (command-line):
```powershell
.\insert-coach-api.ps1 -FirstName "John" -LastName "Doe" -Email "jdoe@coach.com" -Phone "5551234567" -Skills "1,2,5"
```

3. **Create 5 sample coaches**:
```powershell
.\create-sample-coaches-api.ps1
```

4. **View available skills**:
```powershell
.\show-skills.ps1
```

5. **Delete a coach**:
```powershell
.\delete-coach-api.ps1 -FirebaseID "abc123xyz..."
```

6. **Delete all coaches** (WARNING: irreversible):
```powershell
.\delete-all-coaches.ps1
```

## Skill IDs Reference

| ID | Skill Name        | ID | Skill Name        |
|----|-------------------|----|--------------------|
| 1  | basketball        | 14 | volleyball         |
| 2  | soccer            | 15 | track_running      |
| 3  | tennis            | 16 | track_throwing     |
| 4  | swimming          | 17 | ultimate_frisbee   |
| 5  | golf              | 18 | disc_golf          |
| 6  | running           | 19 | wrestling          |
| 7  | biking            | 20 | spikeball          |
| 8  | yoga              | 21 | pickleball         |
| 9  | weightlifting     | 22 | lacrosse           |
| 10 | dance             | 23 | hockey             |
| 11 | boxing            | 24 | fishing            |
| 12 | football          | 25 | rugby              |
| 13 | baseball          |    |                    |

## Skill Levels

When creating coaches via API, you can specify skill levels:
- `BEGINNER` - Just starting out
- `INTERMEDIATE` - Default level
- `ADVANCED` - Experienced coach
- `EXPERT` - Master level

## Examples

### Basketball Coach
```powershell
.\insert-coach-api.ps1 `
    -FirstName "Michael" `
    -LastName "Jordan" `
    -Email "mjordan@coach.com" `
    -Phone "5551234567" `
    -Biography1 "Former NBA champion" `
    -Biography2 "Basketball fundamentals expert" `
    -Location "Chicago, IL" `
    -Skills "1,12"  # Basketball and Football
```

### Multi-Sport Coach
```powershell
.\insert-coach-api.ps1 `
    -FirstName "Sarah" `
    -LastName "Williams" `
    -Email "swilliams@coach.com" `
    -Phone "5559876543" `
    -Biography1 "Youth sports specialist" `
    -Biography2 "Building confident athletes" `
    -Location "Miami, FL" `
    -Skills "2,3,4,6"  # Soccer, Tennis, Swimming, Running
```

### Swimming Specialist
```powershell
.\insert-coach-api.ps1 `
    -FirstName "Emily" `
    -LastName "Chen" `
    -Email "echen@coach.com" `
    -Phone "5553216549" `
    -Biography1 "Olympic swimming coach" `
    -Biography2 = "15+ years of competitive coaching" `
    -Location "Seattle, WA" `
    -Skills "4,8"  # Swimming and Yoga
```

## Verify Coaches Created

### Via PowerShell:
```powershell
$response = Invoke-WebRequest -Uri 'https://ua-backend-app-cb2d657adc39.herokuapp.com/api/coaches/{firebaseID}' -Method GET -UseBasicParsing
$coach = $response.Content | ConvertFrom-Json
Write-Host "Coach: $($coach.firstName) $($coach.lastName)"
Write-Host "Skills: $($coach.skillsWithLevels.Count)"
```

### Via Frontend App:
1. Open [Universal Athletics](https://universal-athletics-site.netlify.app)
2. Log in as a member (Test User: `hXi0jJw61ThQuzK1OTqB6huKJHE2`)
3. Navigate to "Explore Connections"
4. You should see all created coaches

## Important Notes

- **Firebase IDs**: Each coach gets an auto-generated 28-character Firebase ID for authentication
- **Save Firebase IDs**: The scripts display the Firebase ID after creation - save these for login
- **Skills**: Skills are optional but recommended - coaches with no skills may not appear in filtered searches
- **Email**: Must be unique for each coach
- **Phone**: 10-digit phone number (no formatting, just digits)

## Troubleshooting

### "Could not fetch skills from API"
- The API endpoint may be down
- Check your internet connection
- Script will display common skill IDs as fallback

### "Failed to create coach via API"
- Check that all required fields are provided (FirstName, LastName, Email, Phone)
- Ensure email is unique (not already in database)
- Verify phone is 10 digits
- Check that skill IDs are valid (1-25)

### "Skills count: 0" after creation
- This was a bug in earlier versions - now fixed!
- Skills should appear if you used correct field names (skillId, skillLevel)
- Verify with the show-skills.ps1 script first

## Legacy Scripts (Direct Database Access)

These scripts connect directly to the database. Not recommended due to connection limits:
- `insert-coach.ps1` - Direct database insertion
- `create-sample-coaches.ps1` - Batch creation via database
- `quick-add-coach.ps1` - Interactive database insertion

Use API-based scripts instead unless you have a specific reason to use direct database access.

## Need Help?

- View all skills: `.\show-skills.ps1`
- Check README_COACH_SCRIPTS.md for detailed documentation
- Review script comments for parameter details
