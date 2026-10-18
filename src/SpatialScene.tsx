import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CanvasTexture, Group, MathUtils, SRGBColorSpace } from 'three';
import type { MutableRefObject } from 'react';

export interface SceneControls {
  progressRef: MutableRefObject<{ value: number }>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  renderRef: MutableRefObject<() => void>;
}

// Draw locally so the portable file preview never depends on remote textures.
function interfaceTexture(kind: number) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 640;
  const ctx = canvas.getContext('2d')!;
  const rect = (x:number,y:number,w:number,h:number,color:string,r=12) => {
    ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();
  };
  const text = (value:string,x:number,y:number,size:number,color='#172033') => {
    ctx.fillStyle=color;ctx.font=`${size>=24?600:400} ${size}px Segoe UI, sans-serif`;ctx.fillText(value,x,y);
  };
  rect(0,0,1024,640,'#ffffff',0);
  rect(0,0,1024,60,'#f4f7fc',0);
  ['#b7c6db','#d2dbe9','#d2dbe9'].forEach((color,i)=>rect(23+i*22,23,10,10,color,5));
  text(['WORKSPACE / OVERVIEW','INTERFACE / COMPONENTS','DATA / CONNECTIONS'][kind],115,37,16,'#52637c');
  if(kind===0){
    rect(0,60,172,580,'#f4f7fc',0);rect(24,94,120,32,'#2860ed');text('WORKSPACE',34,116,13,'#fff');
    ['Overview','Leads','Tasks','Reports','Settings'].forEach((s,i)=>text(s,32,176+i*53,17,i===0?'#2860ed':'#52637c'));
    text('A clearer view.',210,119,34);text('Connected interfaces. Considered workflows.',210,151,17,'#52637c');
    for(let i=0;i<3;i++){rect(210+i*258,181,236,109,'#f2f6fd');text(['LEADS','ACTIVITY','WORKFLOWS'][i],230+i*258,210,13,'#52637c');rect(230+i*258,234,78,10,'#2860ed',4);rect(230+i*258,255,145,5,'#d4dff0',3);}
    rect(210,315,492,285,'#f8faff');text('Activity overview',234,352,21);
    for(let i=0;i<8;i++)rect(240+i*53,550-[70,110,95,157,130,185,166,205][i],26,[70,110,95,157,130,185,166,205][i],i===7?'#2860ed':'#b9cff9',5);
    rect(723,315,277,285,'#f2f6fd');text('Team activity',746,352,21);
    for(let i=0;i<4;i++){rect(747,381+i*49,24,24,i%2?'#b9cff9':'#2860ed',12);rect(786,386+i*49,171,6,'#b8c9e3',3);rect(786,400+i*49,109,4,'#d7e1ef',2);}
  }else if(kind===1){
    text('Designed for people.',55,125,38);text('A system of reusable, responsive interfaces.',55,162,20,'#52637c');
    rect(55,205,432,355,'#f4f7fc');text('Client portal',87,253,25);rect(87,282,367,52,'#fff');rect(105,305,160,7,'#c3d1e5',3);rect(87,350,367,52,'#fff');rect(105,373,200,7,'#c3d1e5',3);rect(87,436,367,54,'#2860ed');text('Continue',225,471,19,'#fff');
    text('COMPONENT LIBRARY',540,228,15,'#52637c');['#2860ed','#76a0fa','#c5d6f8','#172033'].forEach((c,i)=>rect(540+i*100,255,76,65,c));
    rect(540,358,399,70,'#f4f7fc');rect(562,381,24,24,'#2860ed',12);text('Connected & consistent',604,400,21);rect(540,455,184,58,'#2860ed');text('Primary',593,492,20,'#fff');rect(745,455,194,58,'#edf3ff');text('Secondary',789,492,20,'#2860ed');
  }else{
    text('Built to connect.',55,125,38);text('From the interface to the workflow.',55,162,20,'#52637c');
    ctx.strokeStyle='#bbd1fb';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(255,325);ctx.lineTo(770,325);ctx.moveTo(512,325);ctx.lineTo(512,484);ctx.stroke();
    ['INTERFACE','API','DATABASE'].forEach((s,i)=>{rect(65+i*330,255,235,141,i===1?'#2860ed':'#f0f5ff');text(s,97+i*330,310,20,i===1?'#fff':'#2860ed');rect(97+i*330,340,142,7,i===1?'#a9c4ff':'#cad9ef',3);});
    rect(370,457,284,87,'#edf3ff');text('WORKFLOW',441,510,23,'#2860ed');
  }
  const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;return texture;
}

