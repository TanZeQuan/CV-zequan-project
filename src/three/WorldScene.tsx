import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { ACESFilmicToneMapping, DoubleSide, MathUtils, Shape, SRGBColorSpace, TextureLoader, Vector3 } from 'three';
import type { Group, Texture } from 'three';
import { InterfacePlate } from './InterfacePlate';
import { makePanelTexture, makePortalTexture } from './worldTextures';
import { sampleWorldPose } from './worldStory';
import type { WorldState } from './worldStory';
import shot1 from '../assets/project-1.webp?inline';
import shot2 from '../assets/project-2.webp?inline';
import shot3 from '../assets/project-3.webp?inline';
import shot4 from '../assets/project-4.webp?inline';
import shot5 from '../assets/project-5.webp?inline';
import portrait from '../assets/portrait.webp?inline';

interface Props { world: RefObject<WorldState>; pointer: RefObject<{x: number; y: number}>; invalidateRef: RefObject<() => void>; onReady: () => void; onFailure: () => void }
const metal = '#486d5b';
const sceneFocus = (world: RefObject<WorldState>, index: number) => Math.floor(world.current.chapter) === index ? world.current.focus : world.current.chapter < index ? 0 : 1;
function Panel({texture, width = 3, height = 1.875, dark = false}: {texture: Texture; width?: number; height?: number; dark?: boolean}) {
  return <><mesh><boxGeometry args={[width + .12, height + .12, .14]}/><meshStandardMaterial color={dark ? '#294a3e' : '#8cac91'} metalness={.6} roughness={.28}/></mesh><mesh position-z={.076}><planeGeometry args={[width, height]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh></>;
}
function Label({title, caption, lines = [], light = true, width = 3, height = 1.875}: {title: string; caption: string; lines?: readonly string[]; light?: boolean; width?: number; height?: number}) {
  const linesKey = lines.join('\n');
  const texture = useMemo(() => makePanelTexture(title, caption, linesKey ? linesKey.split('\n') : [], light, width / height), [title, caption, linesKey, light, width, height]);
  useEffect(() => {return () => texture.dispose();}, [texture]);
  return <Panel texture={texture} width={width} height={height} dark={!light}/>;
}
function Platform({width = 6, depth = 3.8}: {width?: number; depth?: number}) {
  return <><mesh position={[0,-2.25,0]}><boxGeometry args={[width,.14,depth]}/><meshStandardMaterial color="#17362d" metalness={.62} roughness={.3}/></mesh><mesh position={[0,-2.17,depth/2-.04]}><boxGeometry args={[width-.3,.014,.025]}/><meshBasicMaterial color="#a9e3bd"/></mesh></>;
}

function Engine({world}: {world: RefObject<WorldState>}) {
  const group = useRef<Group>(null), front = useRef<Group>(null), back = useRef<Group>(null);
  useFrame(() => {const f=sceneFocus(world,0);if(!group.current)return;group.current.rotation.set(-.1+f*.1,-.32-f*.2,-.06);group.current.scale.setScalar(1+f*.08);if(front.current)front.current.position.z=.3+f*1.1;if(back.current)back.current.position.z=-.5-f*.85;});
  return <group ref={group}><group ref={front}><InterfacePlate kind="interface"/></group><InterfacePlate kind="workflow"/><group ref={back}><InterfacePlate kind="data"/></group>{[-1,1].flatMap(x=>[-1,1].map(y=><mesh key={`${x}${y}`} position={[x*2.5,y*1.65,-.25]}><boxGeometry args={[.06,.06,3.8]}/><meshStandardMaterial color={metal} metalness={.8} roughness={.22}/></mesh>))}<Platform/></group>;
}
function LeadSystem({world}: {world: RefObject<WorldState>}) {
  const cards=useRef<(Group|null)[]>([]), token=useRef<Group>(null);
  useFrame(()=>{const f=sceneFocus(world,1);cards.current.forEach((card,i)=>{if(card){card.rotation.y=(i-1)*-.16+Math.sin(f*Math.PI)*.08;card.position.z=Math.sin(f*Math.PI+i*.6)*.35;card.position.y=.3+Math.sin(f*Math.PI+i*.4)*.2;}});if(token.current){token.current.position.x=-2.3+f*4.6;token.current.rotation.y=f*Math.PI*2;}});
  return <group>{['Import & clean','Assign','Follow through'].map((title,i)=><group key={title} ref={el=>{cards.current[i]=el;}} position={[(i-1)*2.1,.3,0]}><Label title={title} caption={`0${i+1} / SALES LEADS CRM`} lines={i===0?['CSV / Google Sheets','Duplicate checks']:i===1?['Country rules','Role-based access']:['Tasks & follow-ups','Reports']} width={1.85} height={2.55} light={i!==1}/></group>)}<mesh position={[0,-1.35,.15]}><boxGeometry args={[5.7,.045,.055]}/><meshBasicMaterial color="#75b98e"/></mesh><group ref={token} position={[-2.3,-1.35,.15]}><mesh rotation-z={Math.PI/4}><boxGeometry args={[.16,.16,.16]}/><meshStandardMaterial color="#d5f7cf" emissive="#8dc494" emissiveIntensity={.6}/></mesh></group><Platform width={6.8}/></group>;
}
function Portal({world}: {world: RefObject<WorldState>}) {
  const screen=useRef<Group>(null), side=useRef<Group>(null);
  const texture=useMemo(()=>makePortalTexture(),[]);
  useEffect(()=>{return()=>texture.dispose();},[texture]);
  useFrame(()=>{const f=sceneFocus(world,2);if(screen.current){screen.current.rotation.y=.15-f*.3;screen.current.position.z=f*.35;screen.current.scale.setScalar(1+f*.05);}if(side.current){side.current.position.x=2.25+Math.sin(f*Math.PI)*.5;side.current.rotation.y=-.25-f*.15;}});
  return <group><group ref={screen} position={[-.25,.35,0]}><Panel texture={texture} width={4.7} height={2.94}/></group><mesh position={[0,-1.5,-.1]}><boxGeometry args={[.2,.9,.25]}/><meshStandardMaterial color={metal} metalness={.8}/></mesh><group ref={side} position={[2.25,-.15,1]}><Label title="Responsive UI" caption="HTML / CSS / JAVASCRIPT" lines={['Design → interactive demo','Team contribution']} width={2.05} height={1.6} light={false}/></group><Platform width={6.4}/></group>;
}
function Gallery({world}: {world: RefObject<WorldState>}) {
  const ring=useRef<Group>(null);
  const textures=useLoader(TextureLoader,[shot1,shot4,shot2,shot3,shot5]);
  useEffect(()=>{textures.forEach(texture=>{texture.colorSpace=SRGBColorSpace;texture.needsUpdate=true;});},[textures]);
  useFrame(()=>{if(ring.current)ring.current.rotation.y=-sceneFocus(world,3)*Math.PI*2;});
  return <group><group ref={ring}>{textures.map((texture,i)=>{const angle=i*Math.PI*2/5;return <group key={i} position={[Math.sin(angle)*3.7,.25,Math.cos(angle)*3.7]} rotation={[0,angle,0]}><Panel texture={texture} width={3.2} height={1.85}/><mesh position={[0,-1.25,0]}><boxGeometry args={[.04,.65,.04]}/><meshStandardMaterial color={metal}/></mesh></group>;})}</group><group position={[-1.55,-1.0,2.2]} rotation-y={.25}><Label title="Mobile UI" caption="REACT NATIVE" lines={['Messaging','Membership']} width={.9} height={1.6}/></group><Platform width={8.5} depth={8.5}/></group>;
}
function Journey({world}: {world: RefObject<WorldState>}) {
  const marker=useRef<Group>(null), cards=useRef<(Group|null)[]>([]);
  useFrame(()=>{const f=sceneFocus(world,4);if(marker.current)marker.current.position.y=-1.8+f*3.7;cards.current.forEach((card,i)=>{if(card)card.rotation.y=(i%2===0?-.16:.16)+Math.sin(f*Math.PI)*.12;});});
  return <group><mesh position={[-2.1,0,0]}><boxGeometry args={[.055,5.1,.055]}/><meshBasicMaterial color="#628f73"/></mesh>{[['LIRUNEX','2026 / PRESENT','WordPress & CRM Development'],['M Focus Technology','2025 / 2026','Frontend Developer'],['Freelance','2024 / PRESENT','Web Development & Design'],['AZ Lab','2023 / INTERNSHIP','Web Design Intern']].map((job,i)=><group key={job[0]} ref={el=>{cards.current[i]=el;}} position={[0,1.9-i*1.25,(i%2)*.22]}><Label title={job[0]} caption={job[1]} lines={[job[2]]} width={3.65} height={1.04} light={i===0}/><mesh position={[-1.98,0,0]}><boxGeometry args={[.22,.035,.04]}/><meshStandardMaterial color={metal}/></mesh></group>)}<group ref={marker} position={[-2.1,-1.8,.1]}><mesh rotation-z={Math.PI/4}><boxGeometry args={[.15,.15,.15]}/><meshBasicMaterial color="#c4f4cb"/></mesh></group><Platform width={5.3}/></group>;
}
function Person({world}: {world: RefObject<WorldState>}) {
  const arms=useRef<(Group|null)[]>([]);
  const loadedPhoto=useLoader(TextureLoader,portrait);
  const photo=useMemo(()=>{const copy=loadedPhoto.clone();copy.colorSpace=SRGBColorSpace;return copy;},[loadedPhoto]);
  useEffect(()=>{return()=>photo.dispose();},[photo]);
  useFrame(()=>{const f=sceneFocus(world,5);arms.current.forEach((arm,i)=>{if(arm){arm.rotation.y=(i-1)*(.4+f*.25);arm.position.x=(i-1)*(1.9+f*.3);arm.position.z=-.55-Math.abs(i-1)*f*.3;}});});
  return <group><group position={[0,.75,.4]}><Panel texture={photo} width={1.65} height={2.08}/></group>{[['Frontend','REACT / VUE / TYPESCRIPT'],['Backend & data','POSTGRESQL / REST APIS'],['Tools','GIT / VITE / WORDPRESS']].map((item,i)=><group ref={el=>{arms.current[i]=el;}} key={item[0]} position={[(i-1)*1.9,-.6,-.55]}><Label title={item[0]} caption="THE TOOLKIT" lines={[item[1]]} width={1.8} height={1.4} light={false}/></group>)}<Platform width={6.8}/></group>;
}
function Connect({world}: {world: RefObject<WorldState>}) {
  const letter=useRef<Group>(null), flap=useRef<Group>(null);
  const shape=useMemo(()=>{const s=new Shape();s.moveTo(-1.95,0);s.lineTo(1.95,0);s.lineTo(0,-1.55);s.closePath();return s;},[]);
  useFrame(()=>{const f=sceneFocus(world,6);if(letter.current){letter.current.position.y=.2+f*.9;letter.current.rotation.z=-.04+f*.04;}if(flap.current)flap.current.rotation.x=-Math.PI*(.15+f*.8);});
  return <group rotation-y={-.12}><mesh><boxGeometry args={[4,2.5,.18]}/><meshStandardMaterial color="#7baf8d" metalness={.25} roughness={.4}/></mesh><group ref={letter} position={[0,.2,.12]}><Label title="Something useful." caption="LET’S BUILD" lines={['tzequan379@gmail.com','Kuala Lumpur / Malaysia']} width={3.6} height={2.15}/></group><mesh position={[0,-.6,.32]}><boxGeometry args={[4,1.3,.05]}/><meshStandardMaterial color="#386b4d" roughness={.42}/></mesh><group ref={flap} position={[0,1.25,.27]}><mesh><shapeGeometry args={[shape]}/><meshStandardMaterial color="#a8d4af" side={DoubleSide} metalness={.15} roughness={.5}/></mesh></group><Platform width={5.6}/></group>;
}

function Station({index, world, children}: {index: number; world: RefObject<WorldState>; children: React.ReactNode}) {
  const group=useRef<Group>(null);
  useFrame(()=>{if(group.current)group.current.visible=Math.abs(world.current.chapter-index)<1.3;});
  return <group ref={group} position-x={index*16} visible={index===0}>{children}</group>;
}

function World({world,pointer,invalidateRef,onReady,onFailure}: Props) {
  const {camera,gl,size,invalidate,setDpr}=useThree(), parallax=useRef<Group>(null);
  const aim=useMemo(()=>new Vector3(),[]), smoothPointer=useRef({x:0,y:0});
  const ready=useRef(onReady), fail=useRef(onFailure);
  useEffect(()=>{ready.current=onReady;fail.current=onFailure;},[onReady,onFailure]);
  useEffect(()=>{setDpr(size.width<=700||window.matchMedia('(pointer: coarse)').matches?1:Math.min(window.devicePixelRatio,1.5));},[size.width,setDpr]);
  useEffect(()=>{
    invalidateRef.current=invalidate;
    const lost=(event:Event)=>{event.preventDefault();fail.current();};
    const resume=()=>{if(!document.hidden)invalidate();};
    gl.domElement.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',resume);
    ready.current();invalidate();
    return()=>{invalidateRef.current=()=>{};gl.domElement.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',resume);};
  },[gl,invalidate,invalidateRef]);
  useFrame((_state,delta)=>{
    if(document.hidden)return;
    const mobile=size.width<=700,pose=sampleWorldPose(world.current,mobile);
    const px=mobile?0:pointer.current.x*.08,py=mobile?0:pointer.current.y*.055;
    smoothPointer.current.x=MathUtils.damp(smoothPointer.current.x,px,7,Math.min(delta,.05));smoothPointer.current.y=MathUtils.damp(smoothPointer.current.y,py,7,Math.min(delta,.05));
    camera.position.set(pose.camera[0]+smoothPointer.current.x,pose.camera[1]+smoothPointer.current.y,pose.camera[2]);aim.set(...pose.target);camera.lookAt(aim);
    if(parallax.current)parallax.current.rotation.y=0;
    if(Math.abs(px-smoothPointer.current.x)+Math.abs(py-smoothPointer.current.y)>.0001)invalidate();

  });
  return <><color attach="background" args={['#091416']}/><fog attach="fog" args={['#091416',22,43]}/><ambientLight intensity={1.4} color="#cce8d7"/><directionalLight position={[0,9,12]} intensity={3.6} color="#f3edd8"/><directionalLight position={[90,8,10]} intensity={3.5} color="#dcf7df"/>
    <group ref={parallax}>{[<Engine world={world}/>,<LeadSystem world={world}/>,<Portal world={world}/>,<Gallery world={world}/>,<Journey world={world}/>,<Person world={world}/>,<Connect world={world}/>].map((scene,index)=><Station key={index} index={index} world={world}>{scene}<pointLight position={[3,3,4]} intensity={22} distance={12} color="#97d8af"/></Station>)}</group>
    <gridHelper args={[160,160,'#274937','#132b20']} position={[48,-2.5,0]}/>{Array.from({length:6},(_,i)=><mesh key={i} position={[8+i*16,-2.43,-.5]}><boxGeometry args={[16,.018,.035]}/><meshBasicMaterial color="#4c7a59"/></mesh>)}
  </>;
}
export default function WorldScene(props: Props) {
  const [dpr]=useState(()=>window.matchMedia('(max-width:700px),(pointer:coarse)').matches?1:Math.min(window.devicePixelRatio,1.5));
  return <Canvas className="world-canvas" frameloop="demand" dpr={dpr} camera={{position:[-1.3,1.1,10.2],fov:40,near:.1,far:70}} gl={{antialias:dpr===1,alpha:false,powerPreference:'low-power',toneMapping:ACESFilmicToneMapping}}><World {...props}/></Canvas>;
}
