# 🛌 Minecraft AFK Bot for Aternos Servers

Stay online 24/7 in any cracked Minecraft server (like Aternos) using this Node.js-based AFK bot powered by `mineflayer`.

✅ Auto-registers using LoginSecurity  
✅ Auto-logins after reconnect  
✅ Auto-reconnects if kicked or disconnected  
✅ 100% FREE using [Render](https://render.com)

---

### 👑 Created by: [@iamgunpoint69](https://www.youtube.com/@iamgunpoint69)

Subscribe on YouTube for more Minecraft bots, hacks, and plugins!

---

## 🚀 How to Deploy this Bot on Render (100% FREE)

### 🔧 Step-by-step Instructions:

#### 1. **Create a Render Account**
👉 Go to [https://render.com](https://render.com)  
👉 Click **"Sign Up"** and connect your GitHub account

#### 2. **Fork this Repo**
Click the **"Fork"** button (top-right) on GitHub to create your own copy of this repo.

#### 3. **Edit Bot Settings**
Go to `afk_bot.js` in your forked repo and edit this section:

```js
const bot = mineflayer.createBot({
  host: 'YOUR.SERVER.IP',
  port: YOUR_PORT,
  username: 'BOT_USERNAME'
});

const PASSWORD = 'YourPassword123';
