export const NAV_ITEMS = [
  { label: "root", href: "/" },
  { label: "about", href: "/about" },
  { label: "work", href: "/work" },
  { label: "contact", href: "/contact" },
] as const;

export const SCENES = ["future city", "himalayan ridge", "signal field"] as const;

export function internalRoute(href: string, current: string) {
  const url = new URL(href, current);
  const from = new URL(current);
  if (url.origin !== from.origin || url.pathname === from.pathname) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function activePage(pathname: string) {
  return Math.max(0, NAV_ITEMS.findIndex(({ href }) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)));
}

export function pageWipeDirection(from: string, to: string) {
  return activePage(to) < activePage(from) ? "up" : "down";
}

function cloudNoise(x: number, y: number) {
  const column = Math.floor(x);
  const row = Math.floor(y);
  const smooth = (n: number) => n * n * (3 - 2 * n);
  const hash = (a: number, b: number) => {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const u = smooth(x - column);
  const v = smooth(y - row);
  const top = hash(column, row) * (1 - u) + hash(column + 1, row) * u;
  const bottom = hash(column, row + 1) * (1 - u) + hash(column + 1, row + 1) * u;
  return top * (1 - v) + bottom * v;
}

export function sceneLuminance(x: number, y: number, time: number, scene: number) {
  let value: number;
  if (scene === 0) {
    const drift = time * .09;
    const u = x * 5 + drift + Math.sin(y * 5 + drift) * .65;
    const v = y * 4 - drift * .6 + Math.cos(x * 4 - drift) * .55;
    const cloud = cloudNoise(u, v) * .65 + cloudNoise(u * 2.1 + 17, v * 2.1 - drift) * .25 + cloudNoise(u * 4.2, v * 4.2 + drift) * .1;
    value = Math.max(0, Math.min(1, (cloud - .26) / .57)) ** 1.6;
  } else if (scene === 1) {
    const ridge = 0.5 - Math.exp(-(((x - 0.57) * 6) ** 2)) * 0.33 - Math.exp(-(((x - 0.29) * 5) ** 2)) * 0.19 + Math.sin(x * 40) * 0.018;
    value = y > 0.71 ? 0.16 + Math.sin(y * 90 + time * 0.5 + x * 8) * 0.08 : y > ridge ? 0.28 + Math.sin(x * 16 + y * 12) * 0.12 : 0.035;
  } else {
    value = 0.22 + Math.sin(x * 11 + time * 0.25) * Math.cos(y * 8 - time * 0.18) * 0.19 + Math.sin(Math.hypot(x - 0.5, y - 0.5) * 22 - time * 0.3) * 0.07;
  }
  return Math.max(0, Math.min(1, value));
}
