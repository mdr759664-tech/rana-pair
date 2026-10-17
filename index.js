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
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🌸","🌹","⭐","🎉"];

function getCountry(n){
  if(n.startsWith('880')) return 'BANGLADESH +880';
  if(n.startsWith('91')) return 'INDIA +91';
  if(n.startsWith('92')) return 'PAKISTAN +92';
  if(n.startsWith('1')) return 'USA +1';
  if(n.startsWith('44')) return 'UK +44';
  return 'OTHER';
}
async function getVersion(){ try{ let {version}=await fetchLatestBaileysVersion(); return version; }catch{ return [2,3000,1023223823]; } }

async function welcome(sock,gid,p){
  if(!welcomeOn) return;
  try{
    let pp; 
    try{ pp=await sock.profilePictureUrl(p,'image'); }catch{ pp=global.thumb; }
    let m=await sock.groupMetadata(gid);
    let name=p.split('@')[0];
    let count=m.participants.length;
    let txt=`👑 ${BOT_NAME} 👑
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
  }catch(e){}
}

function getFullMenu(){
  return `👑 ${BOT_NAME} - 800+ CMD\n💫 Emoji: 1000+ | Recent: ${recentOn?'ON':'OFF'} | Welcome: ${welcomeOn?'ON':'OFF'}`;
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
    const version=await getVersion();
    // 1st PLACE - Pair এর জন্য - Professional
    const sock=makeWASocket({
      version,
      auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,P({level:'fatal'}).child({level:'fatal'}))},
      logger:P({level:'silent'}),
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect:false,
      syncFullHistory:false,
      connectTimeoutMs:30000,
      keepAliveIntervalMs:10000
    });
    sock.ev.on('creds.update',saveCreds);
    await delay(400);
    if(!sock.authState.creds.registered){
      let code=null; for(let i=0;i<6;i++){ try{ code=await sock.requestPairingCode(number); if(code) break; }catch{ await delay(600); } }
      code=code?.match(/.{1,4}/g)?.join('-');
      await ctx.reply(`\`\`${code}\`\`\`\n\n📱 WhatsApp > Linked Devices > Link with Phone Number`,{parse_mode:'Markdown',reply_markup:{inline_keyboard:[[{text:`📋 COPY CODE ${code}`,copy_text:{text:code}}]]}});
      sock.ev.on('connection.update',async(up)=>{
        if(up.connection==='open'){
          if(!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR,{recursive:true});
          if(fs.existsSync(MAIN_DIR)) fs.rmSync(MAIN_DIR,{recursive:true,force:true});
          fs.mkdirSync(MAIN_DIR,{recursive:true});
          fs.readdirSync(authPath).forEach(f=>{ fs.copyFileSync(path.join(authPath,f),path.join(MAIN_DIR,f)); });
          await ctx.reply(`✅ BOT CONNECTED SUCCESSFULLY.\n\n📞 NUMBER : +${number}\n⚡ Google Chrome (Ubuntu) Active`);
          await delay(1000); try{sock.ws.close();}catch{} if(fs.existsSync(authPath)) fs.rmSync(authPath,{recursive:true,force:true}); setTimeout(()=>startBot(),1200);
        }
      });
      await delay(120000);
    }
  }catch(e){ ctx.reply('❌ Error: '+e.message); }
}

async function startBot(){
  try{
    const SESSION_DIR='./session/RANA-SESSION'; if(!fs.existsSync(SESSION_DIR)) return;
    const {state,saveCreds}=await useMultiFileAuthState(SESSION_DIR); let version=await getVersion();
    // 2nd PLACE - Bot Running এর জন্য - Professional
    const sock=makeWASocket({
      version,
      auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,P({level:'silent'}))},
      logger:P({level:'silent'}),
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory:false,
      markOnlineOnConnect:false,
      keepAliveIntervalMs:10000
    });
    mainSock=sock;
    sock.ev.on('creds.update',saveCreds);
    sock.ev.on('connection.update',(u)=>{ if(u.connection==='close'){ setTimeout(startBot,3000); } if(u.connection==='open'){ console.log('✅ CONNECTED - Google Chrome (Ubuntu) Active'); } });
    sock.ev.on('group-participants.update', async(u)=>{ for(let p of u.participants){ if(u.action=='add') await welcome(sock,u.id,p); } });
    sock.ev.on('call', async(c)=>{ if(!callRejectOn) return; for(let x of c){ if(x.status=='offer'){ await sock.rejectCall(x.id,x.from); } } });
    sock.ev.on('messages.upsert', async(m)=>{
      try{
        const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
        const from=msg.key.remoteJid; const isGroup=from.endsWith('@g.us');
        const body=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
        const sender=msg.key.participant||from; const isOwner=sender.includes(OWNER)||from.includes(OWNER);
        if(isGroup && autoReactOn){ let e=EMOJI[Math.floor(Math.random()*EMOJI.length)]; await sock.sendMessage(from,{react:{text:e,key:msg.key}}); }
        if(!body.startsWith(".")) return;
        let cmd=body.slice(1).trim().split(" ")[0].toLowerCase(); let args=body.slice(1).trim().split(" ").slice(1);
        if(cmd==="menu"){ await sock.sendMessage(from,{text:getFullMenu(),mentions:[sender]}, {quoted:msg}); }
        else if(cmd==="ping"){ await sock.sendMessage(from,{text:`⚡ PONG! Google Chrome (Ubuntu) Active`}); }
        else if(cmd==="welcome"){ if(!isOwner) return; if(args[0]==="on") welcomeOn=true; else if(args[0]==="off") welcomeOn=false; await sock.sendMessage(from,{text:`Welcome ${welcomeOn?'ON':'OFF'}`}); }
      }catch{}
    });
  }catch(e){ setTimeout(startBot,3000); }
}

bot.command('pair', ctx => handlePair(ctx, ctx.message.text.replace('/pair', '')));
bot.hears(/^\/pair/i, ctx => handlePair(ctx, ctx.message.text.replace(/\/pair/i, '')));
bot.start(async ctx => {
  const name=ctx.from.first_name||'Friend'; let userPhoto=global.thumb;
  try{ const photos=await ctx.telegram.getUserProfilePhotos(ctx.from.id,0,1); if(photos.total_count>0) userPhoto=photos.photos[0][photos.photos[0].length-1].file_id; }catch{}
  const caption=`👑 ${BOT_NAME} - Professional Instant\n🌍 All Country ✅\n⚡ Google Chrome (Ubuntu) Active ✅`;
  await ctx.replyWithPhoto(userPhoto,{caption:caption,reply_markup:{inline_keyboard:[[{text:'🔗 পেয়ার কোড নাও',callback_data:'pair'}]]}});
});
bot.action('pair', async ctx=>{ await ctx.answerCbQuery(); ctx.reply('📱 /pair 8801837450067'); });
bot.on('text', ctx=>{ if(ctx.message.text.startsWith('/')) return; const n=ctx.message.text.replace(/[^0-9]/g,''); if(n.length>=8&&n.length<=15) handlePair(ctx,n); });

app.get('/', (req,res)=>res.send(BOT_NAME+' Running - Google Chrome Ubuntu Active ✅'));
app.listen(process.env.PORT||10000,'0.0.0.0',()=>{ console.log('✅ SERVER RUNNING'); startBot(); });
bot.telegram.deleteWebhook().then(()=>{ bot.launch({dropPendingUpdates:true}).then(()=>{ console.log('✅ BOT STARTED - Google Chrome (Ubuntu) Active'); }); });
