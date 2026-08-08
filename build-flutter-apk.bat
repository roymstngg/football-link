@echo off
echo ==================================================
echo ⚽ Football Link Native Flutter APK Derleyici
echo ==================================================
echo.
set "JAVA_HOME=C:\Program Files\Java\jdk-24"
cd /d "c:\Users\suley\OneDrive\Masaüstü\futboll\futboll_flutter"
echo [1/2] Bağımlılıklar kontrol ediliyor...
call flutter pub get
echo.
echo [2/2] Native Flutter Android APK derleniyor...
call flutter build apk --debug
echo.
echo ==================================================
echo 🎉 İŞLEM TAMAMLANDI!
echo 📱 Oluşturulan Native APK Dosyası:
echo c:\Users\suley\OneDrive\Masaüstü\futboll\futboll_flutter\build\app\outputs\flutter-apk\app-debug.apk
echo ==================================================
pause
