import type { SVGProps } from "react";

type IconName = "arrow" | "arrow-up" | "external" | "download" | "github" | "mail" | "menu" | "close" | "phone" | "check";
type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  "arrow-up": <><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></>,
  external: <><path d="M13 5h6v6" /><path d="M19 5 10 14" /><path d="M19 13v6H5V5h6" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 17v4h14v-4" /></>,
  github: <><path d="M9 19c-4.3 1.2-4.3-2-6-2.5" /><path d="M15 22v-3.4c0-1 .1-1.4-.6-1.9 3.5-.4 7-1.7 7-7.7a6 6 0 0 0-1.6-4.1 5.6 5.6 0 0 0-.1-4s-1.3-.4-4.3 1.6a15 15 0 0 0-7.8 0C4.6.5 3.3.9 3.3.9a5.6 5.6 0 0 0-.1 4A6 6 0 0 0 1.6 9c0 6 3.5 7.3 7 7.7-.5.4-.7 1-.7 1.9V22" transform="translate(1.2 1.4) scale(.89)" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M5 5 19 19M19 5 5 19" /></>,
  phone: <path d="M22 16.2v3.1a2.2 2.2 0 0 1-2.4 2.2A19.2 19.2 0 0 1 2.5 4.4 2.2 2.2 0 0 1 4.7 2h3.1A2.2 2.2 0 0 1 10 3.9c.1.9.4 1.8.7 2.7a2.2 2.2 0 0 1-.5 2.4L9 10.2a15.5 15.5 0 0 0 4.8 4.8l1.2-1.2a2.2 2.2 0 0 1 2.4-.5c.9.3 1.8.6 2.7.7A2.2 2.2 0 0 1 22 16.2Z" />,
  check: <><path d="M20 6 9 17l-5-5" /></>,
};

export function Icon({ name, size = 18, ...props }: Props) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
