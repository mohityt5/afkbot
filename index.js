const { execSync } = require('child_process');
const fs = require('fs');
const http = require('http');

// 📦 Auto-install mineflayer if missing
try {
  require.resolve('mineflayer');
} catch (e) {
  console.log('📦 Installing mineflayer...');
  execSync('npm install mineflayer', { stdio: 'inherit' });
}

const mineflayer = require('mineflayer');

// 🧠 Bot logs buffer
let logs = [];
function log(msg) {
  const time = new Date().toISOString();
  const entry = `[${time}] ${msg}`;
  console.log(entry);
  logs.push(entry);
  if (logs.length > 100) logs.shift(); // keep last 100 lines
}

// ✅ Create bot
let bot;
let firstJoin = true;
const PASSWORD = 'Mishra@123';

function createBot() {
  bot = mineflayer.createBot({
    host: 'Mohit4457.aternos.me',
    port:  22474,
    username: 'powermc✅',
  });

  bot.on('spawn', () => {
    log('✅ Bot spawned on server');
    if (firstJoin) {
      setTimeout(() => bot.chat(`/register ${PASSWORD} ${PASSWORD}`), 2000);
      firstJoin = false;
    }
    setTimeout(() => bot.chat(`/login ${PASSWORD}`), 5000);
  });

  bot.on('end', () => {
    log('🔁 Disconnected. Reconnecting in 1s...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => log(`⚠️ Error: ${err.message}`));
  bot.on('kicked', reason => log(`🚫 Kicked: ${reason}`));
}

createBot();

// 🌐 Web server
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  if (req.url === '/') {
    // 🌐 HTML Page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>BOT_BY_AMAN Console</title>
        <style>
          body { background: #111; color: #0f0; font-family: monospace; padding: 20px; }
          h2 { margin-bottom: 10px; }
          #log { background: #000; padding: 10px; border: 1px solid #0f0; height: 60vh; overflow-y: scroll; white-space: pre-wrap; }
          #form { margin-top: 15px; }
          input[type=text] { width: 80%; padding: 6px; background: #222; color: #0f0; border: 1px solid #0f0; }
          button { padding: 6px 10px; background: #0f0; color: #000; border: none; }
        </style>
      </head>
      <body>
        <h2>BOT_BY_AMAN Status</h2>
        <div id="log">Loading logs...</div>

        <form id="form">
          <input type="text" id="command" placeholder="Enter command (e.g. /tp Aman)" />
          <button type="submit">Send</button>
        </form>

        <script>
          async function fetchLogs() {
            const res = await fetch('/logs');
            const txt = await res.text();
            document.getElementById('log').innerText = txt;
          }
          setInterval(fetchLogs, 1000);
          fetchLogs();

          document.getElementById('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const cmd = document.getElementById('command').value.trim();
            if (cmd.length === 0) return;
            await fetch('/command', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: cmd })
            });
            document.getElementById('command').value = '';
          });
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
          log(`📤 Sent command: ${command}`);
        } else {
          log(`❌ Bot not ready`);
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
}).listen(PORT, () => {
  log(`🌍 Web server running at http://localhost:${PORT}`);
});
