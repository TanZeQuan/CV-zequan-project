import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir, readFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const cache=path.resolve('node_modules/.cache/hero-qa');
await mkdir(cache,{recursive:true});
const settings={bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react-dom','react/jsx-runtime','three','@react-three/fiber'],loader:{'.css':'empty','.webp':'dataurl'},logLevel:'silent'};
await build({...settings,stdin:{contents:"export * from './src/three/worldStory'; export * from './src/data/projects';",resolveDir:process.cwd(),loader:'ts'},outfile:path.join(cache,'logic.cjs')});
await build({...settings,entryPoints:['src/App.tsx'],outfile:path.join(cache,'app.cjs')});
const require=createRequire(import.meta.url);
const {createWorldState,sampleWorldPose,createWorldTimeline,resolveWorldProgress,chapters,moreProjects}=require(path.join(cache,'logic.cjs'));
const {default:App}=require(path.join(cache,'app.cjs'));

const anchors=[0,1700,3450,5100,10000,12500,14800],end=16600;
test('real GSAP scroll driver visits all seven world stations and reverses exactly',()=>{
  const driver={scroll:0},timeline=createWorldTimeline(driver,{paused:true});
  try{
    const start=sampleWorldPose(createWorldState(),false),positions=[];
    for(let i=0;i<7;i++){
      timeline.progress(anchors[i]/end);
      const state=resolveWorldProgress(driver.scroll*end,anchors,end),pose=sampleWorldPose(state,false);
      assert(Math.abs(state.chapter-i)<.001);positions.push(pose.camera[0]);
    }
    assert.equal(new Set(positions.map(n=>n.toFixed(2))).size,7);
    timeline.progress(1);assert.equal(driver.scroll,1);
    timeline.progress(0);assert.deepEqual(sampleWorldPose(resolveWorldProgress(driver.scroll*end,anchors,end),false),start);
  }finally{timeline.kill()}
});

test('whole-page camera path is finite and continuous at 10,001 desktop/mobile samples',()=>{
  for(const mobile of [false,true]){
    let previous;
    for(let i=0;i<=10000;i++){
      const pose=sampleWorldPose(resolveWorldProgress(i/10000*end,anchors,end),mobile);
      assert([...pose.camera,...pose.target,pose.station,pose.bridge].every(Number.isFinite));
      assert(pose.camera[2]>9);assert(pose.phase>=0&&pose.phase<=6);
      if(previous)assert(Math.hypot(...pose.camera.map((v,j)=>v-previous[j]))<.2);
      previous=pose.camera;
    }
    for(const position of anchors.slice(1)){
      const before=sampleWorldPose(resolveWorldProgress(position-.001,anchors,end),mobile);
      const after=sampleWorldPose(resolveWorldProgress(position+.001,anchors,end),mobile);
      assert(Math.hypot(...after.camera.map((v,i)=>v-before.camera[i]))<.001,'No camera jump at chapter boundary');
    }
  }
});

test('the complete portfolio renders without a DOM, GPU or loaded Canvas',()=>{
  const html=renderToStaticMarkup(React.createElement(App));
  assert(!html.includes('<canvas'));
  assert.match(html,/hero-photo/);assert.match(html,/FULL STACK/);
  for(const text of ['Sales Leads','CRM Client','Instant Messaging','Tea Brand','Conference Website','Digital Payment','Digital Asset Trading Platform','AZ Lab website','Sneaker Store','InnovatePro','M Focus','Diploma in Information Technology','Investment Marketing','Warehouse Packing','Copy email'])assert(html.includes(text),text);
  for(const id of ['top','work','experience','education','skills','contact'])assert(html.includes(`id="${id}"`),id);
  assert.match(html,/mailto:tzequan379@gmail.com/);assert.match(html,/tel:\+60175013740/);assert.match(html,/Tan_Ze_Quan_Resume.pdf/);
});

test('reduced-motion initial render keeps the complete accessible static introduction',()=>{
  globalThis.window={matchMedia:()=>({matches:true})};
  try{
    const html=renderToStaticMarkup(React.createElement(App));
    assert.match(html,/hero-photo/);assert.match(html,/JUNIOR FULL STACK DEVELOPER/);
    assert(!html.includes('<canvas'));assert.match(html,/Skip to content/);
  }finally{delete globalThis.window}
});

test('filtering/reflow can shorten the archive without corrupting later chapter anchors',()=>{
  const shorter=[0,1700,3450,5100,7000,9500,11800];
  for(let i=0;i<7;i++){
    const state=resolveWorldProgress(shorter[i],shorter,13600);
    assert.equal(state.chapter,i);assert.equal(state.focus,0);
  }
  assert.equal(resolveWorldProgress(-100,shorter,13600).chapter,0);
  assert.equal(resolveWorldProgress(1e9,shorter,13600).chapter,6);
});

test('all seven archive projects, five original screenshots, original PDF and skill plan survive',async()=>{
  assert.equal(moreProjects.length,7);
  assert.equal(moreProjects.filter(p=>p.category==='Mobile').length,2);
  assert.equal(moreProjects.filter(p=>p.category==='Web & Freelance').length,5);
  for(const project of moreProjects.filter(p=>p.image))await access(path.join('public',project.image));
  assert.equal((await readFile('public/Tan_Ze_Quan_Resume.pdf')).subarray(0,4).toString(),'%PDF');
  await access('IMPLEMENTATION_PLAN.md');
});
