// Capture the self-contained showcase and check its relocated resources.
// Requires Node.js 18+, Playwright and Chromium. See references/usage.md.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i]?.replace(/^--/, '');
  if (!['output', 'playwright', 'chrome'].includes(key) || !process.argv[i + 1]) {
    throw Error('Usage: node scripts/capture-showcase.mjs [--output DIR] [--playwright ENTRY] [--chrome EXECUTABLE]');
  }
  args[key] = process.argv[i + 1];
}
const output = path.resolve(args.output || path.join(root, 'work/showcase-captures'));
const {chromium} = await import(args.playwright || 'playwright');
const types = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.ttf':'font/ttf', '.png':'image/png', '.json':'application/json'};
const server = http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end(); return; }
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(response);
  } catch { response.writeHead(400).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({...(args.chrome ? {executablePath:args.chrome} : {}), args:['--no-sandbox', '--force-color-profile=srgb', '--enable-unsafe-swiftshader']});
  const page = await browser.newPage({viewport:{width:1440, height:1100}, deviceScaleFactor:1});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const base = `http://127.0.0.1:${server.address().port}/assets/examples/`;
  await page.goto(base + 'design-system.html');
  await page.evaluate(() => window.__ready);
  await page.waitForTimeout(250);
  fs.mkdirSync(output, {recursive:true});
  await page.screenshot({path:path.join(output, 'showcase.png')});
  await page.locator('#tab-components').click();
  await page.locator('#pixel-loaders').scrollIntoViewIfNeeded();
  // Keep the loader headings below the sticky tabs in the captured frame.
  await page.evaluate(() => window.scrollTo(0, document.getElementById('pixel-loaders').getBoundingClientRect().top + window.scrollY - 90));
  await page.screenshot({path:path.join(output, 'components-dark.png')});
  await page.locator('#theme-toggle').click();
  await page.screenshot({path:path.join(output, 'components-light.png')});
  await page.locator('#theme-toggle').click();
  await page.locator('#tab-motion').click();
  await page.evaluate(() => window.__motionReady);
  await page.locator('#motion-grid canvas').first().waitFor();
  await page.evaluate(() => window.scrollTo(0, document.getElementById('motion').getBoundingClientRect().top + window.scrollY - 90));
  await page.waitForTimeout(400);
  if (await page.locator('#motion-play').getAttribute('aria-pressed') === 'true') await page.locator('#motion-play').click();
  await page.screenshot({path:path.join(output, 'motion.png')});
  await page.locator('#tab-components').click();
  for (const width of [390, 320]) {
    await page.setViewportSize({width, height:844});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('#pixel-loaders .mcc-loader i').first().evaluate(element => getComputedStyle(element).animationName), 'none');
  await page.goto(base + 'component-starter.html');
  await page.evaluate(() => window.__ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Starter overflows at 320px');
  await page.locator('#theme').click();
  assert(await page.locator('body').evaluate(element => element.classList.contains('mcc-light')));
  assert.deepEqual(errors, [], 'Browser and resource errors');
  console.log(`Captured showcase, light/dark components and motion to ${output}`);
  console.log('Passed: relocated resources, starter theme, 390/320px layouts and reduced-motion pixels.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
