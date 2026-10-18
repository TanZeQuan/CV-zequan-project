"""Render a seamless procedural water texture clipped to the footer wordmark."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W,H,N=1280,210,72
out=Path('public/assets')
font_path='C:/Windows/Fonts/arialbd.ttf'
font_size=180
while ImageFont.truetype(font_path,font_size).getlength('TAN ZE QUAN')>W-30:
    font_size-=1
font=ImageFont.truetype(font_path,font_size*2)
mask=Image.new('L',(W*2,H*2))
d=ImageDraw.Draw(mask)
b=d.textbbox((0,0),'TAN ZE QUAN',font=font)
d.text(((W*2-(b[2]-b[0]))/2-b[0],(H*2-(b[3]-b[1]))/2-b[1]),'TAN ZE QUAN',font=font,fill=255)
mask=mask.resize((W,H),Image.Resampling.LANCZOS)
alpha=np.asarray(mask,dtype=np.float32)[...,None]/255
x,y=np.meshgrid(np.linspace(0,1,W,dtype=np.float32),np.linspace(0,1,H,dtype=np.float32))
# Shallow-water ripples with moving, intersecting caustic ridges. Integer time
# frequencies make the last-to-first transition continuous.
frames=[]
for i in range(N):
    t=2*np.pi*i/N
    u=x*15 + .75*np.sin(y*9+t)+.3*np.sin(x*18-y*4-t)
    v=y*12 + 1.8*np.sin(x*9-t)+.65*np.sin(x*22+t*2)
    field=np.sin(v-t*2+.9*np.sin(u*.8+t)) + .55*np.sin(v*1.8+u*.55+t*3) + .28*np.sin(u*2.1-v*.7-t*2)
    ridge=np.exp(-((field-.4)/.19)**2)
    detail=np.exp(-((np.sin(u*1.4+v*.8+t)+.6*np.sin(v*2.3-t*2))/.17)**2)
    surface=.5+.5*np.sin(v*.72-t+np.sin(u*.5+t)*.7)
    # White crests and silver reflections, with a restrained indigo base.
    light=np.clip(.36+.25*surface+.30*ridge+.17*detail,0,1)[...,None]
    dark=np.array([107,117,178],dtype=np.float32)
    white=np.array([255,255,255],dtype=np.float32)
    water=dark+(white-dark)*light
    foam=np.clip(ridge*.72+detail*.28,0,1)[...,None]
    water=water*(1-foam*.5)+white*foam*.5
    rgb=np.uint8(np.clip(water*alpha+17*(1-alpha),0,255))
    frame=Image.fromarray(rgb)
    if i==0:
        frame.save(out/'footer-water-static.webp',quality=94)
        frame.save('qa/recruiter-water-frame.png')
    frames.append(frame.quantize(colors=96,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE))
frames[0].save(out/'footer-water.gif',save_all=True,append_images=frames[1:],duration=50,loop=0,optimize=True,disposal=1)
with Image.open(out/'footer-water.gif') as gif:
    assert gif.n_frames==N and gif.info['loop']==0
    print(f'GIF: {gif.size}, {gif.n_frames} frames, {gif.info["duration"]}ms/frame; {(out/"footer-water.gif").stat().st_size:,} bytes')
