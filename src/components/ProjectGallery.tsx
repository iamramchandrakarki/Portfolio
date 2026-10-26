"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { ProjectEntry } from "@/data/portfolio";

export function ProjectGallery({ images, compact = false, imageIndex }: { images: ProjectEntry["images"]; compact?: boolean; imageIndex?: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const captionId = useId();
  const [selected, setSelected] = useState(imageIndex ?? 0);
  const move = (direction: number) => setSelected(current => (current + direction + images.length) % images.length);
  return <>
    <div className={compact ? "project-gallery" : "case-gallery"} aria-label="Project screenshots">
      {images.map((image, i) => imageIndex !== undefined && i !== imageIndex ? null : <figure key={image.src}>
        <button className="image-button" aria-label={`Expand ${image.alt}`} onClick={() => { setSelected(i); dialog.current?.showModal(); }}>
          <Image src={image.src} alt={image.alt} width={1280} height={720} quality={90} sizes={compact ? "(max-width: 700px) 88vw, 66vw" : "(max-width: 700px) 100vw, 1200px"} priority={i === 0} />
          <span className="expand-icon" aria-hidden="true">+</span>
        </button>
        {!compact ? <figcaption>{image.caption}</figcaption> : null}
      </figure>)}
    </div>
    <dialog className="image-dialog" ref={dialog} aria-label="Project image viewer" aria-describedby={captionId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => {
      if (images.length > 1 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    }}>
      <button type="button" className="dialog-close" aria-label="Close image" onClick={() => dialog.current?.close()}><span aria-hidden="true">×</span></button>
      {images.length > 1 ? <>
        <button type="button" className="dialog-nav dialog-previous" aria-label="Previous image" onClick={() => move(-1)}><span aria-hidden="true">←</span></button>
        <button type="button" className="dialog-nav dialog-next" aria-label="Next image" onClick={() => move(1)}><span aria-hidden="true">→</span></button>
      </> : null}
      <figure className="image-dialog-content">
        <div className="image-dialog-stage" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
          <Image key={images[selected].src} src={images[selected].src} alt={images[selected].alt} width={1280} height={720} unoptimized draggable={false} />
        </div>
        <figcaption id={captionId} aria-live="polite" aria-atomic="true">{images[selected].caption}</figcaption>
      </figure>
    </dialog>
  </>;
}
