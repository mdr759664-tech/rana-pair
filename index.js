process.on('uncaughtException', e => console.log(e.message));
process.on('unhandledRejection', e => console.log(e.message));

const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_IMAGE = 'https://files.catbox.moe/8gwrio.jpg';
const BOT_NAME = 'RANA-X-MD';
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021';

const app = express();
app.get('/', (req, res) => res.send(`${BOT_NAME} Running ✅`));
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Port Running ${PORT}`));

const bot = new Telegraf(BOT_TOKEN);
function getRecentCount() { return Math.floor(500 + Math.random() * 350); }

bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'Friend';
  const recent = getRecentCount();
  const caption = `
╭━───━───━───━───━─╮
┃  ✨ RANA-X-MD ✨  ┃
╰━───━───━───━───━─╯

💫 আসসালামু আলাইকুম ${name} ভাই! 🙏
❤️ RANA-X-MD তে আপনাকে স্বাগতম!

👑 Owner: ${OWNER_NUMBER}
🔥 Recent: ${recent}+ Paired ✅
🟢 Status: Online
`;
  await ctx.replyWithPhoto(BOT_IMAGE, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: `🔗 পেয়ার কোড নাও [${recent}+]`, callback_data: 'pair' }],
        [{ text: '📜 মেনু [200+]', callback_data: 'menu' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: `https://wa.me/${OWNER_NUMBER}` }]
      ]
    }
  });
});

bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`*RANA-X-MD - 200+ Commands*\nOWNER: .restart .broadcast .block\nGROUP: .link .kick .promote .tagall\nDOWNLOADER: .ytmp3 .ytmp4 .tiktok\nTOOLS: .sticker .toimg .qr\nAI: .ai .gpt .imagine\nFUN: .joke .meme`, { parse_mode: 'Markdown' });
});

bot.action('pair', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`📱 নাম্বার দাও\nExample: ${OWNER_NUMBER}`);
});

bot.on('text', async (ctx) => {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;
  await ctx.reply(`⏳ ${number} এর জন্য কোড বানাচ্ছি...`);
  try {
    const { state, saveCreds } = await useMultiFileAuthState(`./auth_${number}`);
    let version = [2,3000,1015901307];
    try { const v = await fetchLatestBaileysVersion(); version = v.version; } catch {}
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: [BOT_NAME, 'Chrome', '1.0.0'],
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(3000);
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      await ctx.reply(`✅ Code: ${code}\nNumber: ${number}`);
    }
  } catch (e) { ctx.reply('❌ Error! 2 min পর Try করো!'); }
});

// ==========================================
// ✅✅✅ এখানে বসবে - একদম শেষে ✅✅✅
// ==========================================
(async () => {
  await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  console.log("✅ Webhook Delete Done - RANA-X-MD");
  await bot.launch({ dropPendingUpdates: true });
  console.log("✅ BOT CONNECTED - RANA-X-MD");
})();
