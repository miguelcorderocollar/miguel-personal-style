// Run from any directory. Optional --playwright ENTRY and --chrome EXECUTABLE.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const directory=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(directory),args={};
for(let i=2;i<process.argv.length;i+=2){const key=process.argv[i].replace(/^--/,'');if(!['playwright','chrome'].includes(key)||!process.argv[i+1])throw Error('Usage: node banners/export.mjs [--playwright ENTRY] [--chrome EXECUTABLE]');args[key]=process.argv[i+1];}
const {chromium}=await import(args.playwright||'playwright');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.jpg':'image/jpeg'};
const server=http.createServer((request,response)=>{try{const file=path.resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){response.writeHead(403).end();return;}if(!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404).end();return;}response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(response);}catch{response.writeHead(400).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
try{
 browser=await chromium.launch({...(args.chrome?{executablePath:args.chrome}:{}),args:['--no-sandbox','--force-color-profile=srgb']});
 const page=await browser.newPage({viewport:{width:1440,height:720},deviceScaleFactor:1});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 for(const name of ['identity','components','dark','motion']){
  await page.goto(`http://127.0.0.1:${server.address().port}/banners/${name}.html`);await page.evaluate(()=>window.__ready);
  const overflow=await page.locator('.copy').evaluate(e=>[...e.querySelectorAll('h1,p')].some(n=>n.scrollWidth>n.clientWidth));if(overflow)throw Error(`Text overflow in ${name}`);
  if(errors.length)throw Error(errors.join('\n'));
  await page.locator('.banner').screenshot({path:path.join(directory,`${name}.jpg`),type:'jpeg',quality:95,animations:'disabled'});
  console.log(`Exported ${name}.jpg / 1440 × ${name==='identity'?720:440}`);
 }
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
