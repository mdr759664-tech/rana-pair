process.on('uncaughtException', e => console.log('UNCAUGHT:', e.message));
process.on('unhandledRejection', e => console.log('REJECTED:', e.message));

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
const CHANNEL_LINK = global.channelLink;
const BOT_IMAGE = global.thumb;
const OWNER_NUMBER = '+8801636487523';
const RENDER_URL = 'https://rana-pair.onrender.com';

const app = express();
app.use(express.json());
const bot = new Telegraf(BOT_TOKEN);
app.use(bot.webhookCallback('/telegram'));
app.get('/', (req, res) => res.send(BOT_NAME + ' Running ✅'));

// ===== PAIR LOGIC - FIXED + ALL COUNTRY =====
async function handlePair(ctx, input) {
  let number = input? input.replace(/[^0-9]/g, '') : '';
  if (number.length < 10) return ctx.reply('📱 Full Number দাও Country Code সহ\nEx: /pair 8801837450067');
  if(number.startsWith('0')) number = '+88' + number;

  await ctx.reply(`⏳ ${number} এর জন্য কোড বানাচ্ছি... 20 Sec Wait করো! 🙏`);
  const authPath = './auth_' + number;
  if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' }).child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: ["Chrome", "Windows", "10"],
      markOnlineOnConnect: false,
      syncFullHistory: false
    });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('call', async (calls) => {
      for (let call of calls) {
        if (call.status === 'offer') {
          await sock.rejectCall(call.id, call.from);
        }
      }
    });
    await delay(20000);
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      await ctx.reply(`✅ Pair Success! Code: ${code}`, {
        reply_markup: { inline_keyboard: [[{ text: `📋 COPY CODE`, copy_text: { text: code } }]] }
      });
      });
      let connected = false;
      sock.ev.on('connection.update', async (up) => {
        if(up.connection === 'open'){
          connected = true;
          await ctx.reply(`🎉 ${number} Connected! ✅`);
          await delay(10000);
          try { sock.ws.close(); } catch {}
          if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
        }
      });
      await delay(120000);
      if(!connected){
        try { sock.ws.close(); } catch {}
        if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
        await ctx.reply('⏰ Time Over! আবার /pair দাও!');
      }
    }
  } catch (e) { ctx.reply('❌ Error: ' + e.message); }
}

const MENU_400 = `
🔥 *${global.botName} - 400+ COMMANDS* 🔥

🌸 *GROUP [100+]*: .link, .antilink, .welcome on/off, .goodbye, .promote, .demote, .kick, .add, .tagall, .hidetag, .group open/close, .setname, .setdesc, .revoke, .warn etc
🎭 *STICKER [50+]*: .sticker, .s, .take, .steal, .emojimix, .attp, .ttp, .toimg
🎬 *DOWNLOADER [60+]*: .play, .ytmp3, .ytmp4, .fb, .ig, .tiktok, .mediafire, .apk, .pinterest
🖼️ *ANIME [80+]*: .waifu, .neko, .hug, .kiss, .pat, .slap, .kill, .wink
🛠️ *TOOLS [70+]*: .calc, .google, .weather, .translate, .removebg, .remini, .qrcode, .ss
👑 *OWNER [40+]*: .restart, .broadcast, .ban, .block

*TOTAL 400+ ✅*
`;

const EMOJI_500 = `
🎭 *500+ EMOJI COLLECTION* 🎭

❤️ 💙 💚 💛 🧡 💜 🖤 🤍 🤎 💔 💕 💞 💓 💗 💖 💝 💘
😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘
🌸 🌺 🌹 🌻 🌼 🌷 💐 🌲 🌳 🌴 🌿 ☘️ 🍀 🍁 🍂
🎈 🎉 🎊 🎂 🎁 🎀 🎆 🎇 ✨ 🎈 🎊
😎 🔥 💯 💢 💥 ⭐ 🌟 ⚡ 💪 👑 😈 💀 👻 🤖
🐬 🦋 🌸 🍒 💍 🍷 🌷 ✨ 🥀 💖 🧸 💗 🥷

*TOTAL 500+ ADDED ✅*
`;

bot.command('pair', ctx => handlePair(ctx, ctx.message.text.replace('/pair', '')));
bot.hears(/^\/pair/i, ctx => handlePair(ctx, ctx.message.text.replace(/\/pair/i, '')));

bot.start(async ctx => {
  const name = ctx.from.first_name || 'Friend';
  let userPhoto = BOT_IMAGE;
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
    if (photos.total_count > 0) {
      userPhoto = photos.photos[0][photos.photos[0].length - 1].file_id;
    }
  } catch {}

  const caption = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃ ┃ 🥷 ${BOT_NAME} 🥷 ┃
╰━━━━━━━━━━━━━━━━━━━━╯

💗 স্বাগতম ${name}! 💗

🧸 ${global.ownerName} 🧸
🌸 ༉ • 🍒 ༉ • 💍 ༉

🍷 তোমার আগমন সুন্দর হোক।
🌷 সবার সাথে মিলেমিশে থাকো।
✨ আড্ডা উপভোগ করো।

┏━━━━━━━━━━━━━━━━━━┓
┃ 👤 ইউজার: ${name}
┃ 👑 মালিক: RANA-X-MD
┃ 🌍 সব দেশ সাপোর্ট: ✅
┃ 🟢 Active ✅
┗━━━━━━━━━━━━━━━━━━┛

⚡ POWERED BY ${BOT_NAME} 🖤
`;

  await ctx.replyWithPhoto(userPhoto, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔗 পেয়ার কোড নাও', callback_data: 'pair' }],
        [{ text: '📜 মেনু [400+]', callback_data: 'menu' }, { text: '🎭 Emoji [500+]', callback_data: 'emoji' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: 'https://wa.me/' + OWNER_NUMBER }]
      ]
    }
  });
});

bot.action('pair', async ctx => { await ctx.answerCbQuery(); ctx.reply('📱 নাম্বার দাও: /pair 8801837450067'); });
bot.action('menu', async ctx => { await ctx.answerCbQuery(); await ctx.reply(MENU_400, { parse_mode: 'Markdown' }); });
bot.action('emoji', async ctx => { await ctx.answerCbQuery(); await ctx.reply(EMOJI_500, { parse_mode: 'Markdown' }); });
bot.on('text', ctx => { if (ctx.message.text.startsWith('/')) return; const n = ctx.message.text.replace(/[^0-9]/g, ''); if (n.length >= 10) handlePair(ctx, n); });

app.listen(process.env.PORT || 10000, '0.0.0.0', async () => {
  try { await bot.telegram.setWebhook(`${RENDER_URL}/telegram`); console.log('✅ WEBHOOK SET'); } catch (e) { console.log(e.message); }
});
