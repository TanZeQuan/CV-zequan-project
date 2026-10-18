import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CanvasTexture, Group, MathUtils, PMREMGenerator, SRGBColorSpace } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface PrismControls {
  progressRef:MutableRefObject<{value:number}>;
  pointerRef:MutableRefObject<{x:number;y:number}>;
  renderRef:MutableRefObject<()=>void>;
  active:boolean;
}
function Chrome({progressRef,pointerRef,renderRef,active}:PrismControls){
  const groupRef=useRef<Group>(null);
  const {gl,scene,invalidate,camera}=useThree();
  const sceneRef=useRef(scene);
  const eased=useRef(0);
  useEffect(()=>{
    const pmrem=new PMREMGenerator(gl),room=new RoomEnvironment();
    const target=pmrem.fromScene(room,.04);
    const currentScene=sceneRef.current;
    const previous=currentScene.environment;
    currentScene.environment=target.texture;
    return()=>{currentScene.environment=previous;target.dispose();room.dispose();pmrem.dispose();};
  },[gl]);
  useEffect(()=>{renderRef.current=invalidate;return()=>{renderRef.current=()=>{};};},[invalidate,renderRef]);
  useEffect(()=>{if(active)invalidate();},[active,invalidate]);
  useFrame((_,delta)=>{
    if(!active||!groupRef.current)return;
    const k=1-Math.exp(-Math.min(delta,.05)*6);
    eased.current=MathUtils.lerp(eased.current,progressRef.current.value,k);
    const p=eased.current,group=groupRef.current;
    const x=.08+p*.24+pointerRef.current.y*.12,y=-.38+p*.8+pointerRef.current.x*.3;
    group.rotation.x=MathUtils.lerp(group.rotation.x,x,k);group.rotation.y=MathUtils.lerp(group.rotation.y,y,k);
    group.rotation.z=-.04+p*.08;group.scale.setScalar(1.15-p*.1);
    camera.position.set(p*.25,0,5-p*.5);camera.lookAt(0,0,0);
    const movement=Math.abs(p-progressRef.current.value)+Math.abs(group.rotation.x-x)+Math.abs(group.rotation.y-y);
    if(movement>.0001)invalidate();
  });
  return <><ambientLight intensity={1.5}/><directionalLight color="#8D96EE" intensity={4} position={[-3,4,3]}/><directionalLight color="#5967D9" intensity={3} position={[4,1,2]}/><pointLight color="#a8b0ff" intensity={8} position={[1,-2,2]}/><group ref={groupRef}><DeveloperLaptop/></group></>;
}

function DeveloperLaptop(){
  const screen=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=640;
    const ctx=canvas.getContext('2d')!;
    ctx.fillStyle='#111321';ctx.fillRect(0,0,1024,640);
    ctx.fillStyle='#22263c';ctx.fillRect(0,0,1024,64);ctx.fillRect(0,64,65,576);
    ctx.fillStyle='#8d96ee';ctx.font='26px Consolas, monospace';ctx.fillText('portfolio.tsx',98,41);
    const lines=[['#a1a1aa','01'],['#8d96ee','const developer = {'],['#f5f5f5','  name: "Tan Ze Quan",'],['#8d96ee','  role: "Full Stack",'],['#b7c5d9','  build: ["Web", "Mobile"],'],['#8d96ee','  connect: "UI + API + Data"'],['#f5f5f5','};'],['#a1a1aa',''],['#8d96ee','export default developer;']];
    ctx.font='29px Consolas, monospace';lines.forEach(([color,line],i)=>{ctx.fillStyle=color;ctx.fillText(line,92,115+i*48);});
    ctx.fillStyle='#5967d9';ctx.fillRect(0,605,1024,35);ctx.fillStyle='#ffffff';ctx.font='20px Consolas, monospace';ctx.fillText('TypeScript                      Ready',83,630);
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;return texture;
  },[]);
  useEffect(()=>()=>screen.dispose(),[screen]);
  return <group rotation={[-.12,0,0]}>
    <group position={[0,.17,-.35]} rotation={[-.12,0,0]}>
      <mesh><boxGeometry args={[2.55,1.67,.095]}/><meshStandardMaterial color="#343b55" metalness={.8} roughness={.27}/></mesh>
      <mesh position={[0,0,.051]}><planeGeometry args={[2.36,1.48]}/><meshBasicMaterial map={screen} toneMapped={false}/></mesh>
    </group>
    <mesh position={[0,-.67,.32]}><boxGeometry args={[2.65,.09,1.57]}/><meshStandardMaterial color="#444b62" metalness={.78} roughness={.3}/></mesh>
    {Array.from({length:4},(_,row)=>Array.from({length:11},(_,col)=><mesh key={`${row}-${col}`} position={[-1.07+col*.211,-.615,-.19+row*.19]}><boxGeometry args={[.164,.012,.132]}/><meshStandardMaterial color="#181c2b" emissive="#5967d9" emissiveIntensity={.12} roughness={.65}/></mesh>))}
    <mesh position={[0,-.615,.81]}><boxGeometry args={[.76,.008,.35]}/><meshStandardMaterial color="#66708d" metalness={.7} roughness={.3}/></mesh>
  </group>;
}
export default function PrismScene({progressRef,pointerRef,renderRef,active}:PrismControls){
  return <Canvas frameloop={active?'demand':'never'} dpr={[1,1.5]} camera={{position:[0,0,5],fov:43}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} onPointerMove={event=>{
    const rect=event.currentTarget.getBoundingClientRect();pointerRef.current={x:(event.clientX-rect.left)/rect.width*2-1,y:(event.clientY-rect.top)/rect.height*2-1};renderRef.current();
  }} onPointerLeave={()=>{pointerRef.current={x:0,y:0};renderRef.current();}}><Chrome progressRef={progressRef} pointerRef={pointerRef} renderRef={renderRef} active={active}/></Canvas>;
}
