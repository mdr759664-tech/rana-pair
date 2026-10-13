process.on('uncaughtException', function(e) {
  console.log('Error:', e.message);
});
process.on('unhandledRejection', function(e) {
  console.log('Error:', e.message);
});

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
app.get('/', function(req, res) {
  res.send(BOT_NAME + ' Running ✅');
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', function() {
  console.log('✅ Port Running ' + PORT);
});

const bot = new Telegraf(BOT_TOKEN);

bot.start(async function(ctx) {
  const name = ctx.from.first_name || 'Friend';
  const caption = `
╭━━━━━━━━━━━━━━━━━━╮
┃  ✨ RANA-X-MD ✨  ┃
╰━━━━━━━━━━━━━━━━━━╯

💫 আসসালামু আলাইকুম ${name} ভাই! 🙏
❤️ RANA-X-MD তে স্বাগতম!

┏━━━━━━━━━━━━━━━━━━━━┓
┃  👑 বোট তথ্য 👑     ┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🤖 নাম: RANA-X-MD
┃ 👤 ইউজার: ${name}
┃ 👑 মালিক:♥︎‿♥︎𝗥𝗔𝗡𝗔-MD BOT
┃ 📞 নাম্বার: ${OWNER_NUMBER}
┃ 🟢 স্ট্যাটাস: Active ✅
┃ ⚡ স্পিড: Ultra Fast
┗━━━━━━━━━━━━━━━━━━━━┛

👇 নিচের বাটন থেকে Pair Code নাও! 🔥
`;

  await ctx.replyWithPhoto(BOT_IMAGE, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔗 পেয়ার কোড নাও', callback_data: 'pair' }],
        [{ text: '📜 মেনু [200+]', callback_data: 'menu' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: 'https://wa.me/' + OWNER_NUMBER }]
      ]
    }
  });
});

bot.action('menu', async function(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(`
╭───『 RANA-X-MD 200+ 』───╮

🔥 *RANA-X-MD 200+ COMMANDS* 🔥

*👑 OWNER (15):*
.restart .broadcast .block .unblock .ban .addowner .delowner .setpp .setbio

*👥 GROUP (60+):*
.link .antilink .welcome .goodbye .kick .add .promote .demote .tagall .hidetag .mute .unmute .setname .setdesc .revoke

*📥 DOWNLOADER (30+):*
.ytmp3 .ytmp4 .play .song .tiktok .fb .ig .twitter .mediafire .gdrive .apk

*🛠️ TOOLS (50+):*
.sticker .s .toimg .toaudio .tovideo .qr .removebg .hd .translate .tts .ss .weather .calc

*🤖 AI (25+):*
.ai .gpt .gpt4 .gemini .blackbox .imagine .flux .dalle

*😂 FUN (40+):*
.joke .meme .quote .truth .dare .ship .love .8ball

*TOTAL: 200+ COMMANDS AVAILABLE*

╰──────────────────╯
`, { parse_mode: 'Markdown' });
});

bot.action('pair', async function(ctx) {
  await ctx.answerCbQuery();
  ctx.reply('📱 তোমার WhatsApp নাম্বার দাও ভাই\nউদাহরণ: ' + OWNER_NUMBER + '\nশুধু নাম্বার লিখো: 8801XXXXXXXXX');
});

bot.on('text', async function(ctx) {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;
  await ctx.reply('⏳ ' + number + ' এর জন্য কোড বানাচ্ছি... 10 সেকেন্ড Wait করো ভাই!');
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_' + number);
    let version = [2, 3000, 1015901307];
    try { const v = await fetchLatestBaileysVersion(); version = v.version; } catch {}
    const sock = makeWASocket({
      version: version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: [BOT_NAME, 'Chrome', '1.0.0'],
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(3000);
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      await ctx.reply('✅ *Pair Success!*\n\n📱 Number: ' + number + '\n🔑 Code: *' + code + '*\n\nWhatsApp > Linked Devices > Link with phone number এ Code বসাও!', { parse_mode: 'Markdown' });
    }
  } catch (e) { ctx.reply('❌ Error! 2 মিনিট পর Try করো! ' + e.message); }
});

(async function() {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log('✅ Webhook Cleared - RANA-X-MD');
  } catch (e) { console.log('⚠️ Webhook: ' + e.message); }
  try {
    await bot.launch({ dropPendingUpdates: true });
    console.log('✅ BOT CONNECTED - RANA-X-MD - READY');
  } catch (e) { console.log('❌ LAUNCH FAIL: ' + e.message); }
})();
