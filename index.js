process.on('uncaughtException', e => console.log(e.message));
process.on('unhandledRejection', e => console.log(e.message));

global.botName = "RANA-X-MD";
global.ownerName = "🐬⃟ᴠͥɪͣᴘͫ×͜×🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔";
global.channelLink = "https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021";
global.thumb = "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg";

const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_NAME = global.botName;
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = global.channelLink;
const BOT_IMAGE = global.thumb;

const app = express();
app.get('/', (req, res) => res.send(BOT_NAME + ' Running ✅'));
app.listen(process.env.PORT || 10000, '0.0.0.0', () => console.log('Port OK'));

const bot = new Telegraf(BOT_TOKEN);

async function handlePair(ctx, input) {
  let number = input? input.replace(/[^0-9]/g, '') : '';
  if (number.length < 10 || number.length > 15) {
    return ctx.reply('📱 নাম্বার দাও ভাই\nলিখো: /pair 8801837450067\nযেকোনো দেশের নাম্বার চলবে');
  }

  await ctx.reply('⏳ ' + number + ' এর জন্য কোড বানাচ্ছি...');

  // পুরান auth delete - Connection Closed ঠিক হবে
  const authPath = './auth_' + number;
  if (fs.existsSync(authPath)) {
    fs.rmSync(authPath, { recursive: true, force: true });
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    let version;
    try { const v = await fetchLatestBaileysVersion(); version = v.version; } catch { version = [2, 3000, 1015901307]; }

    const sock = makeWASocket({
      version: version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' }).child({ level: 'fatal' })) },
      printQRInTerminal: false,
      logger: P({ level: 'silent' }),
      browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    sock.ev.on('creds.update', saveCreds);
    await delay(5000);

    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);

      // 100% FIX COPY BUTTON - Markup.button.copyText বাদ
      await ctx.reply(
        '✅ Pair Success!\n\n📱 Number: ' + number + '\n🔑 CODE: ' + code,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '📋 COPY CODE: ' + code, copy_text: { text: code } }]
            ]
          }
        }
      );
    }
    await delay(2000);
    try { sock.ws.close(); } catch {}
  } catch (e) {
    console.log('Pair Error:', e.message);
    if (e.message.includes('Connection Closed')) {
      ctx.reply('❌ WhatsApp Connection Closed!\n\nকারণ:\n1. নাম্বারটা ভুল\n2. 2 মিনিট পর আবার Try করো\n3. নাম্বারে আগে থেকেই WhatsApp Web Login আছে কিনা দেখো\n\nআবার লিখো: /pair ' + number);
    } else {
      ctx.reply('❌ Error: ' + e.message);
    }
  }
}

// /pair8801636487523 - স্পেস ছাড়াও কাজ করবে
bot.command('pair', (ctx) => {
  handlePair(ctx, ctx.message.text.replace('/pair', ''));
});
bot.hears(/^\/pair/i, (ctx) => {
  handlePair(ctx, ctx.message.text.replace(/\/pair/i, ''));
});

// START - DP সহ + VIP RANA নাম সহ Welcome
bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'Friend';
  let userPhoto = BOT_IMAGE;
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
    if (photos.total_count > 0) {
      userPhoto = photos.photos[0][photos.photos[0].length - 1].file_id;
    }
  } catch {}

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
├─🌷 সবার সাথে মিলেমিশে থাকো।
├─✨ প্রয়োজন হলে ${BOT_NAME} ব্যবহার করো।
│
╰─➡️ POWERED BY ${BOT_NAME} 🖤
`;

  await ctx.replyWithPhoto(userPhoto, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔗 পেয়ার কোড নাও', callback_data: 'pair' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: 'https://wa.me/' + OWNER_NUMBER }]
      ]
    }
  });
});

bot.action('pair', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply('📱 নাম্বার দাও: /pair 8801837450067');
});

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
