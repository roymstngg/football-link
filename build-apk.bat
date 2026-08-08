@echo off
chcp 65001 > nul
echo ==================================================
echo ⚽ Football Link Native Flutter APK Derleyici
echo ==================================================
echo.
set "JAVA_HOME=C:\Program Files\Java\jdk-24"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0futboll_flutter"
echo [1/2] Bağımlılıklar kontrol ediliyor...
call flutter pub get
echo.
echo [2/2] Native Flutter Android APK derleniyor...
call flutter build apk --debug
echo.
echo ==================================================
echo 🎉 İŞLEM TAMAMLANDI!
echo 📱 Oluşturulan Native APK Dosyası:
echo %~dp0futboll_flutter\build\app\outputs\flutter-apk\app-debug.apk
echo ==================================================
pause
