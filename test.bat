@echo off
setlocal

set "PROJECT_ROOT=%~dp0"

echo Running backend tests...
pushd "%PROJECT_ROOT%todo-api" || exit /b 1
call gradlew.bat test
if errorlevel 1 (
    echo Backend tests failed.
    popd
    exit /b 1
)
popd

echo Running frontend tests...
pushd "%PROJECT_ROOT%todo-web" || exit /b 1
if not exist "node_modules" (
    call npm ci
    if errorlevel 1 (
        echo Frontend dependency installation failed.
        popd
        exit /b 1
    )
)
call npm test -- --runInBand
if errorlevel 1 (
    echo Frontend tests failed.
    popd
    exit /b 1
)
popd

echo All project tests passed.
endlocal
exit /b 0
