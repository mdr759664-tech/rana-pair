process.on('uncaughtException', e => console.log(e.message));
process.on('unhandledRejection', e => console.log(e.message));

const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');
const fs = require('fs');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_NAME = 'RANA-X-MD';
const BOT_IMAGE = 'https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg';
const OWNER_NUMBER = '8801636487523';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021';

const app = express();
app.get('/', (req,res) => res.send(BOT_NAME + ' Running ✅'));
app.listen(process.env.PORT || 10000, '0.0.0.0', ()=> console.log('✅ Port OK'));

const bot = new Telegraf(BOT_TOKEN);

// ✅ Copy Button - No ok popup
bot.action(/copy_(.*)/, async ctx => { try{ await ctx.answerCbQuery(); }catch{} });

bot.start(async ctx => {
  const name = ctx.from.first_name || 'Friend';
  let pic = BOT_IMAGE;
  try{
    const p = await ctx.telegram.getUserProfilePhotos(ctx.from.id,0,1);
    if(p.total_count>0) pic = p.photos[0][0].file_id;
  }catch{}
  await ctx.replyWithPhoto(pic, {
    caption: `╭━━━━━━━━━━━━━━━━━━╮\n┃ ✨ ${BOT_NAME} ✨ ┃\n╰━━━━━━━━━━━━━━━━━━╯\n\n💫 আসসালামু আলাইকুম ${name} ভাই! 🙏\n❤️ RANA-X-MD তে স্বাগতম!\n\n┏━━━━━━━━━━━━━━━━━━━━┓\n┃ 👑 বোট তথ্য 👑 ┃\n┣━━━━━━━━━━━━━━━━━━━━┫\n┃ 🤖 নাম: ${BOT_NAME}\n┃ 👤 ইউজার: ${name}\n┃ 🟢 স্ট্যাটাস: Active ✅\n┗━━━━━━━━━━━━━━━━━━━━┛\n\n👇 Pair Code নাও! 👇`,
    reply_markup: { inline_keyboard: [
      [{ text: '🔗 পেয়ার কোড নাও', callback_data: 'pair' }],
      [{ text: '📜 মেনু [200+]', callback_data: 'menu' }],
      [{ text: '🎭 Emoji [500+]', callback_data: 'emoji' }],
      [{ text: '📢 চ্যানেল', url: CHANNEL_LINK }, { text: '👑 মালিক', url: 'https://wa.me/' + OWNER_NUMBER }]
    ]}
  });
});

bot.action('menu', async ctx => { await ctx.answerCbQuery(); await ctx.reply(`╭───『 ${BOT_NAME} 200+ 』───╮\n🔥 200+ COMMANDS 🔥\n╰──────────────────╯`, { parse_mode: 'Markdown' }); });
bot.action('emoji', async ctx => { await ctx.answerCbQuery(); await ctx.reply(`╭───『 500+ EMOJI 』───╮\n😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇\n╰──────────────────╯`); });
bot.action('pair', async ctx => { await ctx.answerCbQuery(); await ctx.reply(`📱 তোমার WhatsApp নাম্বার দাও\nEx: ${OWNER_NUMBER}`); });

// ✅ 1000% CONNECT + সুন্দর Design
bot.on('text', async ctx => {
  let txt = ctx.message.text;
  if(txt.startsWith('/')) return;
  let number = txt.replace(/[^0-9]/g,'');
  if(number.length < 11) return;

  const dir = './auth_' + number;
  if(fs.existsSync(dir)) fs.rmSync(dir,{recursive:true,force:true});

  try{
    const { state, saveCreds } = await useMultiFileAuthState(dir);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: 'fatal' })) },
      logger: P({ level: 'silent' }),
      browser: ['Ubuntu','Chrome','20.0.04'],
      printQRInTerminal: false
    });
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async u => {
      if(u.connection === 'open'){
        await ctx.reply(`╭━━━━━━━━━━━━━━━━━━╮\n┃ ✅ 1000% CONNECTED ┃\n╰━━━━━━━━━━━━━━━━━━╯\n\n🎉 ${number} Connected!\n🤖 ${BOT_NAME} Ready!`);
      }
    });

    await delay(8000);
    if(sock.authState.creds.registered) return ctx.reply('⚠️ Already Linked!');

    let code = await sock.requestPairingCode(number);
    code = code.replace(/-/g,'').toUpperCase();

    // ✅ তোমার চাওয়া মতো সুন্দর Design
    await ctx.reply(`
╭━━━━━━━━━━━━━━━━━━╮
┃ 🔑 RANA PAIR CODE ┃
╰━━━━━━━━━━━━━━━━━━╯

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 📱 Number: ${number}
┃ 🔑 CODE: ${code}
┃ ⏰ Valid: 30 Sec
┃ 🟢 Status: Active
┗━━━━━━━━━━━━━━━━━━━━┛

💡 WhatsApp > Linked Devices > Link with phone number এ বসাও!
`, { parse_mode: 'Markdown' });

    await ctx.replyWithHTML(`<code>${code}</code>`, {
      reply_markup: { inline_keyboard: [[{ text: `📋 COPY CODE: ${code}`, callback_data: `copy_${code}` }]] }
    });

    setTimeout(()=> { if(fs.existsSync(dir)) fs.rmSync(dir,{recursive:true,force:true}); }, 120000);

  }catch(e){
    console.log(e.message);
    ctx.reply(`❌ Error: ${e.message}\n\n1. WhatsApp Update করো\n2. Number একই Phone এর দাও\n3. Koyeb এ Deploy দাও`);
  }
});

bot.launch({ dropPendingUpdates: true });