function InterfaceLayer({kind, panelRef}:{kind:number;panelRef:MutableRefObject<Group|null>}) {
  const texture=useMemo(()=>interfaceTexture(kind),[kind]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <group ref={panelRef}>
    <mesh><boxGeometry args={[5.18,3.26,.09]}/><meshStandardMaterial color="#c9d8ef" metalness={.32} roughness={.36}/></mesh>
    <mesh position={[0,0,.048]}><planeGeometry args={[5.12,3.2]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
  </group>;
}

function Architecture({progressRef,pointerRef,renderRef}:SceneControls) {
  const world=useRef<Group>(null),a=useRef<Group>(null),b=useRef<Group>(null),c=useRef<Group>(null);
  const {camera,invalidate}=useThree();
  const settled=useRef(0);
  useEffect(()=>{renderRef.current=invalidate;invalidate();return()=>{renderRef.current=()=>{};};},[invalidate,renderRef]);
  useFrame((_,delta)=>{
    if(!world.current)return;
    const k=1-Math.exp(-Math.min(delta,.05)*7);
    settled.current=MathUtils.lerp(settled.current,progressRef.current.value,k);
    const p=settled.current;
    const rx=-.15+p*.31-pointerRef.current.y*.08, ry=-.36+p*.64+pointerRef.current.x*.12;
    world.current.rotation.x=MathUtils.lerp(world.current.rotation.x,rx,k);
    world.current.rotation.y=MathUtils.lerp(world.current.rotation.y,ry,k);
    world.current.rotation.z=MathUtils.lerp(world.current.rotation.z,-.055+p*.1,k);
    world.current.scale.setScalar(.96+p*.06);
    [a,b,c].forEach((ref,i)=>{if(ref.current){ref.current.position.set((i-1)*(.32+p*.72),(1-i)*(.22+p*.44),-i*(.35+p*.64));}});
    camera.position.set(.15+p*.55,.1+p*.22,8.7-p*.7);camera.lookAt(0,0,-.3);
    const moving=Math.abs(p-progressRef.current.value)+Math.abs(world.current.rotation.x-rx)+Math.abs(world.current.rotation.y-ry);
    if(moving>.0001)invalidate();
  });
  return <><ambientLight intensity={1.8}/><directionalLight position={[3,6,5]} intensity={3}/><directionalLight position={[-5,-2,3]} color="#83aaff" intensity={2}/><group ref={world}><InterfaceLayer kind={0} panelRef={a}/><InterfaceLayer kind={1} panelRef={b}/><InterfaceLayer kind={2} panelRef={c}/></group></>;
}

export default function SpatialScene({progressRef,pointerRef,renderRef}:SceneControls) {
  return <Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[0,0,8.7],fov:39}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} onPointerMove={event=>{
    const box=event.currentTarget.getBoundingClientRect();
    pointerRef.current={x:(event.clientX-box.left)/box.width*2-1,y:(event.clientY-box.top)/box.height*2-1};renderRef.current();
  }} onPointerLeave={()=>{pointerRef.current={x:0,y:0};renderRef.current();}}><Architecture progressRef={progressRef} pointerRef={pointerRef} renderRef={renderRef}/></Canvas>;
}
