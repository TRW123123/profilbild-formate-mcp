import {getProfilbildFormate,listProfilbildPlattformen,type Mass} from './logic';
import {validate} from './schema';
import {tools} from './tools';
import {version} from '../package.json';
export interface Env {ANALYTICS?:{writeDataPoint(point:{blobs:string[];doubles:number[]}):void}}
export const serverInfo={name:'profilbild-formate',title:'Profilbild-Formate',version,websiteUrl:'https://www.profilfoto-ki.de',_meta:{developer:'Profilfoto-KI (Safak Tepecik)'}};
const versions=['2025-03-26','2025-06-18','2025-11-25'];
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'content-type, accept, mcp-protocol-version, mcp-session-id','Access-Control-Max-Age':'86400'};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'content-type':'application/json','cache-control':'no-store'}});
const error=(id:unknown,code:number,message:string,status=200)=>json({jsonrpc:'2.0',id,error:{code,message}},status);
// Es werden keine IPs geloggt oder gespeichert. Best-effort-Limiter pro Isolate, keine globale Sicherheitsgrenze.
const buckets=new Map<string,{start:number;count:number}>();
export function limited(ip:string|null){if(!ip)return false;const now=Date.now();for(const [k,v] of buckets)if(now-v.start>=60000)buckets.delete(k);let b=buckets.get(ip);if(!b){if(buckets.size>=2048)return true;b={start:now,count:0};buckets.set(ip,b);}return ++b.count>120;}
async function readBody(req:Request){const reader=req.body?.getReader();if(!reader)throw Error('Supply a JSON-RPC body.');const decoder=new TextDecoder('utf-8',{fatal:true});let body='',size=0,timedOut=false;const timer=setTimeout(()=>{timedOut=true;void reader.cancel().catch(()=>{});},5000);try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>100000){await reader.cancel();throw Error('Request exceeds 100,000 bytes.');}body+=decoder.decode(value,{stream:true});}if(timedOut)throw Error('Request body timed out after five seconds.');body+=decoder.decode();return body;}finally{clearTimeout(timer);reader.releaseLock();}}
export default {async fetch(req:Request,env:Env={}):Promise<Response>{
 const path=new URL(req.url).pathname;
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(path==='/health'&&req.method==='GET')return json({status:'ok'});
 if(path==='/'&&req.method==='GET')return new Response('Profilbild-Formate\nMaße (px/mm), Seitenverhältnis und Hinweise für Profil- und Bewerbungsfotos: Bewerbung (DE), LinkedIn, XING, WhatsApp, Instagram. Mit Quellen und Stand-Datum.\nWebsite: https://www.profilfoto-ki.de\nPOST JSON-RPC an /mcp. Kein Abruf fremder Websites, nichts wird gespeichert.\n',{headers:{...cors,'content-type':'text/plain; charset=utf-8'}});
 if(path!=='/mcp')return json({error:'Route nicht gefunden. Nutze /health oder POST /mcp.'},404);
 if(req.method!=='POST')return new Response(JSON.stringify({error:'Use POST /mcp with JSON-RPC; GET streaming is not offered.'}),{status:405,headers:{...cors,'content-type':'application/json',Allow:'POST, OPTIONS'}});
 if(limited(req.headers.get('cf-connecting-ip')))return json({error:'Zu viele Anfragen. Bitte nach einer Minute erneut versuchen.'},429);
 if(!req.headers.get('content-type')?.toLowerCase().includes('application/json'))return error(null,-32600,'Use Content-Type: application/json.',415);
 const pv=req.headers.get('mcp-protocol-version');if(pv&&!versions.includes(pv))return error(null,-32600,'Unsupported mcp-protocol-version; use 2025-03-26, 2025-06-18 or 2025-11-25.',400);
 let rpc:Record<string,unknown>;
 try{const parsed:unknown=JSON.parse(await readBody(req));if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return error(null,-32600,'Supply one JSON-RPC object; batches are not supported.',400);rpc=parsed as Record<string,unknown>;}catch{return error(null,-32700,'Could not read JSON. Supply valid JSON within 100,000 bytes and five seconds.',400);}
 const id=rpc.id??null;
 if(rpc.jsonrpc!=='2.0'||typeof rpc.method!=='string'||(rpc.id!==undefined&&rpc.id!==null&&typeof rpc.id!=='string'&&typeof rpc.id!=='number')||(rpc.params!==undefined&&(!rpc.params||typeof rpc.params!=='object'||Array.isArray(rpc.params))))return error(null,-32600,'Invalid JSON-RPC envelope or params.',400);
 const params=(rpc.params??{}) as Record<string,unknown>;
 // Notifications bekommen nie eine JSON-RPC-Antwort.
 if(!('id' in rpc))return new Response(null,{status:202,headers:cors});
 const reply=(result:unknown)=>json({jsonrpc:'2.0',id,result});
 switch(rpc.method){
 case 'initialize':return reply({protocolVersion:typeof params.protocolVersion==='string'&&versions.includes(params.protocolVersion)?params.protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false}},serverInfo});
 case 'ping':return reply({});
 case 'tools/list':return reply({tools});
 case 'tools/call':{
  const start=performance.now();let ok=false;const definition=tools.find(t=>t.name===params.name);
  try{
   if(!definition)throw Error('Unbekanntes Tool. Mit tools/list die verfügbaren Tools abrufen.');
   const args=params.arguments??{};validate(args,definition.inputSchema);
   if(definition.name==='get_profilbild_formate'){const r=getProfilbildFormate(args as {plattform:string});ok=true;
    const fmt=(m:Mass)=>`${m.bezeichnung}: ${m.px?`${m.px.breite} × ${m.px.hoehe} px${m.px_herkunft==='umrechnung_300_dpi'?' (bei 300 dpi umgerechnet)':''}`:''}${m.mm?` = ${m.mm.breite} × ${m.mm.hoehe} mm`:''}${m.seitenverhaeltnis?`, ${m.seitenverhaeltnis}`:''} [${m.kategorie}]`;
    const masse=r.masse.length?r.masse.map(fmt).join('; ')+'.':'Keine offiziellen Maße veröffentlicht.';
    return reply({structuredContent:r,content:[{type:'text',text:`${r.bezeichnung} (Stand ${r.stand}): ${masse}${r.dateiformate.length?` Dateiformate: ${r.dateiformate.join(', ')}${r.max_dateigroesse_mb?`, max. ${r.max_dateigroesse_mb} MB`:''}.`:''} ${r.einordnung} Hinweise: ${r.ausschnitt_hinweise.join(' ')} ${r.kein_amtliches_foto} Quellen: ${r.quellen.map(x=>x.url).join(' ')}`}]});}
   const t=listProfilbildPlattformen();ok=true;
   return reply({structuredContent:t,content:[{type:'text',text:`Profilbild-Plattformen (Stand ${t.stand}): ${t.plattformen.map(x=>`${x.plattform} – ${x.kurzhinweis}`).join(' | ')}. Nicht enthalten: ${t.nicht_unterstuetzt.map(x=>x.plattform).join(', ')}.`}]});
  }catch(e){return reply({isError:true,content:[{type:'text',text:e instanceof Error?e.message:'Eingabe konnte nicht verarbeitet werden. Tool-Name und Argumente prüfen.'}]});}
  finally{const ms=Math.round((performance.now()-start)*1000)/1000;const tool=definition?.name??'unknown';console.log(JSON.stringify({evt:'tool_call',tool,ok,ms}));try{if(env.ANALYTICS)env.ANALYTICS.writeDataPoint({blobs:[tool,String(ok)],doubles:[ms]});}catch{/* Monitoring darf keinen Tool-Call scheitern lassen. */}}
 }
 default:return error(id,-32601,'Unknown method. Supported: initialize, ping, tools/list, tools/call and notifications/initialized.');
 }
}};
