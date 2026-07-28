@echo off
chcp 949 >nul
cd /d "%~dp0"

echo.
echo ==========================================
echo    아라의 영어 놀이터 - 로컬 미리보기
echo ==========================================
echo.

where python >nul 2>&1
if errorlevel 1 (
  echo [오류] python을 찾을 수 없어요.
  echo 이 컴퓨터에서는 로컬 미리보기가 어렵습니다.
  echo.
  pause
  exit /b 1
)

echo 잠시 후 브라우저가 자동으로 열립니다.
echo 페이지가 안 보이면 새로고침(F5) 을 한 번 눌러 주세요.
echo.
echo   *** 다 본 뒤에는 이 검은 창을 닫으면 종료됩니다 ***
echo.

start "" /b cmd /c "timeout /t 2 >nul & explorer http://127.0.0.1:8899/index.html"

python -m http.server 8899 --bind 127.0.0.1

echo.
echo 서버가 종료되었습니다. (포트 8899가 이미 쓰이면 창을 모두 닫고 다시 실행하세요)
pause
