# Script to fetch and display skills from the API
# Usage: .\show-skills.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Universal Athletics - Available Skills" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Fetching skills from API..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri 'https://ua-backend-app-cb2d657adc39.herokuapp.com/api/skills' -Method GET
    $skills = $response.Content | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Available Skills ($($skills.Count) total)" -ForegroundColor Green  
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Display in formatted columns
    Write-Host ("{0,-5} {1,-20} {2}" -f "ID", "Skill Name", "Icon") -ForegroundColor Cyan
    Write-Host ("{0,-5} {1,-20} {2}" -f "----", "--------------------", "----") -ForegroundColor Cyan
    
    foreach ($skill in $skills | Sort-Object skill_id) {
        $id = $skill.skill_id.ToString().PadLeft(2)
        $title = $skill.title
        $icon = if ($skill.icon) { $skill.icon } else { "-" }
        Write-Host ("{0,-5} {1,-20} {2}" -f $id, $title, $icon) -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Usage Examples:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Single skill:" -ForegroundColor White
    Write-Host "  .\insert-coach.ps1 -FirstName 'John' -LastName 'Doe' -Email 'jdoe@coach.com' -Phone '5551234567' -Skills '1'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Multiple skills:" -ForegroundColor White
    Write-Host "  .\insert-coach.ps1 -FirstName 'Jane' -LastName 'Smith' -Email 'jsmith@coach.com' -Phone '5559876543' -Skills '1,2,3'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Interactive mode (will prompt for skills):" -ForegroundColor White
    Write-Host "  .\insert-coach.ps1" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "ERROR: Failed to fetch skills from API" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common Skills (may not be complete):" -ForegroundColor Yellow
    Write-Host "  1  - basketball"
    Write-Host "  2  - soccer"
    Write-Host "  3  - tennis"
    Write-Host "  4  - swimming"
    Write-Host "  5  - track & field"
    Write-Host "  6  - football"
    Write-Host "  7  - baseball"
    Write-Host "  8  - volleyball"
    exit 1
}
