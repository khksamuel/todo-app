@echo off
setlocal

set "PROJECT_ROOT=%~dp0"

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
