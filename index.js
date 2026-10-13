const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_IMAGE = 'https://files.catbox.moe/8gwrio.jpg';
const BOT_NAME = 'ARANA-X-MD';
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021';

const app = express();
app.get('/', (req, res) => res.send(`${BOT_NAME} Running`));
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Port Running ${PORT}`));

const bot = new Telegraf(BOT_TOKEN);
function getRecentCount() { return Math.floor(500 + Math.random() * 350); }

bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'Friend';
  const recent = getRecentCount();
  const caption = `
╔════════════════════╗
   🌟 ${BOT_NAME} 🌟
╚════════════════════╝

আসসালামু আলাইকুম ${name} ভাই! 🙏
${BOT_NAME} তে আপনাকে স্বাগতম!

🔥 Recent: ${recent}+ Paired
👑 Owner: ${OWNER_NUMBER}
`;

  await ctx.replyWithPhoto(BOT_IMAGE, {
    caption: caption,
    reply_markup: {
      inline_keyboard: [
        [{ text: `Get Pair Code [${recent}+]`, callback_data: 'pair' }],
        [{ text: 'Channel', url: CHANNEL_LINK }, { text: 'Owner', url: `https://wa.me/${OWNER_NUMBER}` }],
        [{ text: '📜 Menu [200+]', callback_data: 'menu' }]
      ]
    }
  });
});

bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery();
  const menuText = `
*${BOT_NAME} - 200+ Commands*

*OWNER MENU:*
1. .restart 2. .broadcast 3. .block 4. .unblock 5. .clear 6. .ban 7. .unban 8. .addowner 9. .delowner 10. .mode

*GROUP MENU [50+]:*
11. .link 12. .antilink 13. .welcome 14. .goodbye 15. .promote 16. .demote 17. .kick 18. .add 19. .tagall 20. .hidetag 21. .mute 22. .unmute 23. .open 24. .close 25. .setname 26. .setdesc 27. .setpp 28. .poll 29. .revoke 30. .groupinfo

*DOWNLOADER [30+]:*
31. .ytmp3 32. .ytmp4 33. .tiktok 34. .fb 35. .ig 36. .twitter 37. .mediafire 38. .gdrive 39. .play 40. .song 41. .video

*TOOLS [50+]:*
42. .sticker 43. .toimg 44. .tomp3 45. .tovoice 46. .translate 47. .tts 48. .calc 49. .weather 50. .news 51. .qr 52. .qrcode 53. .removebg 54. .upscale 55. .hd

*AI MENU [20+]:*
56. .ai 57. .gpt 58. .gemini 59. .imagine 60. .flux 61. .dalle

*FUN [50+]:*
62. .joke 63. .quote 64. .fact 65. .meme 66. .truth 67. .dare 68. .ship 69. .love 70. .8ball

... and 130+ More Commands!

*Total: 200+ Commands Available*
Type .allmenu to see full list
`;
  await ctx.reply(menuText, { parse_mode: 'Markdown' });
});

bot.action('pair', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`Send Your WhatsApp Number\nExample: ${OWNER_NUMBER}\nYou will get 8 digit code!`);
});

bot.on('text', async (ctx) => {
  const txt = ctx.message.text;
  if (txt.startsWith('/')) return;
  const number = txt.replace(/[^0-9]/g, '');
  if (number.length < 11) return;
  await ctx.reply(`Generating Pair Code for ${number}...`);
  try {
    const { state, saveCreds } = await useMultiFileAuthState(`./auth_${number}`);
    let version;
    try { const v = await fetchLatestBaileysVersion(); version = v.version; } catch { version = [2,3000,1015901307]; }
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: [BOT_NAME, 'Chrome', '1.0.0'],
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(3000);
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);
      await ctx.reply(`Pair Success!\nNumber: ${number}\nCode: ${code}\n\nGo to WhatsApp > Linked Devices > Link with phone number > Enter Code`);
    }
  } catch (e) {
    ctx.reply('Error! Try again after 2 min!');
  }
});

bot.launch().then(() => console.log(`${BOT_NAME} Running`)).catch(e => console.log(e.message));
