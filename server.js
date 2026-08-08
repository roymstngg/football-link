const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const previewPath = path.join(__dirname, 'preview', 'index.html');

const server = http.createServer((req, res) => {
  fs.readFile(previewPath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Preview dosyasi okunamadi.');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`⚽ Football Link Canli Uygulama Sunucusu Baslatildi!`);
  console.log(`👉 Bilgisayarda: http://localhost:${PORT}`);
  console.log(`👉 Ayni Wi-Fi Ağındaki Telefonlarda: http://192.168.1.108:${PORT}`);
  console.log(`👉 Genel Internet Linki (Her Yerden): https://quick-lamps-admire.loca.lt`);
  console.log(`==================================================\n`);
});
