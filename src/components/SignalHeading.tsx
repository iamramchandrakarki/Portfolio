"use client";

import { useEffect, useRef } from "react";
import { SIGNAL_DURATION, SIGNAL_EDGES, signalBandFrames, signalChannelFrames } from "@/lib/signal";

export function SignalHeading({ children, className = "" }: { children: string; className?: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const root = heading.current;
    if (!root) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    const cancel = () => {
      animations.forEach(animation => animation.cancel());
      animations = [];
      root.removeAttribute("data-signal-active");
    };
    const play = () => {
      cancel();
      const rect = root.getBoundingClientRect();
      if (motion.matches || document.hidden || rect.top < 0 || rect.bottom > innerHeight || document.documentElement.classList.contains("is-route-wiping")) return;
      root.setAttribute("data-signal-active", "");
      const animate = (element: Element, frames: Keyframe[]) => {
        animations.push(element.animate(frames, { duration: SIGNAL_DURATION, fill: "both" }));
      };
      root.querySelectorAll(".title-band").forEach((band, index) => {
        animate(band, signalBandFrames(index));
        Array.from(band.children).forEach((channel, color) => animate(channel, signalChannelFrames(index, color)));
      });
      animate(root.querySelector(".title-readable")!, [
        { offset: 0, opacity: 0 }, { offset: .69, opacity: 0 },
        { offset: .88, opacity: 1 }, { offset: 1, opacity: 1 },
      ]);
      void Promise.all(animations.map(animation => animation.finished)).then(cancel, () => {});
    };
    document.addEventListener("portfolio-signal", play);
    document.addEventListener("visibilitychange", cancel);
    document.addEventListener("scroll", cancel, true);
    document.addEventListener("pointerdown", cancel, true);
    document.addEventListener("keydown", cancel, true);
    window.addEventListener("resize", cancel);
    motion.addEventListener("change", cancel);
    return () => {
      cancel();
      document.removeEventListener("portfolio-signal", play);
      document.removeEventListener("visibilitychange", cancel);
      document.removeEventListener("scroll", cancel, true);
      document.removeEventListener("pointerdown", cancel, true);
      document.removeEventListener("keydown", cancel, true);
      window.removeEventListener("resize", cancel);
      motion.removeEventListener("change", cancel);
    };
  }, []);
  return <h1 ref={heading} className={`display-heading ${className}`}>
    <span className="title-readable">{children}</span>
    <span className="title-transmission" aria-hidden="true">
      {SIGNAL_EDGES.slice(0, -1).map((edge, index) => <span key={edge} className="title-band" style={{ clipPath: `inset(${edge * 100}% -24px ${(1 - SIGNAL_EDGES[index + 1]) * 100}% -24px)` }}>
        {["#eb0000", "#00ee00", "#0000ef"].map(color => <span key={color} className="title-channel" style={{ color }}>{children}</span>)}
      </span>)}
    </span>
  </h1>;
}
