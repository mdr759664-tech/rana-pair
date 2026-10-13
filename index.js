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

function getRecentCount() {
  return Math.floor(500 + Math.random() * 350); // 500-850
}

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
┃ 📅 24/7 চালু
┗━━━━━━━━━━━━┛

✨ সুবিধা:
✅ অটো পেয়ার কোড
✅ দ্রুত ও নিরাপদ
✅ 500+ মানুষ ব্যবহার করছে

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
  ctx.reply(`📱 তোমার WhatsApp নাম
