import gsap from 'gsap';

export const chapters = [
  { id: 'top', label: 'Introduction', short: 'IDEA' },
  { id: 'work', label: 'Sales Leads CRM', short: 'SYSTEM' },
  { id: 'portal', label: 'Client Portal', short: 'INTERFACE' },
  { id: 'archive', label: 'Web & mobile work', short: 'EXPLORATIONS' },
  { id: 'experience', label: 'Experience', short: 'JOURNEY' },
  { id: 'about', label: 'About & toolkit', short: 'PERSON' },
  { id: 'contact', label: 'Contact', short: 'NEXT' },
] as const;
export interface WorldState { chapter: number; focus: number }
export const createWorldState = (): WorldState => ({ chapter: 0, focus: 0 });
const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const smooth = (t: number) => t * t * (3 - 2 * t);
export function resolveWorldProgress(position: number, anchors: readonly number[], end: number): WorldState {
  let index = 0;
  for (let i = 1; i < anchors.length; i++) if (position >= anchors[i]) index = i;
  const next = anchors[index + 1] ?? Math.max(end, anchors[index] + 1);
  const focus = clamp((position - anchors[index]) / Math.max(1, next - anchors[index]));
  const blend = index === anchors.length - 1 ? 0 : smooth(clamp((focus - .62) / .38));
  return { chapter: index + blend, focus };
}

const stations = [0, 16, 32, 48, 64, 80, 96];
const cameraOffsets = [-1.3, 1.2, -1.7, 1.7, -.5, 1.4, -.8];
const lookOffsets = [-1.6, -1.8, 1.65, -.8, -1.8, -1.7, -1.5];
const heights = [1.1, 1.9, .6, 1.2, .7, 1.4, .35];
export function sampleWorldPose(state: WorldState, mobile: boolean) {
  const phase = clamp(state.chapter, 0, 6), left = Math.floor(phase), right = Math.min(left + 1, 6), t = phase - left;
  const lerp = (a: number, b: number) => a + (b - a) * t;
  const bridge = Math.sin(t * Math.PI);
  const x = lerp(stations[left], stations[right]);
  const focus = clamp(state.focus);
  const journeyLeft = left === 4 ? -.8 + Math.min(focus / .62, 1) * 1.6 : 0;
  const journeyRight = right === 4 ? -.8 : 0;
  const journey = lerp(journeyLeft, journeyRight);
  return {
    camera: [x + (mobile ? 0 : lerp(cameraOffsets[left], cameraOffsets[right])), lerp(heights[left], heights[right]) + bridge * 1.5 + journey, (mobile ? 13.5 : 10.2) + bridge * 5 - Math.sin(focus * Math.PI) * .65] as const,
    target: [x + (mobile ? 0 : lerp(lookOffsets[left], lookOffsets[right])), journey, 0] as const,
    station: x, bridge, phase,
  };
}
export function createWorldTimeline(driver: { scroll: number }, options: gsap.TimelineVars = {}) {
  return gsap.timeline({ ...options, defaults: { ease: 'none' } }).to(driver, { scroll: 1, duration: 1 });
}
