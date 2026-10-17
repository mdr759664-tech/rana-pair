process.on('uncaughtException', e => console.log('UNCAUGHT:', e.message));
process.on('unhandledRejection', e => console.log('REJECTED:', e?.message));

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
const app = express();
app.use(express.json());
const bot = new Telegraf(BOT_TOKEN);

let welcomeOn = true, callRejectOn = true, autoReactOn = true;
const OWNER = "8801636487523";
const EMOJI = ["❤️","🔥","👑","😎","✨","💖","🌸","🌹","⭐","🎉"];

function getCountry(n){
  if(n.startsWith('880')) return 'BANGLADESH +880';
  if(n.startsWith('91')) return 'INDIA +91';
  if(n.startsWith('92')) return 'PAKISTAN +92';
  return 'OTHER';
}
async function getVersion(){ try{ let {version}=await fetchLatestBaileysVersion(); return version; }catch{ return [2,3000,1023223823]; } }

// ✅ STABLE WELCOME - আগের মতোই, PP সহ, লরচর করবে না
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

✨ Profile Pic Soho Welcome ✨`;
    await sock.sendMessage(gid,{image:{url:pp},caption:txt,mentions:[p]});
  }catch(e){ console.log("Welcome Error", e.message); }
}

async function handlePair(ctx, input) {
  let number = input ? input.replace(/[^0-9]/g, '') : '';
  if (number.length < 8 || number.length > 15) {
    return ctx.reply('📱 PROVIDE A PHONE NUMBER.\nEXAMPLE: /pair 8801837450067', {parse_mode:undefined});
  }
  let country=getCountry(number);
  await ctx.reply(`⌛ GENERATING PAIRING CODE FOR ${number} (${country})...`, {parse_mode:undefined});
  const authPath='./auth_'+number; const MAIN_DIR='./session/RANA-SESSION';
  if(fs.existsSync(authPath)) fs.rmSync(authPath,{recursive:true,force:true});
  try{
    const {state,saveCreds}=await useMultiFileAuthState(authPath);
    const version=await getVersion();
    const sock=makeWASocket({
      version,
      auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,P({level:'silent'}))},
      logger:P({level:'silent'}),
      browser: Browsers.macOS('Chrome'),
      markOnlineOnConnect:false,
      syncFullHistory:false,
    });
    sock.ev.on('creds.update',saveCreds);
    await delay(2000);
    if(!sock.authState.creds.registered){
      let code=null; for(let i=0;i<3;i++){ try{ code=await sock.requestPairingCode(number); if(code) break; }catch{ await delay(1000); } }
      if(!code) return ctx.reply('❌ Failed! আবার Try করো!', {parse_mode:undefined});
      code=code.match(/.{1,4}/g).join('-');
      await ctx.reply(`✅ PAIRING CODE FOR ${number}\n\n🔑 CODE: ${code}\n\nWhatsApp > Linked Devices > Link with phone number`, {
        parse_mode: undefined,
        reply_markup: { inline_keyboard: [[{ text: `📋 COPY: ${code}`, copy_text: { text: code } }]] }
      });
      sock.ev.on('connection.update',async(up)=>{
        if(up.connection==='open'){
          if(fs.existsSync(MAIN_DIR)) fs.rmSync(MAIN_DIR,{recursive:true,force:true});
          fs.mkdirSync(MAIN_DIR,{recursive:true});
          fs.readdirSync(authPath).forEach(f=>{ fs.copyFileSync(path.join(authPath,f),path.join(MAIN_DIR,f)); });
          await ctx.reply(`✅ CONNECTED +${number}\n⚡ MacOS Chrome Active - Professional`, {parse_mode:undefined});
          try{sock.ws.close();}catch{} if(fs.existsSync(authPath)) fs.rmSync(authPath,{recursive:true,force:true}); setTimeout(()=>startBot(),1200);
        }
      });
      await delay(60000);
    }
  }catch(e){ ctx.reply('❌ Error: '+e.message, {parse_mode:undefined}); }
}

async function startBot(){
  try{
    const SESSION_DIR='./session/RANA-SESSION'; if(!fs.existsSync(SESSION_DIR)) return;
    const {state,saveCreds}=await useMultiFileAuthState(SESSION_DIR); let version=await getVersion();
    const sock=makeWASocket({
      version,
      auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,P({level:'silent'}))},
      logger:P({level:'silent'}),
      browser: Browsers.macOS('Chrome'),
      syncFullHistory:false,
      markOnlineOnConnect:false,
    });
    sock.ev.on('creds.update',saveCreds);
    sock.ev.on('connection.update',(u)=>{ if(u.connection==='close') setTimeout(startBot,3000); if(u.connection==='open') console.log('✅ CONNECTED - MacOS Active - Soja Welcome'); });
    sock.ev.on('group-participants.update', async(u)=>{ for(let p of u.participants){ if(u.action=='add') await welcome(sock,u.id,p); } });
    sock.ev.on('call', async(c)=>{ if(!callRejectOn) return; for(let x of c){ if(x.status=='offer') await sock.rejectCall(x.id,x.from); } });
    sock.ev.on('messages.upsert', async(m)=>{
      try{
        const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
        const from=msg.key.remoteJid; const isGroup=from.endsWith('@g.us');
        const body=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
        if(!body.startsWith(".")) return;
        let cmd=body.slice(1).trim().split(" ")[0].toLowerCase();
        if(cmd==="menu") await sock.sendMessage(from,{text:`👑 ${BOT_NAME} MENU\nWelcome: ${welcomeOn?'ON':'OFF'}`});
        else if(cmd==="ping") await sock.sendMessage(from,{text:`⚡ PONG! MacOS Active`});
      }catch{}
    });
  }catch(e){ setTimeout(startBot,3000); }
}

bot.command('pair', ctx => handlePair(ctx, ctx.message.text.replace('/pair','')));
bot.hears(/^\/pair/i, ctx => handlePair(ctx, ctx.message.text.replace(/\/pair/i,'')));
bot.start(async ctx => {
  const name=ctx.from.first_name||'Friend'; let userPhoto=global.thumb;
  try{ const p=await ctx.telegram.getUserProfilePhotos(ctx.from.id,0,1); if(p.total_count>0) userPhoto=p.photos[0][p.photos[0].length-1].file_id; }catch{}
  await ctx.replyWithPhoto(userPhoto,{caption:`👑 ${BOT_NAME}\n⚡ MacOS Chrome Active - Professional\n👋 Soja Welcome PP`,reply_markup:{inline_keyboard:[[{text:'🔗 পেয়ার কোড নাও',callback_data:'pair'}]]}});
});
bot.action('pair', async ctx=>{ await ctx.answerCbQuery(); ctx.reply('📱 /pair 8801837450067 লেখো', {parse_mode:undefined}); });
bot.on('text', ctx=>{ if(ctx.message.text.startsWith('/')) return; const n=ctx.message.text.replace(/[^0-9]/g,''); if(n.length>=8&&n.length<=15) handlePair(ctx,n); });

app.get('/', (req,res)=>res.send(BOT_NAME+' Running ✅'));
app.listen(process.env.PORT||10000,'0.0.0.0',()=>{ console.log('✅ SERVER RUNNING'); startBot(); });
(async()=>{
  for(let i=0;i<5;i++){ try{ await bot.telegram.deleteWebhook({drop_pending_updates:true}); break; }catch(e){ await new Promise(r=>setTimeout(r,1000)); } }
  for(let i=0;i<5;i++){ try{ await bot.launch({dropPendingUpdates:true}); console.log('✅ BOT STARTED - MacOS Active - Soja Welcome'); break; }catch(e){ console.log(`Retry ${i+1}:`, e.message); await new Promise(r=>setTimeout(r,3000)); } }
})();
