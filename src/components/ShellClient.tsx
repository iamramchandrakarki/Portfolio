"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/usePageTransition";
import { activePage, NAV_ITEMS, SCENES, sceneLuminance } from "@/lib/stage";
import { SIGNAL_DURATION } from "@/lib/signal";

const DOT_SHADES = Array.from({ length: 32 }, (_, i) => `rgba(220,224,227,${0.006 + i / 31 * 0.18})`);

function DitherBackground({ scene }: { scene: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let previous = 0;
    let width = 0;
    let height = 0;
    let nextTear = elapsed.current + 10;
    let tearStart = -1;
    let tearRow = 0;
    let tearDirection = 1;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cell = 7;
      // Sample the soft field sparsely; the square grid only needs interpolation.
      const spacing = 28;
      const columns = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const field = new Float32Array(columns * rows);
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          field[row * columns + column] = sceneLuminance(column * spacing / width, row * spacing / height, elapsed.current, scene);
        }
      }
      const age = elapsed.current - tearStart;
      const tearing = !media.matches && !document.hidden && tearStart >= 0 && age < SIGNAL_DURATION / 1000;
      const beat = Math.floor(age / .2);
      const shift = (Math.round(Math.sin(tearRow * 79 + beat * 13) * 16) * cell) * tearDirection;
      document.documentElement.toggleAttribute("data-ambient-glitch", tearing);
      for (let y = 0; y < height; y += cell) {
        const row = Math.floor(y / spacing);
        const v = y / spacing - row;
        const band = tearing && age < .76 && Math.abs(y - tearRow * height) < height * .055;
        for (let x = 0; x < width; x += cell) {
          const column = Math.floor(x / spacing);
          const u = x / spacing - column;
          const index = row * columns + column;
          const lum = Math.floor(((field[index] * (1 - u) + field[index + 1] * u) * (1 - v) + (field[index + columns] * (1 - u) + field[index + columns + 1] * u) * v) * 6) / 6;
          if (!lum) continue;
          if (band && (column + row + Math.floor(age * 30)) % 11 === 0) continue;
          const position = x + (band ? shift : 0);
          ctx.fillStyle = DOT_SHADES[Math.round(lum * (DOT_SHADES.length - 1))];
          ctx.fillRect(position, y, 4, 4);
        }
      }
    };
    const tick = (now: number) => {
      if (now - last > 70) {
        if (previous) elapsed.current += (now - previous) / 1000;
        previous = now;
        last = now;
        if (elapsed.current >= nextTear) {
          tearStart = elapsed.current;
          tearRow = .15 + Math.random() * .7;
          tearDirection = Math.random() < .5 ? -1 : 1;
          nextTear = elapsed.current + SIGNAL_DURATION / 1000 + 10 + Math.random() * 6;
          document.dispatchEvent(new Event("portfolio-signal"));
        }
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      tearStart = -1;
      nextTear = elapsed.current + 10;
      document.documentElement.dataset.backgroundPaused = String(media.matches || document.hidden);
      draw();
      if (!media.matches && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    resize();
    sync();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      delete document.documentElement.dataset.backgroundPaused;
      document.documentElement.removeAttribute("data-ambient-glitch");
    };
  }, [scene]);
  return <canvas ref={canvasRef} className="dither-background" aria-hidden="true" />;
}

function SignalEntrance() {
  return <div className="signal-entrance" aria-hidden="true">
    <div className="signal-core" />
    {Array.from({ length: 18 }, (_, i) => <span key={i} className="signal-slice" style={{ "--i": i, "--x": `${((i * 17) % 110) - 8}%`, "--offset": `${((i * 13) % 48) - 24}px`, "--w": `${10 + (i % 5) * 11}%` } as CSSProperties} />)}
  </div>;
}

export function ShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navigate = usePageTransition();
  const page = activePage(pathname);
  const [preview, setPreview] = useState<number | null>(null);
  const [scene, setScene] = useState(0);
  const cancelDrag = useRef(false);
  const selected = preview ?? page;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.ctrlKey || event.metaKey || event.altKey || target.matches("input, textarea, select, [contenteditable=true]")) return;
      if (event.key === "[") setScene(value => (value - 1 + SCENES.length) % SCENES.length);
      if (event.key === "]") setScene(value => (value + 1) % SCENES.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const choose = (value: number) => {
    setPreview(null);
    if (!cancelDrag.current && value !== page) navigate(NAV_ITEMS[value].href);
  };

  return <>
    <DitherBackground scene={scene} />
    <div className="grain" aria-hidden="true" />
    <div className="route-scan" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <span key={i} style={{ left: `${(i * 23) % 100}%`, top: `${(i * 17) % 90}%`, width: `${8 + (i % 5) * 4}%` }} />)}</div>
    <div className="site-shell">
      <div className="route-signal"><SignalEntrance />
        <main id="main-content" tabIndex={-1} className="site-main"><div className="signal-content">{children}</div></main>
      </div>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Ramchandra Karki</span></footer>
    </div>
    <nav className="bottom-nav" aria-label="Primary navigation">
      <div className="nav-inner" style={{ "--active": selected } as CSSProperties}>
        <div className="nav-marker" aria-hidden="true" />
        <input className="nav-tuner" type="range" min="0" max="3" step="1" value={selected} aria-label="Tune page" aria-valuetext={NAV_ITEMS[selected].label} onChange={event => setPreview(Number(event.target.value))} onPointerDown={() => { cancelDrag.current = false; }} onPointerUp={event => choose(Number(event.currentTarget.value))} onPointerCancel={() => setPreview(null)} onKeyDown={event => {
          if (event.key === "Escape") { cancelDrag.current = true; setPreview(null); event.currentTarget.blur(); }
        }} onKeyUp={event => {
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) { cancelDrag.current = false; choose(Number(event.currentTarget.value)); }
        }} onBlur={() => setPreview(null)} />
        {NAV_ITEMS.map((item, i) => <Link key={item.href} href={item.href} aria-current={page === i ? "page" : undefined} onClick={() => setPreview(null)}>{item.label}</Link>)}
      </div>
      <span className="sr-only">Drag the blue indicator to select a page. You can also use the page links or the slider’s arrow keys. Escape cancels.</span>
    </nav>
  </>;
}
