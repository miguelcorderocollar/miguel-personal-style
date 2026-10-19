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
 assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(0, 0, 0)');
 assert.equal((await (await page.request.get(base+'/assets/tokens.json')).json()).defaultTheme,'dark');
 await page.locator('#theme-toggle').click();assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
 await page.reload();await page.evaluate(()=>window.__ready);assert(await page.locator('body').evaluate(e=>e.classList.contains('mcc-light')));
 await page.locator('#theme-toggle').click();assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(0, 0, 0)');
 assert(await page.evaluate(()=>{const element=document.createElement('div');element.className='mcc-style';document.body.append(element);const dark=getComputedStyle(element).backgroundColor==='rgb(0, 0, 0)';element.classList.add('mcc-light');const light=getComputedStyle(element).backgroundColor==='rgb(255, 255, 255)';element.remove();return dark&&light;}));
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
 // New recipes exercise real state, clipboard success and semantic progress.
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('#tab-motion').click();await page.evaluate(()=>window.__motionReady);
 await page.locator('#replay-reveal').click();assert(await page.locator('#recipe-reveal').evaluate(e=>[...e.children].some(child=>child.getAnimations().length>0)));
 await page.locator('#change-recipe-form').click();assert.match(await page.locator('#recipe-form svg').getAttribute('aria-label'),/cube/);
 for(let i=0;i<3;i++)await page.locator('#change-recipe-form').click();await page.waitForTimeout(220);assert.match(await page.locator('#recipe-form svg').getAttribute('aria-label'),/sphere/);assert.equal(await page.locator('#recipe-form').evaluate(e=>getComputedStyle(e).opacity),'1');
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);await page.locator('#copy-recipe-token').click();await page.waitForFunction(()=>document.getElementById('recipe-copy-label').textContent==='Copied');assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),await page.locator('#recipe-token').textContent());await page.waitForFunction(()=>document.getElementById('recipe-copy-label').textContent==='Copy this token');
 await page.locator('#run-recipe-progress').click();assert(await page.locator('#run-recipe-progress').isDisabled());await page.waitForFunction(()=>document.getElementById('recipe-progress').value===4);await page.waitForTimeout(240);assert.equal(await page.locator('#recipe-completion').textContent(),'All ready');assert(await page.locator('#recipe-progress').evaluate(e=>e.closest('.mcc-progress-shell').querySelector('.mcc-progress-fill').style.transform==='scaleX(1)'));
 await page.locator('#change-recipe-form').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#recipe-form').evaluate(e=>e.getAnimations().length),0);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#replay-reveal').click();const revealEffects=await page.locator('#recipe-reveal').evaluate(e=>[...e.children].flatMap(child=>child.getAnimations().map(a=>({duration:a.effect.getTiming().duration,delay:a.effect.getTiming().delay,frames:a.effect.getKeyframes()}))));assert(revealEffects.length>0);assert(revealEffects.every(e=>e.duration===80&&e.delay===0&&e.frames.every(f=>!f.transform)));
 assert(await page.evaluate(async()=>{const {createMotion}=await import('../motion.js');const root=document.createElement('div');root.innerHTML='<progress value="1" max="4" aria-label="Temporary progress"></progress><span>Original label</span>';document.body.append(root);const progress=root.querySelector('progress'),label=root.querySelector('span'),controller=createMotion({root});controller.bindProgress(progress);progress.value=4;controller.feedback(label,'Copied');controller.destroy();const clean=root.querySelectorAll('.mcc-progress-shell').length===0&&progress.value===4&&label.textContent==='Original label';root.remove();return clean;}));
 // A controller can be destroyed and rebound without accumulating wrappers.
 assert(await page.evaluate(async()=>{const {createMotion}=await import('../motion.js');const host=document.createElement('section');document.body.append(host);host.innerHTML='<details><summary>Question</summary><p>Answer</p></details>';const root=document.createElement('div');host.before(root);root.append(host);for(let i=0;i<2;i++){const controller=createMotion({root});controller.bindDisclosure(host.querySelector('details'));controller.destroy();}const clean=host.querySelectorAll('.mcc-disclosure-content').length===0;root.remove();return clean;}));
 assert.deepEqual(errors,[]);console.log('Passed: black default, explicit/persisted white variation, native focus/Escape, keyboard, toast reversal/long text, loading, first item, rapid notice/disclosure reversal, reduced motion, 390/320px, controller teardown, editorial replay, graphic replacement, clipboard feedback and semantic progress.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
