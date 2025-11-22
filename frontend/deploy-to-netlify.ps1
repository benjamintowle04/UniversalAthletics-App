# Deploy script for frontend -> Netlify
# Usage: run this script from PowerShell (it will run in the frontend folder).
# Requirements:
#  - Node/npm installed
#  - (Optional) netlify CLI available via `npx netlify` or installed globally
#  - If you want non-interactive deploys, set env var NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "Working directory: $(Get-Location)"

Write-Host "1) Installing dependencies (npm ci --legacy-peer-deps)"
npm ci --legacy-peer-deps

Write-Host "2) Building production web assets (npm run build)"
npm run build

$buildDir = Join-Path $scriptDir 'web-build'
if (-Not (Test-Path $buildDir)) {
    Write-Error "Build output not found at $buildDir"
    exit 1
}

# Deploy with Netlify CLI if available
try {
    $null = npx --no-install netlify --version 2>$null
    $hasNetlify = $true
} catch {
    $hasNetlify = $false
}

if ($hasNetlify) {
    Write-Host "3) Deploying to Netlify using npx netlify deploy --prod --dir=web-build"
    $siteArg = @()
    if ($env:NETLIFY_SITE_ID) { $siteArg += "--site"; $siteArg += $env:NETLIFY_SITE_ID }
    npx netlify deploy --prod --dir=web-build --message "Deploy from script $(Get-Date -Format o)" @siteArg
    if ($LASTEXITCODE -ne 0) { Write-Error "Netlify deploy failed (exit code $LASTEXITCODE)"; exit $LASTEXITCODE }
    Write-Host "Netlify deploy finished successfully."
} else {
    Write-Warning "Netlify CLI not found (npx netlify). The build is ready in web-build/.
To deploy manually, either install the Netlify CLI: `npm i -g netlify-cli` and run this script again,
or run: `npx netlify deploy --prod --dir=web-build` (you will be prompted for site if not set).
To do non-interactive deploys, set NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID as environment variables before running the script."
}

Write-Host "Done."