process.on('uncaughtException', function(e) {
  console.log('Error:', e.message);
});
process.on('unhandledRejection', function(e) {
  console.log('Error:', e.message);
});

global.botName = "RANA-X-MD";
global.ownerName = "🐬⃟ᴠͥɪͣᴘͫ×͜×🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔";
global.channelLink = "https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021";
global.thumb = "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg";

const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
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

async function handlePair(ctx, input) {
  let number = input? input.replace(/[^0-9]/g, '') : '';
  if (number.length < 10 || number.length > 15) {
    return ctx.reply('📱 নাম্বার দাও ভাই\nযেকোনো দেশের নাম্বার দাও\nলিখো: /pair 8801837450067');
  }
  await ctx.reply('⏳ ' + number + ' এর জন্য কোড বানাচ্ছি...');
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_' + number);
    const sock = makeWASocket({
      version: [2, 3000, 1015901307],
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' }).child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: [BOT_NAME, 'Chrome', '1.0.0'],
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(4000);
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      await ctx.reply(
        '✅ *Pair Success!*\n\n📱 Number: ' + number + '\n🔑 CODE: `' + code + '`',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{ text: '📋 COPY: ' + code, copy_text: { text: code } }]]
          }
        }
      );
    }
    try { sock.ws.close(); } catch {}
  } catch (e) { ctx.reply('❌ Error! ' + e.message); }
}

bot.command('pair', (ctx) => handlePair(ctx, ctx.message.text.replace('/pair', '')));
bot.hears(/^\/pair/i, (ctx) => handlePair(ctx, ctx.message.text.replace(/\/pair/i, '')));

bot.start(async function(ctx) {
  const name = ctx.from.first_name || 'Friend';
  let userPhoto = BOT_IMAGE;
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
    if (photos.total_count > 0) {
      userPhoto = photos.photos[0][photos.photos[0].length - 1].file_id;
    }
  } catch {}

  // তোমার Mark করা নামটা এখানে থাকবে
  const caption = `
╭─❒ 🥷 ${BOT_NAME} ❒
│
├─💗 স্বাগতম @${name}! 💗
│
├─🧸 ${global.ownerName} 🧸
│ ├─ 🌸 ༉
│ ├─ 🍒 ༉
│ └─ 💍 ༉
│
├─🍷 ༉-এ তোমার আগমন সুন্দর হোক।
├─🌷 সবার সাথে মিলেমিশে থাকো এবং
│ আড্ডা উপভোগ করো।
├─✨ প্রয়োজন হলে ${BOT_NAME}-এর
│ commands ব্যবহার করতে পারো।
│
├─👤 ইউজার: ${name}
├─👑 মালিক: ${global.ownerName}
├─🟢 স্ট্যাটাস: Active ✅
│
╰─➡️ POWERED BY ${BOT_NAME} 🖤🥷
`;

  await ctx.replyWithPhoto(userPhoto, {
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

bot.action('menu', async (ctx) => { await ctx.answerCbQuery(); ctx.reply('200+ COMMANDS 🔥'); });
bot.action('emoji', async (ctx) => { await ctx.answerCbQuery(); ctx.reply('500+ EMOJI 🔥'); });
bot.action('pair', async (ctx) => { await ctx.answerCbQuery(); handlePair(ctx, ''); });

bot.on('text', (ctx) => {
  if (ctx.message.text.startsWith('/')) return;
  const num = ctx.message.text.replace(/[^0-9]/g, '');
  if (num.length >= 10) handlePair(ctx, num);
});

let isRunning = false;
async function startBot() {
  if (isRunning) return;
  isRunning = true;
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await new Promise(r => setTimeout(r, 5000));
    await bot.launch({ dropPendingUpdates: true });
    console.log('✅ BOT CONNECTED');
  } catch (e) {
    isRunning = false;
    setTimeout(startBot, 20000);
  }
}
startBot();
