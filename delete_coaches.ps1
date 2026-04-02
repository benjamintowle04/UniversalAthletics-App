 = '{ skills:[],location:}'
try {
   = Invoke-RestMethod -Uri 'https://ua-backend-app-cb2d657adc39.herokuapp.com/api/coaches/sort' -Method POST -Body  -ContentType 'application/json' -UseBasicParsing
} catch {
  Write-Output ERROR fetching coaches: 
 exit 1
}
if (-not ) { Write-Output 'No coaches found'; exit 0 }
=0
foreach ( in ) {
 = | ConvertTo-Json -Compress
 Write-Output Coach: 
 try {
 = Invoke-RestMethod -Uri (https://ua-backend-app-cb2d657adc39.herokuapp.com/api/coaches/delete/ + .firebaseID) -Method POST -UseBasicParsing -ErrorAction Stop
 Write-Output (Deleted  + .firebaseID +  ->  + )
 ++
 } catch {
 Write-Output ( Failed  + .firebaseID +  :  + )
 }
}
Write-Output ( Deleted total:  + )
