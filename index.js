bot.start(async function(ctx) {
  const name = ctx.from.first_name || 'Friend';
  const caption = `
╭━━━━━━━━━━━━━━━━━━╮
┃  ✨ RANA-X-MD ✨  ┃
╰━━━━━━━━━━━━━━━━━━╯

💫 আসসালামু আলাইকুম ${name} ভাই! 🙏
❤️ RANA-X-MD তে স্বাগতম!

┏━━━━━━━━━━━━━━━━━━━━┓
┃  👑 বোট তথ্য 👑     ┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🤖 নাম: RANA-X-MD
┃ 👤 ইউজার: ${name}
┃ 👑 মালিক: RANA-MD
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

bot.action('emoji', async function(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(`
╭───『 500+ EMOJI 』───╮

😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇
🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚
🥲 🥹 ☺️ 😛 😜 😝 😝 🤑 🤗 🤭
🤫 🤔 🫡 🤐 🤨 😐 😑 😶 🫥 😶‍🌫️
😏 😒 🙄 😬 😮‍💨 🤥 🫨 😌 😔 😪
🤤 😴 😷 🤒 🤕 🤢 🤮 🥵 🥶 🥴
😵 😵‍💫 🤯 🤠 🥳 🥸 😎 🤓 🧐 😕
🫤 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 🥹
😦 😧 😨 😰 😥 😢 😭 😱 😖 😣
😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈
👿 💀 ☠️ 💩 🤡 👹 👺 👻 👽 👾
🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿
🙈 🙉 🙊 🐵 🦁 🐯 🐶 🐺 🦊 🦝
❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔
❣️ 💕 💞 💓 💗 💖 💝 💘 💟 🔥
💥 ⭐ 🌟 ✨ ⚡ 💫 🎉 🎊 🎈 🎁

*TOTAL 500+ EMOJI + AUTO REACT* 🔥
*Bot এ Auto Reaction এ Use হবে!*

╰──────────────────╯
`, { parse_mode: 'Markdown' });
});
