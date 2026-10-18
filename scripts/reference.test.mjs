import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir,access,readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const cache=path.resolve('node_modules/.cache/reference-qa');await mkdir(cache,{recursive:true});
await build({stdin:{contents:"export {default} from './src/CreativePortfolio'; export {filterCases} from './src/data/projectFilters'; export {caseStudies,jobs,skills} from './src/data/referenceContent';",resolveDir:process.cwd(),loader:'tsx'},outfile:path.join(cache,'app.cjs'),bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],logLevel:'silent'});
const require=createRequire(import.meta.url);
const {default:Portfolio,filterCases,caseStudies,jobs,skills}=require(path.join(cache,'app.cjs'));
const text=value=>renderToStaticMarkup(React.createElement('span',null,value)).slice(6,-7);
test('creative layout preserves a complete accessible hero before WebGL or motion loads',()=>{
  for(const language of ['zh','en']){
    const html=renderToStaticMarkup(React.createElement(Portfolio,{initialLanguage:language}));
    assert(html.includes('aria-labelledby="hero-title"'));
    assert(html.includes('class="hero-photo"'));
    assert(html.includes('src="./assets/avatar-cutout.webp"'));
    assert(html.includes('src="./assets/sales-crm.webp"'));
    assert(html.includes('src="./assets/client-portal.webp"'));
    assert(html.includes(language==='zh'?'查看项目':'View projects'));
    assert(!html.includes('<canvas'));
  }
});
test('Chinese and English both render all ten real projects and the full portfolio',()=>{
  for(const language of ['zh','en']){
    const html=renderToStaticMarkup(React.createElement(Portfolio,{initialLanguage:language}));
    for(const project of caseStudies){
      assert(html.includes(text(project.title[language])),project.id);
      for(const point of project.responsibilities)assert(html.includes(text(point[language])),`${project.id}: contribution preserved`);
    }
    assert.equal((html.match(/class="case-disclosure"/g)||[]).length,10);
    for(const id of ['top','content','experience','education','skills','work','freelance','learning','contact'])assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1,id);
    for(const job of jobs)assert(html.includes(text(job.company)),job.company);
    for(const skill of skills)assert(html.includes(text(skill.title[language])));
    assert(!html.includes('<canvas'));assert(!html.includes('world-backdrop'));
    assert(html.includes(language==='zh'?'关于我':'About me'));
  }
});
test('project type filters preserve all projects and return the correct web/mobile sets',()=>{
  assert.equal(filterCases('all').length,10);assert.equal(filterCases('web').length,8);assert.equal(filterCases('mobile').length,2);
  const ids=filterCases('mobile').map(p=>p.id);assert.deepEqual(ids,['instant-messaging','tea-membership']);
  assert.deepEqual(filterCases('all').slice(0,2).map(p=>p.id),['sales-crm','client-portal']);
  assert.equal(new Set([...filterCases('web'),...filterCases('mobile')].map(p=>p.id)).size,10);
});
test('all genuine image files, resume and contact actions remain available',async()=>{
  await access('public/assets/avatar-cutout.webp');
  for(const project of caseStudies){if(project.image){await access(path.join('public',project.image));assert(project.imageAlt.zh&&project.imageAlt.en);}if(project.url)assert.equal(new URL(project.url).protocol,'https:');}
  assert.equal((await readFile('public/Tan_Ze_Quan_Resume.pdf')).subarray(0,4).toString(),'%PDF');
  const html=renderToStaticMarkup(React.createElement(Portfolio));
  assert(html.includes('mailto:tzequan379@gmail.com'));assert(html.includes('tel:+60175013740'));assert(html.includes('https://github.com/TanZeQuan'));assert(html.includes('download=""'));assert(html.includes('切换为中文'));assert(html.includes('role="status"'));
});
test('every case has bilingual role, contribution, outcome and accurate private/public status',()=>{
  for(const project of caseStudies){for(const lang of ['zh','en']){assert(project.description[lang]);assert(project.role[lang]);assert(project.responsibilities.length);assert(project.responsibilities.every(p=>p[lang]));assert(project.outcome[lang]);}if(['sales-crm','client-portal','instant-messaging','tea-membership'].includes(project.id))assert.equal(project.url,undefined);}
  assert.equal(caseStudies.filter(p=>p.group==='company').length,7);assert.equal(caseStudies.filter(p=>p.group==='freelance').length,2);assert.equal(caseStudies.filter(p=>p.group==='learning').length,1);
});
test('creative theme body text and primary controls meet WCAG AA contrast',()=>{
  const lum=hex=>{const c=hex.match(/\w\w/g).map(h=>parseInt(h,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
  const contrast=(a,b)=>{const l=[lum(a),lum(b)].sort((x,y)=>y-x);return(l[0]+.05)/(l[1]+.05);};
  for(const [ink,surface] of [['f5f5f5','111111'],['a1a1aa','111111'],['f5f5f5','1a1a1a'],['a1a1aa','1a1a1a'],['8d96ee','1a1a1a'],['ffffff','5967d9'],['a1a1aa','1d1f30']])assert(contrast(ink,surface)>=4.5,`${ink} on ${surface}`);
});

test('recruiters start in English with four featured cases, clear ownership and nine case topics',()=>{
  const html=renderToStaticMarkup(React.createElement(Portfolio));
  assert(html.includes('JUNIOR FULL STACK DEVELOPER'));
  assert(html.includes('Independently built a Sales Leads CRM'));
  assert(html.includes('Featured projects'));assert(html.includes('Other projects'));
  assert.equal((html.match(/class="project-card project-featured"/g)||[]).length,4);
  assert.equal((html.match(/class="project-card project-compact"/g)||[]).length,6);
  for(const heading of ['Project overview','The problem','My role','What I built','Tech stack','Key features','Technical challenges','What I learned','Screenshots &amp; demo'])assert(html.includes(heading),heading);
  const portal=caseStudies.find(project=>project.id==='client-portal');
  assert(portal.status.en.includes('Team contribution'));
  assert.deepEqual(portal.tags,['HTML','CSS','JavaScript','Responsive UI','UI/UX']);
  assert(!portal.role.en.includes('Independent'));
  assert(html.includes('InnovatePro Sdn Bhd'));assert(!html.toLowerCase().includes('linkedin'));
});
