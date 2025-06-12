const { execSync } = require('child_process');
const fs = require('fs');

// 💥 Install mineflayer if not installed
try {
  require.resolve('mineflayer');
} catch (e) {
  console.log('📦 mineflayer not found. Installing...');
  execSync('npm install mineflayer', { stdio: 'inherit' });
}

// ✅ Now require it
const mineflayer = require('mineflayer');

// 🤖 Bot setup
function createBot() {
  const bot = mineflayer.createBot({
    host: '191.96.231.2',
    port: 10578,
    username: 'AFK_BOT_123'
  });

  const PASSWORD = 'password123';

  bot.on('spawn', () => {
    console.log('✅ Bot spawned');

    setTimeout(() => bot.chat(`/register ${PASSWORD} ${PASSWORD}`), 2000);
    setTimeout(() => bot.chat(`/login ${PASSWORD}`), 5000);
  });

  bot.on('end', () => {
    console.log('🔁 Reconnecting in 5s...');
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
