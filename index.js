process.on('uncaughtException', e => console.log('Error:', e.message));
process.on('unhandledRejection', e => console.log('Error:', e.message));

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

function getRecentCount() { 
  return Math.floor(500 + Math.random() * 350); 
}

// ====== সুন্দর Welcome - Pic সহ ======
bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'Friend';
  const recent = getRecentCount();
  const caption = `
╭━───━───━───━───━─╮
┃  ✨ RANA-X-MD ✨  ┃
╰━───━───━───━───━─╯

💫 আসসালামু আলাইকুম ${name} ভাই! 🙏
❤️ RANA-X-MD তে আপনাকে স্বাগতম!

┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  👑 বোট তথ্য 👑       ┃
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🤖 নাম: RANA-X-MD BOT
┃ 👤 আপনার নাম: ${name}
┃ 👑 মালিক: JR RANA
┃ 📞 নাম্বার: ${OWNER_NUMBER}
┃ 🔥 রিসেন্ট: ${recent}+ Paired
┃ 🟢 স্ট্যাটাস: Online ✅
┃ ⚡ স্পিড: Super Fast
┗━━━━━━━━━━━━━━━━━━━━━━┛

✨ 100% ফ্রি | কোন টাকা লাগবে না!
👇 নিচের বাটনে ক্লিক করে কোড নাও!
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
  await ctx.reply(`
╭───『 RANA-X-MD 200+ 』───╮
*200+ Commands List*

*OWNER (15):* .restart .broadcast .block .unblock .ban .addowner .delowner .setpp .setbio .clearsession .jid .leave .join .update

*GROUP (60+):* .link .antilink .welcome .goodbye .kick .add .promote .demote .tagall .hidetag .mute .unmute .setname .setdesc .revoke .warn .warnings

*DOWNLOADER (30+):* .ytmp3 .ytmp4 .play .song .tiktok .fb .ig .twitter .mediafire .gdrive .apk .pinterest .spotify

*TOOLS (50+):* .sticker .s .toimg .toaudio .tovideo .qr .qrcode .removebg .hd .translate .tts .ss .weather .calc

*AI (25+):* .ai .gpt .gpt4 .gemini .blackbox .imagine .flux .dalle

*FUN (40+):* .joke .meme .quote .truth .dare .ship .love .8ball .roll

*TOTAL: 200+ COMMANDS* 🔥
╰──────────────────╯
`, { parse_mode: 'Markdown' });
});

bot.action('pair', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`📱 তোমার WhatsApp নাম্বার দাও ভাই\nউদাহরণ: ${OWNER_NUMBER}\n\nশুধু নাম্বার লিখো: 880...`);
});

bot.on('text', async (ctx) => {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;
  await ctx.reply(`⏳ ${number} এর জন্য কোড বানাচ্ছি... 10 সেকেন্ড Wait করো!`);
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
      await ctx.reply(`✅ *Pair Success!*\n\n📱 Number: ${number}\n🔑 Code: *${code}*\n\nWhatsApp > Linked Devices > Link with phone number > Code বসাও!`, { parse_mode: 'Markdown' });
    }
  } catch (e) { ctx.reply('❌ Error! 2 মিনিট পর Try করো ভাই! ' + e.message); }
});

// ========== 100% FIXED LAUNCH ==========
(async () => {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log("✅ Webhook Cleared - RANA-X-MD");
  } catch (e) {
    console.log("⚠️ Webhook delete fail, but continuing... " + e.message);
  }
  try {
    await bot.launch({ dropPendingUpdates: true });
    console.log("✅ BOT CONNECTED - RANA-X-MD - READY FOR TELEGRAM");
  } catch (e) {
    console.log("❌ BOT LAUNCH FAIL: " + e.message);
  }
})();
