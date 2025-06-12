const { execSync } = require('child_process');
const fs = require('fs');
const http = require('http');

// 🔁 Keep-alive server for Render or VPS
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AFK Bot is alive\n');
}).listen(process.env.PORT || 3000, () => {
  console.log(`🌐 Server running on port ${process.env.PORT || 3000}`);
});

// 📦 Install mineflayer if not installed
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
    console.log('✅ Bot spawned');

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
    console.log('🚫 Kicked:', reason);
  });
}

createBot();
