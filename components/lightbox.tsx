"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/gallery-data";

export function Lightbox({ images, index, onClose, onMove }: { images: GalleryImage[]; index: number; onClose: () => void; onMove: (step: number) => void }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      // RTL: the left arrow moves forward
      if (event.key === "ArrowLeft") onMove(1);
      if (event.key === "ArrowRight") onMove(-1);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);

  const image = images[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.alt} onClick={onClose}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="סגירה"><X size={26} strokeWidth={1.25} /></button>
      <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
        <img key={image.src} src={image.src} alt={image.alt} />
        <figcaption>{image.alt}<span dir="ltr">{index + 1} / {images.length}</span></figcaption>
      </figure>
      {images.length > 1 && (
        <>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={(event) => { event.stopPropagation(); onMove(-1); }} aria-label="התמונה הקודמת"><ChevronRight size={30} strokeWidth={1.25} /></button>
          <button type="button" className="lightbox-nav lightbox-next" onClick={(event) => { event.stopPropagation(); onMove(1); }} aria-label="התמונה הבאה"><ChevronLeft size={30} strokeWidth={1.25} /></button>
        </>
      )}
    </div>
  );
}
