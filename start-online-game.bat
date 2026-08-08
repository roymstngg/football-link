@echo off
title Football Link - Online Server & Public Tunnel Manager
chcp 65001 > nul
cls

echo ======================================================================
echo ⚽ FOOTBALL LINK - CANLI ONLINE SUNUCU BAŞLATICI
echo ======================================================================
echo.
echo [1/3] Backend Sunucusu Başlatılıyor (NestJS, Port 3000)...
start "Football Link Backend (Port 3000)" cmd /c "cd /d c:\Users\suley\OneDrive\Masaüstü\futboll\backend && npm run start"

echo.
echo [2/3] Web Sunucusu Başlatılıyor (Port 8080)...
start "Football Link Web Server (Port 8080)" cmd /c "cd /d c:\Users\suley\OneDrive\Masaüstü\futboll && node server.js"

timeout /t 5 /nobreak > nul

echo.
echo [3/3] Trabzon ve Tüm Dünya İçin Canlı İnternet Tüneli Açılıyor...
echo.
echo ======================================================================
echo 🌐 TRABZON'DAKİ ARKADAŞINIZA GÖNDERECEĞİNİZ CANLI LİNK:
echo ======================================================================
call npx -y localtunnel --port 3000

pause
