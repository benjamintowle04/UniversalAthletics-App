@echo off
REM Wrapper to run the PowerShell deploy script from Windows Explorer or cmd
SETLOCAL
PUSHD %~dp0
powershell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0deploy-to-netlify.ps1'"
POPD
ENDLOCAL
