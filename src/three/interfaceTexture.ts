import { CanvasTexture, SRGBColorSpace } from 'three';
export function createInterfaceTexture(kind: 'interface' | 'workflow' | 'data') {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 640;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Unable to create the interface illustration');
  const light = kind === 'interface'; ctx.fillStyle = light ? '#d9eadc' : '#142c29'; ctx.fillRect(0, 0, 1024, 640);
  const rect = (x: number, y: number, w: number, h: number, color: string, radius = 7) => { ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill(); };
  const text = (value: string, x: number, y: number, size = 20, color = light ? '#1b4437' : '#b8e8cb') => { ctx.fillStyle = color; ctx.font = `500 ${size}px monospace`; ctx.fillText(value, x, y); };
  rect(24, 24, 976, 62, light ? '#183e32' : '#254d3e'); text('ZQ / INTERFACE ENGINE', 50, 64, 20, '#c4f2d6'); text('CONCEPT STUDY / 2026', 678, 64, 15, '#9bc9ae');
  if (kind === 'interface') {
    rect(24, 106, 170, 510, '#bed5c2');
    for (let i = 0; i < 6; i++) rect(44, 144 + i * 54, 124, 24, i === 0 ? '#315d49' : '#a0bca8', 4);
    text('From idea to interface.', 230, 156, 31); text('Design → build → connect', 230, 193, 16, '#5c7d65');
    for (let i = 0; i < 3; i++) { rect(230 + i * 252, 224, 233, 100, '#f4f8ed'); text(['INTERFACE', 'WORKFLOW', 'DATA'][i], 249 + i * 252, 254, 12); rect(249 + i * 252, 275, 104, 20, '#76aa88', 3); }
    rect(230, 348, 486, 267, '#f4f8ed'); text('CONNECTED SYSTEMS', 254, 385, 15);
    for (let i = 0; i < 8; i++) { const height = 35 + [10, 30, 20, 55, 45, 95, 80, 125][i]; rect(263 + i * 51, 575 - height, 29, height, i === 7 ? '#2f7454' : '#a2c6aa', 3); }
    rect(740, 348, 245, 267, '#c0d9c3'); text('BUILD NOTES', 759, 386, 15);
    for (let i = 0; i < 5; i++) rect(759, 417 + i * 34, 185 - (i % 2) * 40, 11, '#8fac94', 3);
  } else if (kind === 'workflow') {
    text('WORKFLOW LAYER', 53, 150, 32); text('Capture. Connect. Follow through.', 53, 194, 18);
    ['IMPORT', 'ASSIGN', 'FOLLOW UP'].forEach((label, i) => { const x = 54 + i * 326; rect(x, 288, 263, 166, '#244a3b'); text(`0${i + 1}`, x + 22, 325, 20); text(label, x + 22, 395, 25); if (i < 2) { ctx.strokeStyle = '#83cda1'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 263, 371); ctx.lineTo(x + 326, 371); ctx.stroke(); } });
    text('SIGNAL IN → USEFUL ACTION OUT', 54, 565, 18, '#719981');
  } else {
    text('THE FOUNDATION', 53, 152, 32); ctx.strokeStyle = '#3c6d52'; ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) { const x = 53 + i * 80; ctx.beginPath(); ctx.moveTo(x, 210); ctx.lineTo(x, 575); ctx.stroke(); }
    for (let i = 0; i < 5; i++) { const y = 235 + i * 80; ctx.beginPath(); ctx.moveTo(53, y); ctx.lineTo(970, y); ctx.stroke(); }
    for (let i = 0; i < 5; i++) rect(117 + i * 156, 270 + (i % 2) * 160, 89, 60, '#96c9a5');
    text('INTERFACES / DATA / REAL-WORLD WORKFLOWS', 53, 610, 15);
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 2; return texture;
}
