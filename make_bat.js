const fs = require('fs');

const lines = [
  '@echo off',
  'title Football Link Server',
  'color 0a',
  'cls',
  'echo ========================================================',
  'echo    FOOTBALL LINK CANLI SUNUCU BASLATICI',
  'echo ========================================================',
  'echo.',
  'echo 1/3 Eski takili kalan sunucu islemleri temizleniyor...',
  'call npx -y kill-port 3000 8080 >nul 2>&1',
  'echo 2/3 Sunucular baslatiliyor...',
  'start "Backend" cmd /k "cd /d C:\\Users\\suley\\OneDrive\\MASAST~1\\futboll\\backend && npm run build && node dist/main.js"',
  'start "WebServer" cmd /k "cd /d C:\\Users\\suley\\OneDrive\\MASAST~1\\futboll && node server.js"',
  'echo 3/3 Canli Internet Tuneli Baglaniyor (localtunnel)...',
  'call npx -y localtunnel --port 3000 --subdomain footballlinklive3000',
  'echo.',
  'echo Tunel kapandi.',
  'pause'
];

const content = lines.join('\r\n') + '\r\n';

fs.writeFileSync('C:/Users/suley/OneDrive/Masaüstü/SUNUCU_BASLAT.cmd', content, 'latin1');
fs.writeFileSync('C:/Users/suley/OneDrive/Masaüstü/SUNUCUYU_BASLAT.bat', content, 'latin1');
console.log('BATCH FILES CREATED WITH LATIN1 ANSI ENCODING!');
