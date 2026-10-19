// Dependency-free static build for Vercel. The installable skill stays canonical.
import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const assets=path.join(root,'skills/miguel-personal-style/assets');
const output=path.join(root,'public');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(assets,path.join(output,'assets'),{recursive:true});
const source=await readFile(path.join(assets,'examples/design-system.html'),'utf8');
// The original page lives inside assets/examples. Its parent paths point to assets.
// Rebase only quoted parent asset paths when serving that page at the site root.
const html=source.replace(/(["'])\.\.\//g,'$1/assets/');
await writeFile(path.join(output,'index.html'),html);
console.log('Built public/index.html and its local assets.');
