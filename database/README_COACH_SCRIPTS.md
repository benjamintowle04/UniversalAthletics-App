# Coach Database Management Scripts

This folder contains PowerShell scripts for managing coach accounts in the Universal Athletics database.

## Prerequisites

1. **MySQL Client**: Install MySQL command-line client
   - Windows: Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
   - Or install via Chocolatey: `choco install mysql`

2. **Heroku CLI**: Required to access database credentials
   - Already installed (you're using it)

3. **PowerShell**: Windows PowerShell 5.1 or PowerShell 7+

## Scripts Overview

### 1. `insert-coach.ps1` - Manual Coach Insertion
Insert a single coach with custom details.

**Usage:**
```powershell
.\insert-coach.ps1 -FirstName "John" -LastName "Doe" -Email "john@email.com" -Phone "5551234567"
```

**All Parameters:**
- `-FirstName` (required): Coach's first name
- `-LastName` (required): Coach's last name  
- `-Email` (required): Coach's email address
- `-Phone` (required): Coach's phone number
- `-Biography1` (optional): First bio line (default: generic text)
- `-Biography2` (optional): Second bio line (default: generic text)
- `-Location` (optional): Coach location (default: "New York, NY")
- `-Skills` (optional): Comma-separated skill IDs (default: "1,2,3")
- `-ProfilePic` (optional): Profile picture path in cloud storage

**Example:**
```powershell
.\insert-coach.ps1 `
    -FirstName "Michael" `
    -LastName "Jordan" `
    -Email "mjordan@coach.com" `
    -Phone "5559876543" `
    -Biography1 "Former NBA champion" `
    -Biography2 "Basketball fundamentals expert" `
    -Location "Chicago, IL" `
    -Skills "1,5,6"
```

### 2. `quick-add-coach.ps1` - Interactive Coach Creator
Interactive menu-driven coach creation.

**Usage:**
```powershell
.\quick-add-coach.ps1
```

Follow the prompts to enter coach details. Press Enter to use default values for optional fields.

### 3. `create-sample-coaches.ps1` - Batch Sample Coaches
Create 5 pre-configured sample coaches quickly.

**Usage:**
```powershell
.\create-sample-coaches.ps1
```

Creates these sample coaches:
- Michael Johnson (Track & Field) - Los Angeles, CA
- Sarah Williams (Tennis) - Miami, FL
- David Martinez (Basketball) - Chicago, IL
- Emily Chen (Soccer) - Seattle, WA
- Robert Thompson (CrossFit) - Austin, TX

## Skill IDs Reference

Use these IDs when specifying coach skills:

| ID | Skill          |
|----|----------------|
| 1  | Basketball     |
| 2  | Soccer         |
| 3  | Tennis         |
| 4  | Swimming       |
| 5  | Track & Field  |
| 6  | Football       |
| 7  | Baseball       |
| 8  | Volleyball     |
| 9  | Gymnastics     |
| 10 | Weightlifting  |
| 11 | CrossFit       |
| 12 | Yoga           |
| 13 | Golf           |
| 14 | Hockey         |
| 15 | Boxing         |
| 16 | Wrestling      |
| 17 | Martial Arts   |
| 18 | Running        |
| 19 | Cycling        |
| 20 | Dance          |

## Important Notes

### Firebase ID
Each script **automatically generates a random Firebase ID** for the coach. This ID is displayed after creation and should be saved if you need to:
- Log in as this coach in Firebase Authentication
- Reference this coach in API calls
- Link this coach to Firebase users

### Database Connection
The scripts automatically:
- Retrieve JawsDB credentials from Heroku config
- Connect to the production database
- Handle connection errors gracefully

### Error Handling
If a script fails:
1. Check that MySQL client is installed: `mysql --version`
2. Verify Heroku CLI is logged in: `heroku auth:whoami`
3. Check database connection limits (JawsDB has max 10 connections)
4. Review error messages for specific issues

## Quick Start

### Create Sample Coaches (Easiest)
```powershell
cd C:\Universal-Athletics\UniversalAthletics-App\database
.\create-sample-coaches.ps1
```

### Create Single Custom Coach
```powershell
cd C:\Universal-Athletics\UniversalAthletics-App\database
.\quick-add-coach.ps1
```

### Advanced Single Coach Creation
```powershell
cd C:\Universal-Athletics\UniversalAthletics-App\database
.\insert-coach.ps1 -FirstName "Alex" -LastName "Smith" -Email "alex@coach.com" -Phone "5551112222" -Skills "1,2,3,4"
```

## Troubleshooting

### "mysql: command not found"
Install MySQL client:
```powershell
choco install mysql
```
Or download from MySQL website.

### "User has exceeded max_user_connections"
Close any open database connections or wait a few minutes. JawsDB free tier has a 10-connection limit.

### "Could not retrieve JawsDB URL"
Ensure you're logged into Heroku CLI:
```powershell
heroku login
```

### Coach created but not showing in app
1. Wait 10-30 seconds for backend to refresh
2. Refresh the frontend page
3. Check that skills were added correctly
4. Verify the coach was created: `.\list-coaches.ps1` (if created)

## Next Steps

After creating coaches:
1. **Save the Firebase IDs** displayed after creation
2. **Refresh your app** to see the new coaches
3. **Test connections** between members and coaches
4. **Add profile pictures** later by updating the `profile_pic` column

## Future Enhancements

Potential scripts to add:
- `list-coaches.ps1` - List all coaches in database
- `delete-coach.ps1` - Remove a coach by ID
- `update-coach.ps1` - Update coach details
- `add-coach-skills.ps1` - Add skills to existing coach
