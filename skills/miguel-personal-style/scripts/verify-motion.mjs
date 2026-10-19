// Behavioral checks for the native UI motion. Requires Playwright and Chromium.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),args={};
for(let i=2;i<process.argv.length;i+=2)args[process.argv[i].replace(/^--/,'')]=process.argv[i+1];
const {chromium}=await import(args.playwright||'playwright');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf','.json':'application/json','.png':'image/png'};
const server=http.createServer((req,res)=>{try{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);}catch{res.writeHead(400).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
try{
 browser=await chromium.launch({...(args.chrome?{executablePath:args.chrome}:{}),args:['--no-sandbox','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
 const base=`http://127.0.0.1:${server.address().port}`;
 await page.goto(base+'/assets/examples/design-system.html#components');await page.evaluate(()=>window.__ready);
 await page.locator('#open-dialog').click();assert(await page.locator('dialog').evaluate(e=>e.open));
 await page.locator('#close-dialog').click();await page.waitForTimeout(220);assert(!await page.locator('dialog').evaluate(e=>e.open));assert.equal(await page.evaluate(()=>document.activeElement.id),'open-dialog');
 await page.locator('#open-dialog').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('dialog').evaluate(e=>e.getAnimations().length),0);await page.keyboard.press('Escape');assert(!await page.locator('dialog').evaluate(e=>e.open));
 await page.locator('[data-notice]').first().click();await page.waitForTimeout(100);assert.equal(await page.locator('#toast').getAttribute('data-mcc-visible'),'true');
 await page.evaluate(()=>notice('Long confirmation '.repeat(35)));assert(await page.locator('#toast').evaluate(e=>e.getBoundingClientRect().right<=innerWidth));
 await page.waitForTimeout(3230);await page.evaluate(()=>notice('Interrupted dismissal'));await page.waitForTimeout(200);assert.equal(await page.locator('#toast').textContent(),'Interrupted dismissal');
 await page.locator('#loading-action').click();assert(await page.locator('#loading-action').isDisabled());await page.waitForTimeout(2600);assert(await page.locator('#loading-action').isEnabled());assert.equal(await page.locator('#loading-label').textContent(),'Try again');
 const before=await page.locator('#empty-slot').evaluate(e=>e.getBoundingClientRect().height);
 await page.locator('#add-example').click();assert(await page.locator('#filled-state').isVisible());assert.equal(await page.evaluate(()=>document.activeElement.id),'reset-empty');assert((await page.locator('#empty-slot').evaluate(e=>e.getBoundingClientRect().height))>=before);
 await page.locator('#reset-empty').click();await page.locator('#add-example').click();assert(await page.locator('#filled-state').isVisible());
 await page.locator('#dismiss-notice').click();await page.locator('#restore-notice').click();await page.waitForTimeout(200);assert(await page.locator('#inline-notice').isVisible());assert(!await page.locator('#inline-notice').evaluate(e=>e.inert));
 const summary=page.locator('#components summary').first();await summary.click();await page.waitForTimeout(200);assert(await summary.evaluate(e=>e.parentElement.open));await summary.click();await summary.click();await page.waitForTimeout(220);assert(await summary.evaluate(e=>e.parentElement.open));
 await summary.focus();await page.keyboard.press('Enter');assert(!await summary.evaluate(e=>e.parentElement.open));
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#open-dialog').click();const effects=await page.locator('dialog').evaluate(e=>e.getAnimations().map(a=>({duration:a.effect.getTiming().duration,frames:a.effect.getKeyframes()})));assert(effects.some(e=>e.duration===80));assert(effects.every(e=>e.frames.every(f=>!f.transform)));await page.keyboard.press('Escape');
 await page.locator('#open-dialog').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('dialog').evaluate(e=>getComputedStyle(e,'::backdrop').transitionDuration),'0s');await page.keyboard.press('Escape');
 for(const width of [390,320]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}px`);}
 // A controller can be destroyed and rebound without accumulating wrappers.
 assert(await page.evaluate(async()=>{const {createMotion}=await import('../motion.js');const host=document.createElement('section');document.body.append(host);host.innerHTML='<details><summary>Question</summary><p>Answer</p></details>';const root=document.createElement('div');host.before(root);root.append(host);for(let i=0;i<2;i++){const controller=createMotion({root});controller.bindDisclosure(host.querySelector('details'));controller.destroy();}const clean=host.querySelectorAll('.mcc-disclosure-content').length===0;root.remove();return clean;}));
 assert.deepEqual(errors,[]);console.log('Passed: native focus/Escape, keyboard, toast reversal/long text, loading, first item, rapid notice/disclosure reversal, reduced motion, 390/320px, controller teardown.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
