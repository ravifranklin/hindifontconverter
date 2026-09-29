import '../scripts/sites-env.mjs';
import { Miniflare } from 'miniflare';
import path from 'node:path';
import {readdirSync} from 'node:fs';
const dir=path.resolve('dist/server');
const entries=readdirSync(dir,{recursive:true}).filter(x=>/\.(m?js)$/.test(x));
const files=['index.js',...entries.filter(x=>x!=='index.js')];
const mf=new Miniflare({host:'127.0.0.1',port:8787,compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],modules:files.map(x=>({type:'ESModule',path:path.join(dir,x)})),modulesRoot:dir,assets:{directory:path.resolve('dist/client'),binding:'ASSETS',routerConfig:{has_user_worker:true}}});
console.log('Production Worker ready: '+await mf.ready);

