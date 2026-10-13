const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_IMAGE = 'https://files.catbox.moe/8gwrio.jpg';
const BOT_NAME = 'RANA-X-MD';
const OWNER_NAME = '🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔-MD BOT';
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021';

const bot = new Telegraf(BOT_TOKEN);
function getRecentCount() { return Math.floor(500 + Math.random() * 350); }

bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'বন্ধু';
  const recent = getRecentCount();
  const caption = `
╔════════════════════╗
   🌟 ${BOT_NAME} 🌟
╚════════════════════╝

আসসালামু আলাইকুম ${name} ভাই! 🙏
আপনাকে ${BOT_NAME} এ স্বাগতম!

┏━❖━ তথ্য ━❖━┓
┃ 🤖 বোট: ${BOT_NAME}
┃ 👑 মালিক: ${OWNER_NAME}
┃ 📞 নাম্বার: ${OWNER_NUMBER}
┃ 👥 মেম্বার: 750+ এক্টিভ
┃ 🔥 রিসেন্ট: ${recent}+ পেয়ার ✅
┗━━━━━━━━━━━━┛

💬 নিচে ক্লিক করে পেয়ার কোড নাও!
> Powered by ${OWNER_NAME}
`;
  await ctx.replyWithPhoto(BOT_IMAGE, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: `🔗 পেয়ার কোড নাও [${recent}+]`, callback_data: 'pair' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: `https://wa.me/${OWNER_NUMBER}` }]
      ]
    }
  });
});

bot.action('pair', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`📱 তোমার WhatsApp নাম্বার দাও\nউদাহরণ: ${OWNER_NUMBER}\nদিলেই 8 ডিজিটের কোড দিবো!`);
});

bot.on('text', async (ctx) => {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;
  await ctx.reply(`⏳ ${number} এর জন্য কোড বানাচ্ছি... [${getRecentCount()}+]`);
  try {
    const { state, saveCreds } = await useMultiFileAuthState(`./auth_${number}`);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: ['RANA-X-MD', 'Chrome', '1.0.0'],
    });
    sock.ev.on('creds.update', saveCreds);
    if (!sock.authState.creds.registered) {
      await delay(3000);
      const code = await sock.requestPairingCode(number);
      await ctx.reply(`╔═══ Pair Success ═══╗\n📱 Number: ${number}\n🔑 Code: ${code}\n╚═══════════════════╝\n\nWhatsApp > Linked Devices > Link with phone number এ গিয়ে Code বসাও!\n⏰ 2 মিনিটের মধ্যে!`);
    }
  } catch (e) {
    ctx.reply('❌ Error! 2 মিনিট পর আবার Try করো!');
  }
});

bot.launch().then(() => console.log('✅ RANA-X-MD Bot Running Bangla Welcome!'));

const app = express();
app.get('/', (req, res) => res.send(`RANA-X-MD Running ✅ Recent ${getRecentCount()}+`));
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Port Fixed! Running on ${PORT}`));
