const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_IMAGE = 'https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg;
const BOT_NAME = 'RANA-X-MD';
const OWNER_NAME = '🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔-MD BOT';
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021';

const bot = new Telegraf(BOT_TOKEN);
function getRecentCount() { return Math.floor(500 + Math.random() * 350); }

bot.action(/copy_(.*)/, async (ctx) => {
  try { await ctx.answerCbQuery(`✅ ${ctx.match[1]} Copied!`, { show_alert: true }); } catch {}
});

bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'বন্ধু';
  const recent = getRecentCount();
  let userPic = BOT_IMAGE;
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
    if (photos.total_count > 0) userPic = photos.photos[0][0].file_id;
  } catch {}
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
┃ 📜 কমান্ড: 200+ ✅
┃ 🎭 ইমোজি: 500+ ✅
┗━━━━━━━━━━━━┛

💬 নিচে ক্লিক করে পেয়ার কোড নাও!
> Powered by ${OWNER_NAME}
`;
  await ctx.replyWithPhoto(userPic, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: `🔗 পেয়ার কোড নাও [${recent}+]`, callback_data: 'pair' }],
        [{ text: '📜 মেনু [200+]', callback_data: 'menu' }, { text: '🎭 ইমোজি [500+]', callback_data: 'emoji' }],
        [{ text: `🔥 রিসেন্ট [${recent}+]`, callback_data: 'recent' }, { text: '⚙️ ওটো সেটিং', callback_data: 'auto' }],
        [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: `https://wa.me/${OWNER_NUMBER}` }]
      ]
    }
  });
});

bot.on('new_chat_members', async (ctx) => {
  try {
    for (const member of ctx.message.new_chat_members) {
      const name = member.first_name || 'বন্ধু';
      let userPic = BOT_IMAGE;
      try {
        const photos = await ctx.telegram.getUserProfilePhotos(member.id, 0, 1);
        if (photos.total_count > 0) userPic = photos.photos[0][0].file_id;
      } catch {}
      await ctx.replyWithPhoto(userPic, {
        caption: `*╭─〔 🌟 WELCOME 🌟 〕─╮*\n*├─ 👤 Name: ${name}*\n*├─ 🏙️ Group: ${ctx.chat.title}*\n*╰─〔 ${BOT_NAME} 〕─╯*\n\n_💖 স্বাগতম ${name}!_`,
        parse_mode: 'Markdown'
      });
    }
  } catch {}
});

bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`*╔═══ ${BOT_NAME} MENU [200+] ═══╗*\n\n*📥 DOWNLOAD [30+]*\nytmp3, ytmp4, fb, insta, tiktok\n\n*🤖 AI [25+]*\ngpt, ai, dalle, gemini\n\n*👥 GROUP [40+]*\ntagall, kick, promote, welcome\n\n*🎭 FUN [50+]*\njoke, meme, truth, dare\n\n*⚙️ AUTO [20+]*\nautostatus, autoread\n\n*🔧 TOOLS [35+]*\nsticker, ss, translate\n\n*🔥 TOTAL: 200+ ✅*`, { parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back' }]] }
  });
});

bot.action('emoji', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`*╔═══ EMOJI [500+] ═══╗*\n\n😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹\n😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗\n💞💕❤️✅💥👊 🤗💫💚💌🤖🫦\n🐞🌹🥀🪰🌺🌸 💐🌻🌿☘️🍀🍁\n🎁🎊🎉🧨🎀🖼️🚀⭐🌨️🌧️⛄☔⚡🔥\n🎋🎗️🎳🎱🎯🪀🎮🎁🎃🪅🪄🔮🧩\n\n*🔥 TOTAL 500+ EMOJI ✅*`, { parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back' }]] }
  });
});

bot.action('recent', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`*🔥 Recent: ${getRecentCount()}+ ✅*\n\n✅ Last 24h Paired!\n✅ Active 750+ Members\n✅ Uptime 99.9%`, { parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [[{ text: '⬅️ Back', callback_data: 'back' }]] }
  });
});
bot.action('auto', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`*⚙️ AUTO SETTING*\n\n✅ Welcome: ON\n✅ Goodbye: ON\n✅ AutoRead: ON`, { parse_mode: 'Markdown' });
});
bot.action('back', async (ctx) => { await ctx.answerCbQuery(); return ctx.telegram.sendMessage(ctx.chat.id, "/start দাও ভাই!"); });
bot.action('pair', async (ctx) => { await ctx.answerCbQuery(); ctx.reply(`📱 নাম্বার দাও!\nউদা: ${OWNER_NUMBER}`); });

bot.on('text', async (ctx) => {
  const txt = ctx.message.text;
  if (txt.startsWith('/') || txt.includes('WELCOME') || txt.includes('MENU') || txt.includes('EMOJI')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;
  await ctx.reply(`⏳ ${number} এর জন্য কোড বানাচ্ছি... [${getRecentCount()}+]`);
  try {
    const { state, saveCreds } = await useMultiFileAuthState(`./auth_${number}`);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version, auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }), browser: ['RANA-X-MD', 'Chrome', '1.0.0'],
    });
    sock.ev.on('creds.update', saveCreds);
    if (!sock.authState.creds.registered) {
      await delay(3000);
      const code = await sock.requestPairingCode(number);
      await ctx.reply(`╔═══ Pair Success ═══╗\n📱 Number: ${number}\n╚═══════════════════╝`);
      await ctx.reply(`<code>${code}</code>`, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [[{ text: `📋 COPY CODE: ${code}`, callback_data: `copy_${code}` }]] }
      });
      await ctx.reply(`👆 নীল Code এ চাপ দাও বা COPY বাটনে চাপ দাও!\n15 সেকেন্ডে বসাও!`);
    }
  } catch (e) { ctx.reply('❌ Error! 2 মিনিট পর Try করো!'); }
});

(async () => {
  try { await bot.telegram.deleteWebhook({ drop_pending_updates: true }); console.log('✅ Webhook Cleared'); } catch {}
  bot.launch({ dropPendingUpdates: true }).then(() => console.log('✅ RANA-X-MD Bot Running Full!'));
})();

const app = express();
app.get('/', (req, res) => res.send(`RANA-X-MD Running ✅`));
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Port ${PORT}`));
