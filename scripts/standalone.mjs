import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const build=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build','--mode','standalone'],{stdio:'inherit'});
if(build.status!==0)process.exit(build.status??1);
const file='standalone/index.html';
writeFileSync(file,readFileSync(file,'utf8').replace(/type="module"\s*/g,'defer ').replace(/crossorigin\s*/g,''));
console.log('Portable browser preview: standalone/index.html');
