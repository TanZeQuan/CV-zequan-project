import { CanvasTexture, SRGBColorSpace } from 'three';
export function makePanelTexture(title: string, caption: string, lines: readonly string[] = [], light = true, ratio = 1.6) {
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = Math.max(210, Math.round(768 / ratio));
  const height = canvas.height, compact = height < 360;
  const c = canvas.getContext('2d'); if (!c) throw Error('2D canvas unavailable');
  const ink = light ? '#173d31' : '#c2edd2', muted = light ? '#577964' : '#7baa91';
  c.fillStyle = light ? '#d7e8d9' : '#142c29'; c.fillRect(0, 0, 768, height);
  c.fillStyle = light ? '#bdd4c1' : '#28493c'; c.fillRect(0, 0, 768, compact ? 51 : 67);
  c.font = '18px monospace'; c.fillStyle = ink; c.fillText(caption, 28, compact ? 34 : 42);
  c.fillStyle = ink; c.font = '500 42px sans-serif'; c.fillText(title, 30, compact ? 101 : 134);
  lines.forEach((line, i) => { c.fillStyle = muted; c.font = '22px sans-serif'; c.fillText(line, 32, (compact ? 143 : 196) + i * (compact ? 30 : 42)); });
  c.strokeStyle = light ? '#95baa1' : '#3c7055'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(30, height - 65); c.lineTo(734, height - 65); c.stroke();
  c.fillStyle = muted; c.font = '15px monospace'; c.fillText('TAN ZE QUAN / PORTFOLIO 2026', 30, height - 25);
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; return texture;
}
export function makePortalTexture() {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 640;
  const c = canvas.getContext('2d'); if (!c) throw Error('2D canvas unavailable');
  c.fillStyle = '#dfeadf'; c.fillRect(0, 0, 1024, 640);
  c.fillStyle = '#173c32'; c.fillRect(0, 0, 1024, 65); c.fillRect(0, 65, 190, 575);
  c.fillStyle = '#bae2c9'; c.font = '20px monospace'; c.fillText('CLIENT PORTAL', 26, 42);
  c.font = '15px monospace'; c.fillText('CONCEPTUAL UI / NOT A PRODUCT SCREENSHOT', 575, 40);
  c.font = '20px sans-serif'; ['Overview','Account','Activity','Documents','Settings'].forEach((line,i) => c.fillText(line, 27, 130 + i * 64));
  c.fillStyle = '#224a37'; c.font = '36px sans-serif'; c.fillText('A clearer client experience.', 230, 131);
  c.font = '18px sans-serif'; c.fillStyle = '#62816a'; c.fillText('Responsive pages. Connected interactions.', 231, 169);
  for(let i=0;i<3;i++){c.fillStyle = '#f7faee'; c.fillRect(230+i*250,215,225,118); c.fillStyle = '#88ad91'; c.fillRect(250+i*250,240,132,10); c.fillRect(250+i*250,271,85,22);}
  c.fillStyle = '#f7faee'; c.fillRect(230,365,730,220);
  for(let i=0;i<4;i++){c.fillStyle='#b6cfba';c.fillRect(252,392+i*44,130,12);c.fillStyle='#dce8d9';c.fillRect(426,392+i*44,365,12);}
  const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;return texture;
}
