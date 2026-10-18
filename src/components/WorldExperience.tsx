import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { chapters, createWorldState, createWorldTimeline, resolveWorldProgress } from '../three/worldStory';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const WorldScene = lazy(() => import('../three/WorldScene'));
class WorldBoundary extends Component<{children: ReactNode; onFailure: () => void}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function WorldExperience({children}: {children: ReactNode}) {
  const root = useRef<HTMLDivElement>(null), progress = useRef<HTMLSpanElement>(null);
  const world = useRef(createWorldState()), pointer = useRef({x: 0, y: 0}), invalidate = useRef<() => void>(() => {});
  const activeRef = useRef(0);
  const [active, setActive] = useState(0), [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  const [supported] = useState(() => {
    if(typeof document==='undefined')return false;
    try{const gl=document.createElement('canvas').getContext('webgl2');const available=!!gl;gl?.getExtension('WEBGL_lose_context')?.loseContext();return available;}catch{return false;}
  }), [disabled, setDisabled] = useState(false);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const enabled = supported && !failed && !reduced && !disabled;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useGSAP(() => {
    if (!enabled || !ready || !root.current) return;
    const element = root.current;
    const nodes = [...element.querySelectorAll<HTMLElement>('[data-world]')];
    let anchors: number[] = [], maximum = 1, frame = 0;
    const driver = {scroll: 0};
    const measure = () => {
      const origin = element.getBoundingClientRect().top + window.scrollY;
      anchors = nodes.map(node => node.getBoundingClientRect().top + window.scrollY - origin);
      maximum = Math.max(1, element.offsetHeight - window.innerHeight);
    };
    const apply = () => {
      const value = resolveWorldProgress(driver.scroll * maximum, anchors, maximum);
      Object.assign(world.current, value);
      const current = Math.min(6, Math.round(value.chapter));
      if (activeRef.current !== current) { activeRef.current = current; setActive(current); }
      if (progress.current) progress.current.style.transform = `scaleX(${driver.scroll})`;
      element.dataset.phase = value.chapter.toFixed(3);
      invalidate.current();
    };
    measure();
    const timeline = createWorldTimeline(driver, { onUpdate: apply, scrollTrigger: {
      id: 'whole-portfolio-world', trigger: element, start: 'top top', end: 'bottom bottom',
      scrub: window.matchMedia('(pointer: coarse)').matches ? .35 : .7,
      invalidateOnRefresh: true, onRefresh: () => {measure(); apply();},
    }});
    const observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => ScrollTrigger.refresh()); });
    observer.observe(element);
    // Micro-interactions follow the world movement; the 3D camera remains the main narrative.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
      nodes.forEach(node => {
        const copy = node.querySelector('.chapter-copy');
        if (copy) gsap.fromTo(copy, {y: 24}, {y: -24, ease: 'none', scrollTrigger: {trigger: node, start: 'top bottom', end: 'bottom top', scrub: .7}});
      });
    });
    ScrollTrigger.refresh();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); mm.revert(); timeline.kill(); };
  }, {scope: root, dependencies: [enabled, ready], revertOnUpdate: true});

  useEffect(() => {
    if (enabled && ready) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.world));
    }, {rootMargin: '-20% 0px -55% 0px'});
    root.current?.querySelectorAll('[data-world]').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [enabled, ready]);

  return <div ref={root} className={`world-root ${enabled && ready ? 'world-live' : 'world-static'}`} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || !enabled) return;
    pointer.current.x = event.clientX / window.innerWidth * 2 - 1; pointer.current.y = 1 - event.clientY / window.innerHeight * 2; invalidate.current();
  }} onPointerLeave={() => {pointer.current.x = 0; pointer.current.y = 0; invalidate.current();}}>
    <div className="world-backdrop" aria-hidden="true">
      <div className="world-grid"/>
      {enabled && <WorldBoundary onFailure={() => setFailed(true)}><Suspense fallback={null}><WorldScene world={world} pointer={pointer} invalidateRef={invalidate} onReady={() => setReady(true)} onFailure={() => setFailed(true)}/></Suspense></WorldBoundary>}
      <div className="world-shade"/>
    </div>
    <div className="world-content">{children}</div>
    <nav className="chapter-rail" aria-label="Portfolio chapters">{chapters.map((chapter, i) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === i ? 'location' : undefined} aria-label={`${i + 1}. ${chapter.label}`}><span>{String(i + 1).padStart(2, '0')}</span><i/><b>{chapter.short}</b></a>)}</nav>
    <div className="world-hud"><span className="world-now">{String(active + 1).padStart(2, '0')} / 07 <i/> {chapters[active].label}</span><button type="button" disabled={reduced || !supported || failed} aria-pressed={disabled || reduced} onClick={() => {setDisabled(value => !value); setReady(false);}}>{reduced ? 'Reduced motion' : !supported || failed ? 'Static view' : disabled ? 'Enable 3D' : 'Disable 3D'}</button></div>
    <div className="world-progress" aria-hidden="true"><span ref={progress}/></div>
    <span className="sr-only" role="status">{reduced ? 'Reduced motion: static illustration.' : failed || !supported ? 'Static illustration: 3D is unavailable.' : disabled ? 'Motion disabled: static view.' : 'Scroll through seven connected 3D chapters.'}</span>
  </div>;
}
