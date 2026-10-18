import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger,useGSAP);
export function useCreativeMotion(root:RefObject<HTMLDivElement|null>,filter:string,language:string){
  // Entrance runs once; filtering and translation must not replay the hero.
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion:no-preference)',()=>{
      const scope=root.current;if(!scope)return;
      const select=gsap.utils.selector(scope);
      gsap.from(select('.hero-greeting, .hero-position, .hero-copy h1>span, .hero-subtitle, .hero-actions, .hero-proof'),{opacity:0,y:24,stagger:.08,duration:.85,ease:'power3.out'});
      gsap.to(select('.hero-photo'),{yPercent:4,rotation:1,ease:'none',scrollTrigger:{trigger:select('.creative-hero')[0],start:'top top',end:'bottom top',scrub:.7}});
    });
    mm.add('(pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
      const hero=root.current?.querySelector<HTMLElement>('.creative-hero');
      const avatar=hero?.querySelector('img');if(!hero||!avatar)return;
      const x=gsap.quickTo(avatar,'x',{duration:.6,ease:'power3.out'});
      const y=gsap.quickTo(avatar,'y',{duration:.6,ease:'power3.out'});
      const rotation=gsap.quickTo(avatar,'rotationY',{duration:.6,ease:'power3.out'});
      const move=(event:PointerEvent)=>{const bounds=hero.getBoundingClientRect();const px=(event.clientX-bounds.left)/bounds.width-.5;const py=(event.clientY-bounds.top)/bounds.height-.5;x(px*12);y(py*8);rotation(px*5);};
      const reset=()=>{x(0);y(0);rotation(0);};
      hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',reset);
      return()=>{hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);};
    });
    return()=>mm.revert();
  },{scope:root});
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion:no-preference)',()=>{
      const scope=root.current;if(!scope)return;
      const select=gsap.utils.selector(scope);
      const revealCleanups:Array<()=>void>=[];
      // Animate text in reading order. CSS never hides it, so static/reduced-motion
      // views and the content before JS loads remain fully readable.
      const revealText=(container:HTMLElement,selector:string,stagger=.075)=>{
        const targets=Array.from(container.querySelectorAll<HTMLElement>(selector));
        if(!targets.length)return;
        // Existing visible text should not blink when language or filters change.
        if(container.getBoundingClientRect().top<window.innerHeight*.9)return;
        const tween=gsap.fromTo(targets,{opacity:0,y:18},{opacity:1,y:0,duration:.8,stagger,ease:'power3.out',scrollTrigger:{trigger:container,start:'top 90%',once:true}});
        // Keyboard navigation can reach links before the scroll trigger does.
        const showOnFocus=()=>tween.progress(1);
        container.addEventListener('focusin',showOnFocus);
        revealCleanups.push(()=>container.removeEventListener('focusin',showOnFocus));
      };
      select('.about-heading, .section-heading-row, .featured-heading, .other-heading').forEach((node:HTMLElement)=>revealText(node,'.section-pill, h2, h3, .section-intro, p:not(.section-pill):not(.section-intro)'));
      select('.light-section > .section-pill, .portfolio-title, .group-label, .contact-section > .section-pill, .contact-section > .editorial-heading').forEach((node:HTMLElement)=>{
        if(node.getBoundingClientRect().top<window.innerHeight*.9)return;
        gsap.fromTo(node,{opacity:0,y:18},{opacity:1,y:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:node,start:'top 91%',once:true}});
      });
      select('.project-body').forEach((node:HTMLElement)=>revealText(node,':scope > .project-kind, :scope > h3, :scope > .project-description, :scope > .project-role, :scope > .chips, :scope > details > summary, :scope > .project-visit',.065));
      select('.bento-card, .career-card, .toolkit-card, .education-panel > div, .contact-invitation, .footer-grid > div').forEach((node:HTMLElement)=>revealText(node,':scope > .micro-label, :scope > strong, :scope > h3, :scope > p, :scope > ul, :scope > .chips, :scope > .bento-foot, :scope > a, :scope > button',.07));
      gsap.fromTo(select('.reading-progress'),{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:scope,start:'top top',end:'bottom bottom',scrub:true}});
      const chapterLinks=Array.from(scope.querySelectorAll<HTMLAnchorElement>('.featured-index a'));
      gsap.fromTo(select('.portfolio-title'),{xPercent:2},{xPercent:-3,ease:'none',scrollTrigger:{trigger:select('.portfolio-section')[0],start:'top bottom',end:'top 10%',scrub:.6}});
      select('.project-card').forEach((node:HTMLElement)=>{
        const cover=node.querySelector('.project-cover');
        gsap.fromTo(node,{rotationX:3,y:26},{rotationX:0,y:0,ease:'none',scrollTrigger:{trigger:node,start:'top bottom',end:'top 50%',scrub:.65}});
        if(cover)gsap.fromTo(cover,{rotationY:-1.5},{rotationY:0,ease:'none',scrollTrigger:{trigger:node,start:'top bottom',end:'bottom top',scrub:.75}});
        if(node.classList.contains('project-featured')){
          const chapterLink=chapterLinks.find(link=>link.hash===`#${node.id}`);
          if(chapterLink)ScrollTrigger.create({trigger:node,start:'top 42%',end:'bottom 42%',toggleClass:{targets:chapterLink,className:'is-current'},onToggle:self=>{if(self.isActive)chapterLink.setAttribute('aria-current','location');else chapterLink.removeAttribute('aria-current');}});
          const line=node.querySelector('.project-scroll-line');
          if(line)gsap.to(line,{scaleX:1,ease:'none',scrollTrigger:{trigger:node,start:'top 75%',end:'bottom 30%',scrub:.4}});
          const image=cover?.querySelector('img');
          if(image)gsap.fromTo(image,{yPercent:2},{yPercent:-2,ease:'none',scrollTrigger:{trigger:node,start:'top bottom',end:'bottom top',scrub:.6}});
        }
      });
      gsap.fromTo(select('.footer-signature'),{xPercent:3},{xPercent:-3,ease:'none',scrollTrigger:{trigger:select('.creative-footer')[0],start:'top bottom',end:'bottom bottom',scrub:.7}});
      let frame=0;
      const refresh=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>ScrollTrigger.refresh());};
      scope.addEventListener('toggle',refresh,true);
      const observer=new ResizeObserver(refresh);observer.observe(scope);
      return()=>{cancelAnimationFrame(frame);scope.removeEventListener('toggle',refresh,true);observer.disconnect();chapterLinks.forEach(link=>link.removeAttribute('aria-current'));revealCleanups.forEach(cleanup=>cleanup());};
    });
    return()=>mm.revert();
  },{scope:root,dependencies:[filter,language],revertOnUpdate:true});
}
