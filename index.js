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

const { Telegraf, Markup } = require('telegraf');
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

// /pair কমান্ড যোগ করলাম - যে কেউ /pair লিখলেই কাজ করবে
bot.command('pair', async (ctx) => {
  await ctx.reply('📱 তোমার WhatsApp নাম্বার দাও ভাই\nযেকোনো দেশের নাম্বার দাও\nউদাহরণ: ' + OWNER_NUMBER);
});

bot.start(async function(ctx) {
  const name = ctx.from.first_name || 'Friend';
  let userPhoto = BOT_IMAGE;
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
    if (photos.total_count > 0) {
      const fileId = photos.photos[0][0].file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);
      userPhoto = fileLink.href;
    }
  } catch (e) {
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
┗━━━━━━━━━━━━━━━━━━━━┛

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
  await ctx.reply(`200+ COMMANDS 🔥\nOWNER:.restart.broadcast\nGROUP:.link.kick.tagall\nDOWNLOADER:.ytmp3.tiktok.fb\nTOTAL 200+ 🔥`);
});

bot.action('emoji', async function(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(`500+ EMOJI 🔥 😀 😃 😄 😁 😆 😅 😂 🤣`);
});

bot.action('pair', async function(ctx) {
  await ctx.answerCbQuery();
  ctx.reply('📱 তোমার WhatsApp নাম্বার দাও ভাই\nউদাহরণ: ' + OWNER_NUMBER + '\nশুধু নাম্বার লিখো: 880...');
});

bot.on('text', async function(ctx) {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 10 || number.length > 15) return; // যেকোনো দেশের নাম্বার 10-15 ডিজিট
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

      // 100% SOTHIK ONE TAP COPY BUTTON
      await ctx.replyWithMarkdown(
        `✅ *Pair Success!*\n\n📱 Number: ${number}\n🔑 CODE: \`${code}\`\n\n👇 নিচের বাটনে চাপ দিলেই কপি হবে!`,
        Markup.inlineKeyboard([
          [Markup.button.copyText(`📋 COPY: ${code}`, code)]
        ])
      );
    }
  } catch (e) { ctx.reply('❌ Error! 2 মিনিট পর Try করো! ' + e.message); }
});

bot.catch(function(err, ctx) {
  console.log('Bot Error:', err.message);
});

let isRunning = false;
async function startBot() {
  if (isRunning) return;
  isRunning = true;
  try {
    console.log('Cleaning old sessions...');
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await bot.telegram.callApi('close').catch(()=>{});
    await new Promise(r => setTimeout(r, 5000));
    await bot.launch({ dropPendingUpdates: true });
    console.log('✅ BOT CONNECTED - RANA-X-MD');
  } catch (e) {
    isRunning = false;
    console.log('BOT LAUNCH FAIL: ' + e.message);
    setTimeout(startBot, 20000);
  }
}
startBot();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
