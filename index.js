process.on('uncaughtException', e => console.log('UNCAUGHT:', e.message, e.stack));
process.on('unhandledRejection', e => console.log('REJECTED:', e.message, e.stack));

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
const OWNER_NUMBER = '8801636487523';

console.log('Checking BOT_TOKEN:', BOT_TOKEN? 'FOUND ✅' : 'MISSING ❌');

const app = express();
app.get('/', (req, res) => res.send(BOT_NAME + ' Running ✅'));
app.listen(process.env.PORT || 10000, '0.0.0.0', () => console.log('Port OK'));

const bot = new Telegraf(BOT_TOKEN);

// ====== PAIR LOGIC - WITH CALL REJECT MODE ======
async function handlePair(ctx, input) {
  let number = input? input.replace(/[^0-9]/g, '') : '';
  if (number.length < 10) return ctx.reply('📱  নাম্বার দাও\nলিখো: /pair 8801636487523');
  if(number.startsWith('0')) number = '88' + number;

  await ctx.reply('⏳ ' + number + ' এর জন্য কোড বানাচ্ছি... 15 সেকেন্ড Wait করো! 🙏');
  const authPath = './auth_' + number;
  if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    let version;
    try {
      const v = await fetchLatestBaileysVersion();
      version = v.version;
    } catch { version = [2, 3000, 1015901307]; }

    const sock = makeWASocket({
      version: version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' }).child({ level: 'fatal' })) },
      printQRInTerminal: false,
      logger: P({ level: 'silent' }),
      browser: ["Chrome", "Ubuntu", "20.0.04"],
    });
    sock.ev.on('creds.update', saveCreds);

    // === CALL REJECT SYSTEM ===
    sock.ev.on('call', async (calls) => {
      for (let call of calls) {
        if (call.status === 'offer') {
          await sock.rejectCall(call.id, call.from);
          await sock.sendMessage(call.from, { text: '*Call Rejected Automatically 📵*\n\n> _Bot Number, Call Not Allowed!_' });
          console.log('Call Rejected from:', call.from);
        }
      }
    });

    await delay(5000);

    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      await ctx.reply('✅ Pair Success!\n\n📱 Number: ' + number + '\n🔑 CODE: ' + code + '\n\n⚠️ 20 সেকেন্ডের মধ্যে WhatsApp এ বসাও! 90 সেকেন্ড খোলা থাকবে!\nWhatsApp > Linked Devices > Link with Phone Number', {
        reply_markup: { inline_keyboard: [[{ text: '📋 COPY: ' + code, copy_text: { text: code } }]] }
      });

      let connected = false;
      sock.ev.on('connection.update', async (up) => {
        if(up.connection === 'open'){
          connected = true;
          await ctx.reply('🎉 ' + number + ' WhatsApp Connected! ✅\n\n📵 Call Reject Mode: ON');
          // 90 sec por o katbo na, karon call reject on rakhte hobe? na, ekhon katte hobe na hole render e thakbe
          // Tai 10 sec por katbe
          await delay(10000);
          try { sock.ws.close(); } catch {}
          if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
        }
      });

      await delay(90000);
      if(!connected){
        try { sock.ws.close(); } catch {}
        if (fs.existsSync(authPath)) fs.rmSync(authPath, { recursive: true, force: true });
        await ctx.reply('⏰ Time Over! Code Expire হয়ে গেছে, আবার /pair দাও!');
      }
    }
  } catch (e) {
    console.log('Pair Error:', e.message);
    ctx.reply('❌ Error: ' + e.message + '\n2 মিনিট পর আবার Try করো!');
  }
}

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
┃  🥷 ${BOT_NAME} 🥷 ┃
╰━━━━━━━━━━━━━━━━━━━━╯

💗 স্বাগতম ${name}! 💗

🧸 ${global.ownerName} 🧸
🌸 ༉ • 🍒 ༉ • 💍 ༉

🍷 তোমার আগমন সুন্দর হোক।
🌷 সবার সাথে মিলেমিশে থাকো।
✨ আড্ডা উপভোগ করো।

┏━━━━━━━━━━━━━━━━━━┓
┃ 👤 ইউজার: ${name}
┃ 👑 মালিক: RANA
┃ 🟢 Active ✅
┗━━━━━━━━━━━━━━━━━━┛

⚡ POWERED BY ${BOT_NAME} 🖤
`;
  await ctx.replyWithPhoto(userPhoto, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔗 পেয়ার কোড নাও', callback_data: 'pair' }],
        [{ text: '📜 মেনু [300+]', callback_data: 'menu' }, { text: '🎭 Emoji [1000+]', callback_data: 'emoji' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: 'https://wa.me/' + OWNER_NUMBER }]
      ]
    }
  });
});

bot.action('menu', async ctx => { await ctx.answerCbQuery(); await ctx.reply(`🔥 *${BOT_NAME} - 300+ COMMANDS* 🔥\nPOWERED BY ${BOT_NAME}`, { parse_mode: 'Markdown' }); });
bot.action('emoji', async ctx => { await ctx.answerCbQuery(); await ctx.reply(`🎭 *1000+ EMOJI* 🎭\nPOWERED BY ${BOT_NAME}`, { parse_mode: 'Markdown' }); });
bot.action('pair', async ctx => { await ctx.answerCbQuery(); ctx.reply('📱 নাম্বার দাও: /pair 880...'); });
bot.on('text', ctx => { if (ctx.message.text.startsWith('/')) return; const n = ctx.message.text.replace(/[^0-9]/g, ''); if (n.length >= 10) handlePair(ctx, n); });

async function startBot() {
  try {
    if (!BOT_TOKEN) throw new Error('BOT_TOKEN MISSING');
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    await new Promise(r => setTimeout(r, 8000));
    await bot.launch({ dropPendingUpdates: true });
    console.log('✅ BOT CONNECTED');
  } catch (e) {
    console.log('❌ BOT LAUNCH FAILED:', e.message);
    setTimeout(startBot, 10000);
  }
}
startBot();
