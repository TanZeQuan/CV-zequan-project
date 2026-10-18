import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger,useGSAP);
export function usePortfolioMotion(root:RefObject<HTMLDivElement|null>,filter:string,language:string){
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const scope=root.current;if(!scope)return;
      const find=gsap.utils.selector(scope);
      gsap.from(find('.intro h1, .intro-role, .intro-summary, .intro-actions'),{y:22,duration:.85,stagger:.075,ease:'power3.out'});
      find('.section-heading').forEach((node:Element)=>{
        gsap.from(node,{x:-22,duration:.8,ease:'power3.out',scrollTrigger:{trigger:node,start:'top 94%',once:true}});
      });
      find('.case-card').forEach((node:Element)=>{
        gsap.fromTo(node,{rotationX:4,y:32},{rotationX:0,y:0,ease:'none',scrollTrigger:{trigger:node,start:'top bottom',end:'top 65%',scrub:.5}});
        const image=node.querySelector('.case-image img');
        if(image)gsap.fromTo(image,{scale:1.045,yPercent:-1.5},{scale:1,yPercent:0,ease:'none',scrollTrigger:{trigger:node,start:'top bottom',end:'bottom top',scrub:.6}});
      });
      find('.job, .skill-card').forEach((node:Element)=>gsap.from(node,{y:18,duration:.65,ease:'power2.out',scrollTrigger:{trigger:node,start:'top 96%',once:true}}));
      const tiltMedia=window.matchMedia('(hover: hover) and (pointer: fine)');
      const move=(event:PointerEvent)=>{
        if(!tiltMedia.matches)return;
        const target=event.target instanceof Element?event.target.closest<HTMLElement>('.case-image'):null;
        if(!target)return;
        const box=target.getBoundingClientRect();
        target.style.setProperty('--tilt-x',`${-((event.clientY-box.top)/box.height-.5)*5}deg`);
        target.style.setProperty('--tilt-y',`${((event.clientX-box.left)/box.width-.5)*6}deg`);
      };
      const reset=(event:PointerEvent)=>{
        const target=event.target instanceof Element?event.target.closest<HTMLElement>('.case-image'):null;
        if(target&&!(event.relatedTarget instanceof Node&&target.contains(event.relatedTarget))){target.style.removeProperty('--tilt-x');target.style.removeProperty('--tilt-y');}
      };
      const refresh=()=>ScrollTrigger.refresh();
      scope.addEventListener('pointermove',move,{passive:true});scope.addEventListener('pointerout',reset);scope.addEventListener('toggle',refresh,true);
      const resize=new ResizeObserver(()=>ScrollTrigger.refresh());resize.observe(scope);
      return()=>{scope.removeEventListener('pointermove',move);scope.removeEventListener('pointerout',reset);scope.removeEventListener('toggle',refresh,true);resize.disconnect();find('.case-image').forEach((node:HTMLElement)=>{node.style.removeProperty('--tilt-x');node.style.removeProperty('--tilt-y');});};
    });
    return()=>mm.revert();
  },{scope:root,dependencies:[filter,language],revertOnUpdate:true});
}
