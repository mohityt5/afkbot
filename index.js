// afk-bot.js

const { execSync } = require('child_process');
const fs = require('fs');
const http = require('http');

// 🌐 Keep-alive web server for Render + UptimeRobot
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ BOT_BY_AMAN is running!\n');
}).listen(PORT, () => {
  console.log(`🌍 Web server running at http://localhost:${PORT}`);
});

// 📦 Auto-install mineflayer if missing
try {
  require.resolve('mineflayer');
} catch (e) {
  console.log('📦 Installing mineflayer...');
  execSync('npm install mineflayer', { stdio: 'inherit' });
}

const mineflayer = require('mineflayer');

let firstJoin = true;

function createBot() {
  const bot = mineflayer.createBot({
    host: '191.96.231.2',
    port: 10578,
    username: 'BOT_BY_AMAN'
  });

  const PASSWORD = 'Mishra@123';

  bot.on('spawn', () => {
    console.log('✅ Bot spawned on server');

    if (firstJoin) {
      setTimeout(() => bot.chat(`/register ${PASSWORD} ${PASSWORD}`), 2000);
      firstJoin = false;
    }

    setTimeout(() => bot.chat(`/login ${PASSWORD}`), 5000);
  });

  bot.on('end', () => {
    console.log('🔁 Disconnected. Reconnecting in 5s...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => {
    console.log('⚠️ Error:', err.message);
  });

  bot.on('kicked', reason => {
    console.log('🚫 Kicked from server:', reason);
  });
}

createBot();
