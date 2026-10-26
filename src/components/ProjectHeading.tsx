"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SIGNAL_DURATION, SIGNAL_EDGES, signalBandFrames, signalChannelFrames } from "@/lib/signal";

export function ProjectHeading({ title, description, slug, index }: { title: string; description: string; slug: string; index: number }) {
  const root = useRef<HTMLAnchorElement>(null);
  const animations = useRef<Animation[]>([]);
  const cancel = () => {
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    root.current?.removeAttribute("data-project-signal");
  };
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", cancel);
    return () => { cancel(); motion.removeEventListener("change", cancel); };
  }, []);
  const play = () => {
    cancel();
    if (!root.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.current.setAttribute("data-project-signal", "");
    const animate = (element: Element, frames: Keyframe[]) => {
      animations.current.push(element.animate(frames, { duration: SIGNAL_DURATION, fill: "both" }));
    };
    root.current.querySelectorAll(".project-arrow .title-band").forEach((band, index) => {
      animate(band, signalBandFrames(index));
      Array.from(band.children).forEach((channel, color) => animate(channel, signalChannelFrames(index, color)));
    });
    animate(root.current.querySelector(".project-arrow .title-readable")!, [
      { offset: 0, opacity: 0 }, { offset: .69, opacity: 0 },
      { offset: .88, opacity: 1 }, { offset: 1, opacity: 1 },
    ]);
    void Promise.all(animations.current.map(animation => animation.finished)).then(cancel, () => {});
  };
  const icon = <svg viewBox="0 0 40 40" fill="currentColor"><path fillRule="evenodd" d="M20 0a20 20 0 1 0 0 40 20 20 0 0 0 0-40ZM11 18h13l-5-5 3-3 10 10-10 10-3-3 5-5H11Z" /></svg>;
  return <Link ref={root} className="work-project-heading" href={`/work/${slug}`} onPointerEnter={play} onPointerLeave={cancel} onFocus={play} onBlur={cancel} onClick={cancel}>
    <span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
    <div><h2>{title}<span className="project-arrow" aria-hidden="true">
      <span className="title-readable">{icon}</span>
      <span className="title-transmission">
        {SIGNAL_EDGES.slice(0, -1).map((edge, index) => <span key={edge} className="title-band" style={{ clipPath: `inset(${edge * 100}% -24px ${(1 - SIGNAL_EDGES[index + 1]) * 100}% -24px)` }}>
          {["#eb0000", "#00ee00", "#0000ef"].map(color => <span key={color} className="title-channel" style={{ color }}>{icon}</span>)}
        </span>)}
      </span>
    </span></h2><p>{description}</p></div>
  </Link>;
}
