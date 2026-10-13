const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');

const BOT_TOKEN = '8956462716:AAFx-KxRHhWNALzPzAQeDjn2WqfIt2lAsN4';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome to RANA Pair Bot!\nSend your number like this:\n+8801XXXXXXXXX'));

bot.on('text', async (ctx) => {
  let num = ctx.message.text.replace(/[^0-9]/g, '');
  if (num.length < 11) return ctx.reply('Invalid number! Example: +8801XXXXXXXXX');
  
  await ctx.reply('Please wait, generating pair code...');

  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({
      logger: pino({ level: 'silent' }),
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      printQRInTerminal: false,
      browser: ['RANA-PAIR', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    if (!sock.authState.creds.registered) {
      await delay(3000);
      let code = await sock.requestPairingCode(num);
      code = code?.match(/.{1,4}/g)?.join('-') || code;
      await ctx.reply(`Your Pair Code for ${num}:\n\n*${code}*\n\nGo to WhatsApp > Linked Devices > Link with phone number > Enter this code\n\nUse within 60 seconds`, { parse_mode: 'Markdown' });
    }
  } catch (e) {
    ctx.reply('Error: ' + e.message);
  }
});

bot.launch();
console.log('RANA Pair Bot Running...');
