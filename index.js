process.on('uncaughtException', e => console.log('UNCAUGHT:', e.message));
process.on('unhandledRejection', e => console.log('REJECTED:', e.message));

global.botName = "RANA-X-MD";
global.ownerName = "🐬⃟ᴠͥɪͣᴘͫ×͜×🇷┳◇┳𝗝♥︎‿♥︎𝗥𝗔𝗡𝗔";
global.channelLink = "https://whatsapp.com/channel/0029VbDjPSq9mrGZ25AYA021";
global.thumb = "https://i.ibb.co/tHWJrz3/IMG-20231128-WA0005.jpg";

const { Telegraf } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, delay, Browsers } = require('@whiskeysockets/baileys');
const P = require('pino');
const express = require('express');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_NAME = global.botName;
const CHANNEL_LINK = global.channelLink;
const OWNER_NUMBER = '+8801636487523';

const app = express();
app.use(express.json());
const bot = new Telegraf(BOT_TOKEN);

let mainSock = null;
let welcomeOn = true, callRejectOn = true, autoReactOn = true, recentOn = true;
const OWNER = "8801636487523";
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🥰","😍","😘","😻","😂","🤣","😊","🥹","😇","🤗","🤩","🥳","😭","😱","💀","🤖","🌹","🌸","🌺","🌻","🌼","🍀","💥","⭐","🌟","⚡","💫","🎉","🎊","🎁","🏆","💯","✅","💙","💚","💛","💜","🖤","🤍","💕","💞","👀","🧠","👶","👦","👧","🧑","👨","👩","👮","👷","👩‍⚕️","👨‍⚕️","🦸","🎅","🧙","🐶","🐱","🐭","🐰","🦊","🐻","🐼","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦉","🐺","🐴","🦄","🐝","🦋","🐢","🐍","🦎","🐙","🦀","🐠","🐟","🐬","🐳","🦈","🌵","🎄","🌲","🌴","🌱","🌿","🍀","🍃","🌾","💐","🌹","🌺","🌸","🌞","🌎","💫","⭐","✨","🔥","🌈","🍎","🍌","🍉","🍇","🍓","🍒","🍑","🥭","🍍","🍅","🥑","🥦","🌶️","🌽","🥕","🍞","🧀","🍗","🍔","🍕","🌮","🍝","🍣","🍱","🍤","🍚","🍰","🎂","🍭","🍫","🍿","🍩","☕","🎆","🎈","🎉","🎊","🏆","🥇","⚽","🏀","🎾","🎯","🎮","🎲","🎭","🎨","👓","👔","👕","👖","👗","👑","🎩","💄","💍","🎵","🎤","📱","💻","📷","💡","📚","💰","📦","✏️","📝","💼","📅","📌","🔒","🔑","🔨","⚔️","💣","🔧","⚙️","🔗","🧪","🔬","🚪","🛏️","🚽","🧹","⚠️","🚫","⬆️","➡️","⬇️","⬅️","🔃","🔄","✅","❌","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🏳️","🚩"];

function getCountry(n){
  if(n.startsWith('880')) return 'BANGLADESH +880';
  if(n.startsWith('91')) return 'INDIA +91';
  if(n.startsWith('92')) return 'PAKISTAN +92';
  if(n.startsWith('1')) return 'USA +1';
  if(n.startsWith('44')) return 'UK +44';
  return 'OTHER';
}
async function getVersion(){ try{ let {version}=await fetchLatestBaileysVersion(); return version; }catch{ return [2,3000,1023223823]; } }

// 🔥 SOJA WELCOME - BEKA HOBE NA + PROFILE PIC - তুমি যেটা দিছো!
async function welcome(sock,gid,p){
  if(!welcomeOn) return;
  try{
    let pp; 
    try{ pp=await sock.profilePictureUrl(p,'image'); }catch{ pp=global.thumb; }
    let m=await sock.groupMetadata(gid);
    let name=p.split('@')[0];
    let count=m.participants.length;

    let txt=
`👑 ${BOT_NAME} 👑
🌸 WELCOME 🌸

💖 আসসালামু আলাইকুম @${name} 💖

🏰 Group: ${m.subject}
👤 Name: @${name}
🆔 Number: +${name}
👥 Member: ${count} তম

👑 Owner: +${OWNER}
🤖 Bot: ${BOT_NAME}

✨ Profile Pic Soho Welcome ✨
🌍 Enjoy Your Stay 🌍`;

    await sock.sendMessage(gid,{image:{url:pp},caption:txt,mentions:[p]});
  }catch(e){ console.log("Welcome Error", e.message); }
}

function getFullMenu(){
  let cmds=[]; for(let i=1;i<=800;i++) cmds.push(`│ ${i}. .cmd${i}`);
  return `👑 ${BOT_NAME} - 800+ CMD\n💫 Emoji: 1000+ | Recent: ${recentOn?'ON 🟢':'OFF 🔴'} | Welcome: ${welcomeOn?'ON 🟢':'OFF 🔴'}\n\nMAIN: .menu .menu2 .menu3 .menu4 .ping .alive\nOWNER: .welcome on/off .react on/off .recent on/off .call on/off\n\n📜 800+:\n${cmds.slice(0,150).join("\n")}\n│ ... 650 more Use .menu2 .menu3 .menu4`;
}

async function handlePair(ctx, input) {
  let number = input ? input.replace(/[^0-9]/g, '') : '';
  if (number.length < 8 || number.length > 15) {
    return ctx.reply('📱 PROVIDE A PHONE NUMBER.\n\nEXAMPLE: /pair +919876543210\n🇧🇩 BD: /pair 8801837450067');
  }
  let country=getCountry(number);
  await ctx.reply(`⌛ GENERATING PAIRING CODE FOR ${number} (${country}), WAIT 20 SECONDS...`);
  const authPath='./auth_'+number; const MAIN_DIR='./session/RANA-SESSION';
  if(fs.existsSync(authPath)) fs.rmSync(authPath,{recursive:true,force:true});
  try{
    const {state,saveCreds}=await useMultiFileAuthState(authPath);
    const {version}=await fetchLatestBaileysVersion();
    const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,P({level:'fatal'}).child({level:'fatal'}))},logger:P({level:'silent'}),browser:Browsers.ubuntu('Chrome'),markOnlineOnConnect:false,syncFullHistory:false,connectTimeoutMs:60000});
    sock.ev.on('creds.update',saveCreds);
    sock.ev.on('call', async(calls)=>{ for(let call of calls){ if(call.status==='offer'){ await sock.rejectCall(call.id,call.from); } } });
    await delay(1000);
    if(!sock.authState.creds.registered){
      let code=null; for(let i=0;i<5;i++){ try{ code=await sock.requestPairingCode(number); if(code) break; }catch{ await delay(800); } }
      code=code?.match(/.{1,4}/g)?.join('-');
      await ctx.reply(`\`\`${code}\`\`\`\n\n📱 WhatsApp > Linked Devices > Link with Phone Number`,{parse_mode:'Markdown',reply_markup:{inline_keyboard:[[{text:`📋 COPY CODE ${code}`,copy_text:{text:code}}],[{text:'Owner',url:CHANNEL_LINK},{text:'Group',url:'https://t.me'}]]}});
      let connected=false;
      sock.ev.on('connection.update',async(up)=>{
        if(up.connection==='open'){
