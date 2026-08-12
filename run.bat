@echo off
setlocal

set "PROJECT_ROOT=%~dp0"

if /I "%~1"=="demo" (
    call :runDemoDatabaseSetup
    if errorlevel 1 exit /b 1
)

echo Building Todo API...
pushd "%PROJECT_ROOT%todo-api" || exit /b 1
call gradlew.bat build
if errorlevel 1 (
    echo API build failed.
    popd
    exit /b 1
)
popd

echo Installing web dependencies...
pushd "%PROJECT_ROOT%todo-web" || exit /b 1
if not exist "node_modules" (
    call npm ci
    if errorlevel 1 (
        echo Web dependency installation failed.
        popd
        exit /b 1
    )
)

echo Building Todo Web...
call npm run build
if errorlevel 1 (
    echo Web build failed.
    popd
    exit /b 1
)
popd

echo Starting Todo API and Todo Web in separate windows...
start "Todo API" cmd /k "cd /d ""%PROJECT_ROOT%todo-api"" && call gradlew.bat bootRun"
start "Todo Web" cmd /k "cd /d ""%PROJECT_ROOT%todo-web"" && call npm run dev"

echo.
echo Todo API: http://localhost:8080
echo Todo Web: check the Todo Web window for its Vite URL.

endlocal
goto :eof

:runDemoDatabaseSetup
setlocal
set "ENV_FILE=%PROJECT_ROOT%todo-api\.env"

if not exist "%ENV_FILE%" (
    echo Demo database setup failed: todo-api\.env was not found.
    echo Copy todo-api\.env.example to todo-api\.env and add your MySQL credentials.
    exit /b 1
)

set "MYSQL_EXE="
where mysql >nul 2>&1
if not errorlevel 1 set "MYSQL_EXE=mysql"

if not defined MYSQL_EXE (
    for /d %%D in ("C:\Program Files\MySQL\MySQL Server *") do (
        if not defined MYSQL_EXE if exist "%%~fD\bin\mysql.exe" set "MYSQL_EXE=%%~fD\bin\mysql.exe"
    )
)

if not defined MYSQL_EXE if exist "C:\Program Files\MySQL\MySQL Workbench 8.0 CE\mysql.exe" set "MYSQL_EXE=C:\Program Files\MySQL\MySQL Workbench 8.0 CE\mysql.exe"

if not defined MYSQL_EXE (
    echo Demo database setup failed: the MySQL command-line client is not on PATH.
    echo Install MySQL Shell/Client, add it to PATH, or set MYSQL_EXE in this script.
    exit /b 1
)

for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%ENV_FILE%") do (
    if not "%%A"=="" set "%%A=%%B"
)

if not defined DB_URL (
    echo Demo database setup failed: DB_URL is missing from todo-api\.env.
    exit /b 1
)

if not defined DB_USERNAME (
    echo Demo database setup failed: DB_USERNAME is missing from todo-api\.env.
    exit /b 1
)

set "MYSQL_URL=%DB_URL:jdbc:mysql://=%"
for /f "tokens=1,2 delims=/" %%A in ("%MYSQL_URL%") do (
    set "MYSQL_HOST_PORT=%%A"
    set "MYSQL_DATABASE=%%B"
)
for /f "tokens=1,2 delims=:" %%A in ("%MYSQL_HOST_PORT%") do (
    set "MYSQL_HOST=%%A"
    set "MYSQL_PORT=%%B"
)
if not defined MYSQL_PORT set "MYSQL_PORT=3306"

echo Running demo database setup...
"%MYSQL_EXE%" --protocol=TCP --host="%MYSQL_HOST%" --port="%MYSQL_PORT%" --user="%DB_USERNAME%" --password="%DB_PASSWORD%" < "%PROJECT_ROOT%todo-api\dbsetup.sql"
if errorlevel 1 (
    echo Demo database setup failed.
    exit /b 1
)

echo Loading demo data...
"%MYSQL_EXE%" --protocol=TCP --host="%MYSQL_HOST%" --port="%MYSQL_PORT%" --user="%DB_USERNAME%" --password="%DB_PASSWORD%" < "%PROJECT_ROOT%todo-api\seed.sql"
if errorlevel 1 (
    echo Demo data load failed.
    exit /b 1
)

endlocal
exit /b 0
