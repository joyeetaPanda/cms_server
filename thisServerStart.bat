@echo off

REM Change to server bin folder (handle spaces in path)
cd /d "C:\Users\Joyeeta Brahmachary\KRC\server\bin" || (
    echo ERROR: Cannot change directory! Check the path.
    pause
    exit /b
)

REM Ensure logs folder exists
if not exist "C:\Users\Joyeeta Brahmachary\KRC\server\logs" (
    mkdir "C:\Users\Joyeeta Brahmachary\KRC\server\logs"
)

REM Define log file (overwrite each time)
set "LOGFILE=C:\Users\Joyeeta Brahmachary\KRC\server\logs\server.log"

REM Start Node.js server and append logs
echo Starting Node server... Logs are in %LOGFILE%
node www >> "%LOGFILE%" 2>&1

REM Keep terminal open
pause
