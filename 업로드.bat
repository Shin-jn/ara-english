@echo off
chcp 949 >nul
cd /d "%~dp0"

echo.
echo ==========================================
echo    아라의 영어 놀이터 - GitHub 업로드
echo ==========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [오류] 여기는 git 저장소가 아니에요.
  echo 이 파일이 'sight words' 폴더 안에 있는지 확인해 주세요.
  echo.
  pause
  exit /b 1
)

echo 변경된 내용을 확인하는 중...
git add -A

git diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo 바뀐 내용이 없어요. 올릴 것이 없습니다.
  echo.
  pause
  exit /b 0
)

echo.
echo [ 바뀐 파일 ]
git --no-pager diff --cached --name-status
echo.

set "MSG=내용 업데이트"
set "INPUT="
set /p "INPUT=무엇을 바꿨나요? (그냥 Enter 누르면 '내용 업데이트'): "
set "CHK=%INPUT: =%"
if not "%CHK%"=="" set "MSG=%INPUT%"

echo.
echo 저장하는 중... ("%MSG%")
git commit -m "%MSG%"
if errorlevel 1 (
  echo.
  echo [오류] 저장(커밋)에 실패했어요. 위 메시지를 확인해 주세요.
  echo.
  pause
  exit /b 1
)

echo.
echo GitHub로 올리는 중...
git push
if errorlevel 1 (
  echo.
  echo [오류] 업로드에 실패했어요.
  echo 인터넷 연결을 확인하거나, 위 메시지를 캡처해서 물어보세요.
  echo.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo   업로드 완료!
echo   1~2분 뒤 사이트에 자동 반영됩니다.
echo   https://araenglish.netlify.app/
echo ==========================================
echo.
pause
