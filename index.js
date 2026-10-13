const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');

const BOT_TOKEN = process.env.BOT_TOKEN || '8956462716:AAFx-KxRHhWNALzPzAQeDjn2WqfIt2lAsN4';
const BOT_IMAGE = 'https://files.catbox.moe/8gwrio.jpg';
const BOT_NAME = 'RANA-X-MD';
const OWNER_NAME = '🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔-MD BOT';
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021';

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.replyWithPhoto(BOT_IMAGE, { caption: `🤖 *${BOT_NAME}*\n👑 ${OWNER_NAME}\n\nNumber: 8801XXXXXXXXX\n📢 Channel: ${CHANNEL_LINK}` }));
bot.on('text', async (ctx) => {
  let num = ctx.message.text.replace(/[^0-9]/g, '');
  if(num.length < 11) return ctx.reply('Wrong! Example: 8801636487523');
  await ctx.reply(`⏳ ${num} code making...`);
  try {
    if(fs.existsSync('./temp')) fs.rmSync('./temp', {recursive:true, force:true});
    const { state, saveCreds } = await useMultiFileAuthState('./temp');
    const sock = makeWASocket({ auth: state, printQRInTerminal: false, browser: [BOT_NAME, "Chrome", "121.0"], logger: P({level:'silent'}) });
    sock.ev.on('creds.update', saveCreds);
    await delay(3000);
    let code = await sock.requestPairingCode(num);
    ctx.reply(`✅ Code: *${code}*\n\n🤖 ${BOT_NAME}\n👑 ${OWNER_NAME}\n📢 ${CHANNEL_LINK}`, {parse_mode:'Markdown'});
  } catch(e){ ctx.reply(e.message); }
});
bot.launch();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, logger: P({level:'silent'}), printQRInTerminal: false, auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({level:'silent'})) }, browser: [BOT_NAME, "Chrome", "1.0.0"] });
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('group-participants.update', async (anu) => {
    try {
      let metadata = await sock.groupMetadata(anu.id);
      for (let num of anu.participants) {
        let pp = await sock.profilePictureUrl(num, 'image').catch(() => BOT_IMAGE);
        if (anu.action == 'add') {
          let welcomeText = `✦━━━━━━━『 WELCOME 』━━━━━━━✦

🌸 *স্বাগতম* 🌸
👋 হ্যালো @${num.split("@")[0]} ভাই!

💖 *${metadata.subject}* গ্রুপে আপনাকে
হার্দিক স্বাগতম ও অভিনন্দন!

┏━━━━━━━━━━━━━━━┓
┃ 🤖 BOT: ${BOT_NAME}
┃ 👑 OWNER: ${OWNER_NAME}
┃ 👥 মেম্বার: ${metadata.participants.length} জন
┃ 📞 ${OWNER_NUMBER}
┗━━━━━━━━━━━━━━━┛

📢 আমাদের চ্যানেলে Join করুন:
${CHANNEL_LINK}

📌 নিয়ম মেনে চলুন | .menu

✦━━━━━━━━━━━━✦`;
          await sock.sendMessage(anu.id, { image: { url: pp }, caption: welcomeText, mentions: [num] });
        }
      }
    } catch {}
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]; if (!m.message || m.key.fromMe) return;
    const emojis = ['❤️','💛','💚','💙','🔥','✨','💖','😍','🥰','😘','🤩','😎','😂','👍','👏','💯','🌟','🌸','👑','💎','⚡','🚀','🤖'];
    await sock.sendMessage(m.key.remoteJid, { react: { text: emojis[Math.floor(Math.random()*emojis.length)], key: m.key } });
    const from = m.key.remoteJid;
    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    if (!body.startsWith('.')) return;
    const cmd = body.slice(1).split(' ')[0].toLowerCase();
    if (cmd === 'menu' || cmd === 'alive' || cmd === 'ping') {
      await sock.sendMessage(from, { image: { url: BOT_IMAGE }, caption: `┌───「 *${BOT_NAME}* 」───┐\n│ 👑 ${OWNER_NAME}\n│ 📞 ${OWNER_NUMBER}\n└───────────────\n📢 Channel:\n${CHANNEL_LINK}\n\n🟢 ONLINE ✅` }, {quoted:m});
    }
  });
  sock.ev.on('connection.update', (u) => { if(u.connection==='close' && u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut) startBot(); });
}
startBot();
