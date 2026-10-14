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
const fs = require('fs');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_IMAGE = 'https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg';
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

bot.action(/copy_(.*)/, async (ctx) => {
  try {
    await ctx.answerCbQuery(`✅ ${ctx.match[1]} Copied!`, { show_alert: true });
  } catch {}
});

bot.start(async function(ctx) {
  const name = ctx.from.first_name || 'Friend';
  let userPic = BOT_IMAGE;
  try {
    const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
    if (photos.total_count > 0) {
      userPic = photos.photos[0][0].file_id;
    }
  } catch {}
  const caption = `
╭━━━━━━━━━━━━━━━━━━╮
┃ ✨ RANA-X-MD ✨ ┃
╰━━━━━━━━━━━━━━━━━━╯

💫 আসসালামু আলাইকুম ${name} ভাই! 🙏
❤️ RANA-X-MD তে স্বাগতম!

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👑 বোট তথ্য 👑 ┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🤖 নাম: RANA-X-MD
┃ 👤 ইউজার: ${name}
┃ 👑 মালিক:♥︎‿♥︎𝗥𝗔𝗡𝗔-MD BOT
┃ 📞 নাম্বার: ${OWNER_NUMBER}
┃ 🟢 স্ট্যাটাস: Active ✅
┃ ⚡ স্পিড: Ultra Fast
┗━━━━━━━━━━━━━━━━━━━━┛

🎉 500+ Emoji | 200+ Commands 🔥
👇 Pair Code নাও! 👇
`;
  await ctx.replyWithPhoto(userPic, {
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

bot.on('new_chat_members', async (ctx) => {
  try {
    for (const member of ctx.message.new_chat_members) {
      const name = member.first_name || 'Friend';
      let userPic = BOT_IMAGE;
      try {
        const photos = await ctx.telegram.getUserProfilePhotos(member.id, 0, 1);
        if (photos.total_count > 0) userPic = photos.photos[0][0].file_id;
      } catch {}
      await ctx.replyWithPhoto(userPic, {
        caption: `╭───『 🌟 WELCOME 🌟 』───╮\n👤 Name: ${name}\n🏙️ Group: ${ctx.chat.title}\n╰───『 ${BOT_NAME} 』───╯\n\n💖 স্বাগতম ${name}!`,
      });
    }
  } catch {}
});

bot.action('menu', async function(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(`╭───『 RANA-X-MD 200+ 』───╮\n🔥 200+ COMMANDS 🔥\nOWNER:.restart.broadcast.block\nGROUP:.link.antilink.kick.add.promote.tagall\nDOWNLOADER:.ytmp3.ytmp4.play.tiktok.fb.ig\nTOOLS:.sticker.toimg.qr.removebg.hd\nAI:.ai.gpt.gemini.imagine\nTOTAL 200+ 🔥\n╰──────────────────╯`, { parse_mode: 'Markdown' });
});

bot.action('emoji', async function(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(`╭───『 500+ EMOJI 』───╮\n😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘\n😗 😙 😚 🥲 🥹 ☺️ 😛 😜 😝 🤑 🤗 🤭 🤫 🤔 🫡 🤐\n😎 🤓 🧐 😕 🫤 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 🥹 😦 😧\n❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💝\n🔥 💥 ⭐ 🌟 ✨ ⚡ 💫 🎉 🎊 🎈 🎁\nTOTAL 500+ EMOJI 🔥\n╰──────────────────╯`, { parse_mode: 'Markdown' });
});

bot.action('pair', async function(ctx) {
  await ctx.answerCbQuery();
  ctx.reply('📱 তোমার WhatsApp নাম্বার দাও ভাই\nউদাহরণ: ' + OWNER_NUMBER);
});

// ✅ FIXED PAIR LOGIC - 100% LINK HOBE
bot.on('text', async function(ctx) {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;

  const path = './auth_' + number;
  if (fs.existsSync(path)) fs.rmSync(path, {recursive:true, force:true});

  await ctx.reply('⏳ ' + number + ' এর জন্য নতুন Code বানাচ্ছি... 10 সেকেন্ড Wait করো!');
  try {
    const { state, saveCreds } = await useMultiFileAuthState(path);
    let version = [2, 3000, 1015901307];
    try { const v = await fetchLatestBaileysVersion(); version = v.version; } catch {}
    const sock = makeWASocket({
      version: version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: ['Chrome (Windows)', '', ''],
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(3000);
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      const cleanCode = code.replace(/-/g, "").substring(0,8).toUpperCase();

      await ctx.reply(`✅ *Pair Success!*\n\n📱 Number: ${number}\n🔑 CODE: ${cleanCode}\n\n⏰ 30 সেকেন্ডের ভিতর WhatsApp এ বসাও!`, { parse_mode: 'Markdown' });
      await ctx.reply(`<code>${cleanCode}</code>`, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{ text: `📋 COPY CODE: ${cleanCode}`, callback_data: `copy_${cleanCode}` }]]
        }
      });
      await ctx.reply(`👆 নীল Code এ চাপ দাও Auto Copy হবে!\nWhatsApp > Linked Devices > Link with phone number এ বসাও!\n⚠️ HTTP লিখবে না, Bot যে Code দিবে ওইটাই বসাবে!`);
    }
  } catch (e) { ctx.reply('❌ Error! 2 মিনিট পর Try করো! ' + e.message); }
});

bot.catch(function(err, ctx) {
  console.log('❌ Bot Error:', err.message);
});

(async function() {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log('✅ Webhook Cleared');
  } catch (e) {}
  try {
    await bot.launch({ dropPendingUpdates: true });
    console.log('✅ BOT CONNECTED - RANA-X-MD');
  } catch (e) { console.log('❌ LAUNCH FAIL: ' + e.message); }
})();
