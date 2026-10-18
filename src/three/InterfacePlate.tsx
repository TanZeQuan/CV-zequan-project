import { useEffect, useMemo } from 'react';
import { createInterfaceTexture } from './interfaceTexture';
export function InterfacePlate({kind}: {kind: 'interface' | 'workflow' | 'data'}) {
  const texture=useMemo(()=>createInterfaceTexture(kind),[kind]);
  useEffect(()=>{return()=>texture.dispose();},[texture]);
  return <group><mesh><boxGeometry args={[4.75,3.03,.12]}/><meshStandardMaterial color={kind==='interface'?'#668b77':'#193c32'} roughness={.28} metalness={.62}/></mesh><mesh position-z={.066}><planeGeometry args={[4.56,2.85]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>{[-1,1].flatMap(x=>[-1,1].map(y=><mesh key={`${x}-${y}`} position={[x*2.28,y*1.425,.072]} rotation-x={Math.PI/2}><cylinderGeometry args={[.025,.025,.012,8]}/><meshStandardMaterial color="#d6e2c9" metalness={.8} roughness={.25}/></mesh>))}</group>;
}
