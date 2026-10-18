import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Language } from './data/referenceContent';
gsap.registerPlugin(ScrollTrigger,useGSAP);
const Prism=lazy(()=>import('./PrismScene'));
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?null:this.props.children;}
}
export default function CreativeSculpture({language}:{language:Language}){
  const root=useRef<HTMLDivElement>(null),progressRef=useRef({value:0}),pointerRef=useRef({x:0,y:0}),renderRef=useRef<()=>void>(()=>{});
  const [enabled,setEnabled]=useState(false),[paused,setPaused]=useState(false),[visible,setVisible]=useState(false),[entered,setEntered]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia('(min-width:800px) and (prefers-reduced-motion:no-preference)');
    const update=()=>{if(!media.matches){setEnabled(false);return;}try{const test=document.createElement('canvas'),gl=test.getContext('webgl2');setEnabled(!!gl);gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setEnabled(false);}};
    update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    const element=root.current?.closest('.creative-hero');if(!element)return;
    let intersects=false;const update=()=>setVisible(intersects&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{intersects=entry.isIntersecting;if(intersects)setEntered(true);update();});
    observer.observe(element);document.addEventListener('visibilitychange',update);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};
  },[]);
  useGSAP(()=>{
    if(!enabled||paused)return;
    const hero=root.current?.closest('.creative-hero');
    gsap.to(progressRef.current,{value:1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7},onUpdate:()=>{if(visible)renderRef.current();}});
  },{scope:root,dependencies:[enabled,paused,visible],revertOnUpdate:true});
  return <div className="sculpture-control" ref={root}>
    <div className="creative-sculpture" aria-hidden="true">{enabled&&!paused&&entered&&<SceneBoundary><Suspense fallback={null}><Prism progressRef={progressRef} pointerRef={pointerRef} renderRef={renderRef} active={visible}/></Suspense></SceneBoundary>}</div>
    {enabled&&<button className="motion-button" type="button" aria-pressed={!paused} aria-label={paused?(language==='zh'?'启用 3D 动画':'Enable 3D animation'):(language==='zh'?'关闭 3D 动画':'Disable 3D animation')} onClick={()=>setPaused(v=>!v)}>3D {paused?'OFF':'ON'}</button>}
  </div>;
}
