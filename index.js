process.on('uncaughtException', function(e) {
  console.log('Error:', e.message);
});
process.on('unhandledRejection', function(e) {
  console.log('Error:', e.message);
});

global.botName = "RANA-X-MD";
global.ownerName = "RANA";
global.channelLink = "https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021";
global.thumb = "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg";

const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_IMAGE = global.thumb;
const BOT_NAME = global.botName;
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = global.channelLink;

const app = express();
app.get('/', function(req, res) {
  res.send(BOT_NAME + ' Running ✅');
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', function() {
  console.log('✅ Port Running ' + PORT);
});

const bot = new Telegraf(BOT_TOKEN);

// One Tap Copy - Ok lekha asbe na, direct copy hobe
bot.action(/copy_(.*)/, async function(ctx){
  try{
    await ctx.answerCbQuery('✅ Copied: ' + ctx.match[1]);
  }catch{}
});

bot.start(async function(ctx) {
  const name = ctx.from.first_name || 'Friend';

  // User er DP ber kora
  let userPhoto = BOT_IMAGE;
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
    if (photos.total_count > 0) {
      const fileId = photos.photos[0][0].file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);
      userPhoto = fileLink.href;
    }
  } catch (e) {
    console.log('DP Error:', e.message);
    userPhoto = BOT_IMAGE;
  }

  const caption = `
╭━━━━━━━━━━━━━━━━━━╮
┃ ✨ ${BOT_NAME} ✨ ┃
╰━━━━━━━━━━━━━━━━━━╯

💫 আসসালামু আলাইকুম ${name} ভাই! 🙏
❤️ ${BOT_NAME} তে স্বাগতম!

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👑 বোট তথ্য 👑 ┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🤖 নাম: ${BOT_NAME}
┃ 👤 ইউজার: ${name}
┃ 👑 মালিক: ${global.ownerName}
┃ 📞 নাম্বার: ${OWNER_NUMBER}
┃ 🟢 স্ট্যাটাস: Active ✅
┃ ⚡ স্পিড: Ultra Fast
┗━━━━━━━━━━━━━━━━━━━━┛

🎉 500+ Emoji | 200+ Commands 🔥
👇 Pair Code নাও! 👇
`;

  await ctx.replyWithPhoto(userPhoto, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔗 পেয়ার কোড নাও', callback_data: 'pair' }],
        [{ text: '📜 মেনু [200+]', callback_data: 'menu' }],
        [{ text: '🎭 Emoji [500+]', callback_data: 'emoji' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: 'https://wa.me/' + OWNER_NUMBER }]
      ]
    }
  });
});

bot.action('menu', async function(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(`
╭───『 ${BOT_NAME} 200+ 』───╮
🔥 *200+ COMMANDS* 🔥
OWNER:.restart.broadcast.block.unblock
GROUP:.link.antilink.kick.add.promote.tagall
DOWNLOADER:.ytmp3.ytmp4.play.tiktok.fb.ig
TOOLS:.sticker.toimg.qr.removebg.hd
AI:.ai.gpt.gemini.imagine
TOTAL 200+ 🔥
╰──────────────────╯
`, { parse_mode: 'Markdown' });
});

bot.action('emoji', async function(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(`
╭───『 500+ EMOJI 』───╮
😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘
TOTAL 500+ 🔥
╰──────────────────╯
`, { parse_mode: 'Markdown' });
});

bot.action('pair', async function(ctx) {
  await ctx.answerCbQuery();
  ctx.reply('📱 তোমার WhatsApp নাম্বার দাও ভাই\nউদাহরণ: ' + OWNER_NUMBER + '\nশুধু নাম্বার লিখো: 880...');
});

bot.on('text', async function(ctx) {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;
  await ctx.reply('⏳ ' + number + ' এর জন্য কোড বানাচ্ছি... 10 সেকেন্ড Wait করো!');
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
    await delay(5000);
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);

      // One Tap Copy Button + Code Block
      await ctx.replyWithMarkdownV2(`✅ *Pair Success\\!*\n\n📱 Number: ${number}\n🔑 CODE: \`${code}\`\n\nTap kore Copy koro 👇`);

      await ctx.reply(`📋 COPY CODE: ${code}`, {
        reply_markup: {
          inline_keyboard: [[{ text: `📋 COPY: ${code}`, callback_data: `copy_${code}` }]]
        }
      });
    }
  } catch (e) { ctx.reply('❌ Error! 2 মিনিট পর Try করো! ' + e.message); }
});

bot.catch(function(err, ctx) {
  console.log('Bot Error:', err.message);
});

(async function() {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log('Webhook Cleared - ' + BOT_NAME);
  } catch (e) {}
  try {
    await bot.launch({ dropPendingUpdates: true });
    console.log('BOT CONNECTED - ' + BOT_NAME);
  } catch (e) {
    console.log('BOT LAUNCH FAIL: ' + e.message);
  }
})();
