import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Language } from './data/referenceContent';

gsap.registerPlugin(useGSAP,ScrollTrigger);
const Scene=lazy(()=>import('./SpatialScene'));
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<img className="scene-fallback" src="./assets/sales-crm.png" alt=""/>:this.props.children;}
}

export default function SpatialShowcase({language}:{language:Language}){
  const root=useRef<HTMLElement>(null),progress=useRef({value:0}),pointer=useRef({x:0,y:0}),render=useRef<()=>void>(()=>{});
  const [canRender,setCanRender]=useState(false),[paused,setPaused]=useState(false),[inView,setInView]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia('(min-width: 800px) and (prefers-reduced-motion: no-preference)');
    const update=()=>{
      if(!media.matches){setCanRender(false);return;}
      try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');setCanRender(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setCanRender(false);}
    };
    update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    const el=root.current;if(!el)return;
    let intersects=false;
    const update=()=>setInView(intersects&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{intersects=entry.isIntersecting;update();},{rootMargin:'100px'});
    observer.observe(el);document.addEventListener('visibilitychange',update);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};
  },[]);
  useGSAP(()=>{
    if(!canRender||paused)return;
    gsap.to(progress.current,{value:1,ease:'none',scrollTrigger:{trigger:root.current,start:'top bottom',end:'bottom top',scrub:.65},onUpdate:()=>render.current()});
  },{scope:root,dependencies:[canRender,paused],revertOnUpdate:true});
  const live=canRender&&!paused&&inView;
  return <section ref={root} className="spatial-showcase" aria-labelledby="spatial-title">
    <div className="spatial-caption"><span className="spatial-index">01 / INTERFACE ARCHITECTURE</span><h2 id="spatial-title">{language==='zh'?<>让界面，<br/><em>多一层可能。</em></>:<>Interfaces.<br/><em>With dimension.</em></>}</h2><p>{language==='zh'?'从前端界面到 API 与业务流程，将复杂需求连接为清晰、易用的体验。':'Connecting interfaces, APIs and business workflows into clear, usable experiences.'}</p><a className="spatial-link" href="#work">{language==='zh'?'探索项目':'Explore the work'} <span aria-hidden="true">↗</span></a></div>
    <div className={`spatial-stage ${live?'is-live':''}`} aria-hidden="true">
      <div className="spatial-grid"/>
      <div className="spatial-static"><img src="./assets/sales-crm.png" alt=""/><img src="./assets/client-portal.png" alt=""/></div>
      {live&&<div className="spatial-canvas"><SceneBoundary><Suspense fallback={<img className="scene-fallback" src="./assets/sales-crm.png" alt=""/>}><Scene progressRef={progress} pointerRef={pointer} renderRef={render}/></Suspense></SceneBoundary></div>}
      <span className="stage-label">UI / LOGIC / DATA</span>
    </div>
    <div className="spatial-toolbar"><span>{language==='zh'?'界面结构可视化':'An exploration of interface architecture'}</span>{canRender&&<button type="button" onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?(language==='zh'?'启用 3D':'Enable 3D'):(language==='zh'?'静态视图':'Static view')}</button>}<a href="#work">{language==='zh'?'跳到项目 ↓':'Skip to projects ↓'}</a></div>
  </section>;
}
