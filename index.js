process.on('uncaughtException', function(e) {
  console.log('Error:', e.message);
});
process.on('unhandledRejection', function(e) {
  console.log('Error:', e.message);
});

global.botName = "🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔-MD";
global.ownerName = "🐬⃟ᴠͥɪͣᴘͫ×͜×🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔";
global.channelLink = "https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021";
global.thumb = "https://files.catbox.moe/8gwrio.jpg";
global.sessionId = "IK~H4sIAAAAAAAAA5VUy27bRhT9lWC2EmJSL1ICDISkKIp6UZRMvYosRuRQHPE9HNKkAgPtqqvWLrJpgTrdZNNFkGXTfyj6A13Vy678CQVlO86iCVwCBIeXnHvPPeeeeQWCECdoiArQeQUigjNIUbmkRYRAB4ipbSMCqsCCFIIOkIXZjjdGNNlDMoFpflKoqag1XSdbbTa2G/f8yWA2G+/rPeMUXFRBlG49bH4hob2hG3HvVRgxN4Qwz+Jajq11r88EaBmt5GieLvnlQB7gfHwKLsqMEBMc7OTIQT4i0BuiYgoxeRr8ZLQXbdTruumZey5bnLkaJuqm2RPpcOjpmZ6OBicDYytYNf5p8GM7McTYN3XKI7YYb8/9iU6ZylxYDr1+JSnUEd7HfLY+c4Q7+AneBchSLRRQTIsn8x5ORHU8aDX6vdgtlDOXZyketSJeH690W+pqAyaccaEWO/0n8q6t8oXSJFKTqLgJD6M4Gh0ETZ0ogmJRqxi215y+XtW3Us34FPiUPMyK+394340ire7nedhqy4eoP+hVzNV+lbUis21Fi8F+ZdB4XXe7nuE+DX7Oj5ppY8tNhsIqF8PJSDCgoi7QRtPcrjiP2EGRTHqaDOfyI3xIU/IllDFbZJNFxultNjD3Q1GsxNqUsRJtXHS7S3lmOAeRmSLGJFJO8zDaY+2wGi9X1ESO7PTm2KvwDrXPZ3pcyHS/G9V1SdydHjtyUaFaoMNeVAFBO5xQAikOg2OMqVUBtLI5MgmiR3qBVV/wWj9VRF1IF1tSj/zGfjE1uD7CwryxtSwcMr4hjPexfAqqICKhiZIEWX2c0JAUY5QkcIcS0PnqZRUEKKd3wpXleLZeBTYmCTWCNPJCaD3I+vErNM0wDei8CEypXCACOsxjGFGKg11SMpkGkJgOzpDkQJqAjg29BH3sERFkgQ4lKfroWym0Suq52VLUhWYdVIF/lARboAN4nmH5OtdoMkyL63AvkufnZVoYRc8DREEVeMffavVmu8GwfKvRrDFso8O9KONVEMAyF7j5+bfbq8vX/7x/d/Phpz/f3Lz9/fb66ofb66uvb6+vvjs+ry5f315ffXMfu7y/f7z55V256/v3f735+/3bPz48e3bz67elevedl0AtRCH2EtAB0iSY41DuyoNsFVtrRRHknSDtBPDI1MPQ3Ym66GeO5y+zynayOp/vYGMAeXag5LP1dtNea+hMHZ7VpnM2lM5P/yMJ6ABVbWBTb4Zbp9VmN9O67U6xUXMarXE9zoseqmwXOlG2fjA780J/0Tu0rbXE9QKjz+pGPnGQMeOmhuJsSWrZrnUyDqB6nNAqsFCGTfRpsWk6JhOieG11uoz96X68HFZ2a0RYjQ7XTL8urkapqTukq1qjhqwcKpGYLc2FtknCIKT1YlRpT3Cj0eekFMWCtIhbltgV7uxwtKN3fwzi46CWM1C+2hgdT5V7NT8n9h3ecmSZi+onW++Pp89YXFzMuMZm45ET/7Dg5VBJpWU2mc8SY6nU7GU3cAvJbe8ZCoUEXFy8rILIg9QOiQ86AAYWCY/FSZiWFlADO/xCMUlIVEnYzcuGPZhQ4dFWZ9hHCYV+BDos12ZbTYZj21XgF0IUzSmkD3YEQnnJIg8u/gX6N3LsqwcAAA==";

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

// One Tap Copy Button
bot.action(/copy_(.*)/, async function(ctx){
  try{
    await ctx.answerCbQuery('Copied! ✅');
    await ctx.reply('📋 COPY CODE: ' + ctx.match[1]);
  }catch{}
});

bot.start(async function(ctx) {
  const name = ctx.from.first_name || 'Friend';
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

  await ctx.replyWithPhoto(BOT_IMAGE, {
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
😗 😙 😚 🥲 🥹 ☺️ 😛 😜 😝 🤑 🤗 🤭 🤫 🤔 🫡 🤐
🤨 😐 😑 😶 🫥 😶‍🌫️ 😏 😒 🙄 😬 😮‍💨 🤥 🫨 😌 😔 😪
🤤 😴 😷 🤒 🤕 🤢 🤮 🥵 🥶 🥴 😵 😵‍💫 🤯 🤠 🥳 🥸
😎 🤓 🧐 😕 🫤 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 🥹 😦 😧
😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠
🤬 😈 👿 💀 ☠️ 💩 🤡 👹 👺 👻 👽 👾 🤖 🎃 😺 😸
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
      await ctx.reply(`✅ *Pair Success!*\n\n📱 Number: ${number}\n🔑 CODE: ${code}\n\nBot: ${BOT_NAME}\nOwner: ${global.ownerName}`);
      await ctx.replyWithMarkdownV2(`\`${code}\``);
      await ctx.reply(`📋 COPY CODE: ${code}\n\nWhatsApp > Linked Devices > Link with phone number এ Code বসাও!`, {
        reply_markup: { inline_keyboard: [[{ text: `📋 COPY CODE: ${code}`, callback_data: `copy_${code}` }]] }
      });
    }
  } catch (e) { ctx.reply('❌ Error! 2 মিনিট পর Try করো! ' + e.message); }
});

bot.use(async function(ctx, next) {
  console.log('📩 New Message:', ctx.message?.text, 'From:', ctx.from?.first_name);
  return next();
});

bot.catch(function(err, ctx) {
  console.log('❌ Bot Error:', err.message);
});

(async function() {
  try {
    console.log('⏳ Deleting old Webhook...');
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log('✅ Webhook Cleared - ' + BOT_NAME);
  } catch (e) { console.log('⚠️ Webhook Error: ' + e.message); }

  try {
    console.log('🚀 Starting Bot... Token exists:',!!BOT_TOKEN);
    await bot.launch({ dropPendingUpdates: true });
    console.log('✅ BOT CONNECTED - ' + BOT_NAME + ' - READY FOR /start');
  } catch (e) {
    console.log('❌ BOT LAUNCH FAIL: ' + e.message);
    console.log('👉 Check BOT_TOKEN in Render Environment!');
  }
})();
