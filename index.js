const { execSync } = require('child_process');
const fs = require('fs');
const http = require('http');

// 📦 Auto-install all required plugins
const deps = [
  'mineflayer',
  'mineflayer-pathfinder',
  'mineflayer-auto-eat',
  'mineflayer-collectblock',
  'mineflayer-tool',
  'mineflayer-pvp',
];
for (const pkg of deps) {
  try {
    require.resolve(pkg);
  } catch (e) {
    console.log(`📦 Installing ${pkg}...`);
    execSync(`npm install ${pkg}`, { stdio: 'inherit' });
  }
}

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const autoeat = require('mineflayer-auto-eat');
const collectBlock = require('mineflayer-collectblock').plugin;
const tool = require('mineflayer-tool').plugin;
const pvp = require('mineflayer-pvp').plugin;

// 🧠 Logs
let logs = [];
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  logs.push(line);
  if (logs.length > 100) logs.shift();
}

let bot;
let firstJoin = true;
const PASSWORD = 'Mishra@123';

// 🤖 Bot setup
function createBot() {
  bot = mineflayer.createBot({
    host: '191.96.231.2',
    port: 10578,
    username: 'BOT_BY_AMAN',
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(autoeat.plugin); // ✅ FIXED
  bot.loadPlugin(collectBlock);
  bot.loadPlugin(tool);
  bot.loadPlugin(pvp);

  bot.once('spawn', () => {
    log('✅ Bot spawned!');

    // Setup movement
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    // Register and Login
    if (firstJoin) {
      setTimeout(() => bot.chat(`/register ${PASSWORD} ${PASSWORD}`), 2000);
      firstJoin = false;
    }
    setTimeout(() => bot.chat(`/login ${PASSWORD}`), 5000);
  });

  bot.on('end', () => {
    log('🔁 Disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', e => log(`❌ Error: ${e.message}`));
  bot.on('kicked', r => log(`🚫 Kicked: ${r}`));

  // 💬 In-game chat commands
  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;

    if (message === 'come') {
      const player = bot.players[username]?.entity;
      if (player) {
        log(`👣 Walking to ${username}`);
        bot.pathfinder.setGoal(new goals.GoalFollow(player, 1));
      }
    }

    if (message.startsWith('mine ')) {
      const blockName = message.split(' ')[1];
      const mcData = require('minecraft-data')(bot.version);
      const blockType = mcData.blocksByName[blockName];
      if (!blockType) return bot.chat(`Unknown block: ${blockName}`);

      const block = bot.findBlock({
        matching: blockType.id,
        maxDistance: 32,
      });

      if (!block) return bot.chat('Block not found nearby');

      await bot.collectBlock.collect(block);
      log(`⛏️ Mined ${blockName} for ${username}`);
    }

    if (message === 'eat') {
      bot.autoEat.enable();
      bot.chat('🍗 Eating now...');
    }

    if (message.startsWith('attack ')) {
      const targetName = message.split(' ')[1];
      const target = bot.players[targetName]?.entity;
      if (target) {
        bot.pvp.attack(target);
        log(`⚔️ Attacking ${targetName}`);
      } else {
        bot.chat('❌ Target not found');
      }
    }

    if (message === 'stop') {
      bot.pvp.stop();
      bot.pathfinder.setGoal(null);
      bot.chat('🛑 Stopping actions');
    }
  });
}

createBot();

// 🌐 Web UI for logs and command input
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>BOT_BY_AMAN Console</title>
        <style>
          body { background: #111; color: #0f0; font-family: monospace; padding: 20px; }
          #log { background: #000; padding: 10px; border: 1px solid #0f0; height: 60vh; overflow-y: scroll; white-space: pre-wrap; }
          input, button { padding: 6px; margin-top: 10px; background: #222; color: #0f0; border: 1px solid #0f0; }
        </style>
      </head>
      <body>
        <h2>BOT_BY_AMAN Status Console</h2>
        <div id="log">Loading...</div>
        <input type="text" id="cmd" placeholder="Enter command (e.g. /tp Aman)" />
        <button onclick="sendCmd()">Send</button>
        <script>
          async function loadLog() {
            const res = await fetch('/logs');
            document.getElementById('log').innerText = await res.text();
          }
          async function sendCmd() {
            const val = document.getElementById('cmd').value;
            await fetch('/command', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: val })
            });
            document.getElementById('cmd').value = '';
          }
          setInterval(loadLog, 1000);
          loadLog();
        </script>
      </body>
      </html>
    `);
  } else if (req.url === '/logs') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(logs.join('\n'));
  } else if (req.url === '/command' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { command } = JSON.parse(body);
        if (bot && bot.chat) {
          bot.chat(command);
          log(`📤 Sent: ${command}`);
        }
      } catch (e) {
        log(`❌ Command error: ${e.message}`);
      }
      res.writeHead(200);
      res.end('OK');
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => log(`🌍 Web panel live at http://localhost:${PORT}`));
