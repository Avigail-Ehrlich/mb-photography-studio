"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Content filters (נטיב, רימון, NetFree) replace a blocked image with a 3x3 mosaic of flat colour blocks,
// with an icon in the centre. A real photo never has nearly every block perfectly flat.
// NetFree shows a 5x5 mosaic while an image is only "sent for review"; those are deliberately left
// in place (the photographer prefers to wait for approval), so only the 3x3 grid is checked.
export function isMosaic(img: HTMLImageElement) {
  try {
    const size = 120;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    const isFlat = (x0: number, y0: number, cell: number) => {
      // Sample the inside of the block, away from the edges where JPEG blends neighbours
      const margin = Math.round(cell / 4);
      const values: number[] = [];
      for (let y = y0 + margin; y < y0 + cell - margin; y++) {
        for (let x = x0 + margin; x < x0 + cell - margin; x++) {
          const i = (y * size + x) * 4;
          values.push(data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11);
        }
      }
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
      return Math.sqrt(variance) < 3;
    };
    return [3].some((grid) => {
      const cell = size / grid;
      let flatCells = 0;
      for (let row = 0; row < grid; row++) {
        for (let col = 0; col < grid; col++) {
          if (isFlat(col * cell, row * cell, cell)) flatCells++;
        }
      }
      // The icon covers the centre block (or the four centre blocks on an even grid)
      return flatCells >= grid * grid - (grid % 2 === 1 ? 1 : 4);
    });
  } catch {
    return false;
  }
}

// For CSS background images (hero, about), which have no <img> to inspect
export function isImageBlocked(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(true);
    img.onload = () => resolve(isMosaic(img));
    img.src = src;
  });
}

// An <img> that stays hidden until it has loaded and passed the filter check, then fades in.
// A blocked image is reported instead, so the viewer never sees the mosaic or the swap.
// Callers key it by src, so a replacement starts hidden again.
export function CheckedImage({ src, alt, onBlocked }: { src: string; alt: string; onBlocked: (src: string) => void }) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const check = useCallback(() => {
    const img = ref.current;
    if (!img) return;
    if (img.naturalWidth === 0 || isMosaic(img)) { onBlocked(src); return; }
    // Lets the gallery's justified rows size the tile to the photo
    (img.closest<HTMLElement>(".gallery-tile") ?? img.parentElement)?.style.setProperty("--ratio", String(img.naturalWidth / img.naturalHeight));
    setReady(true);
  }, [src, onBlocked]);
  // The image may have finished loading before hydration attached onLoad
  useEffect(() => {
    if (!ref.current?.complete) return;
    const frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [check]);
  return <img ref={ref} src={src} alt={alt} loading="lazy" data-checked className={ready ? "is-ready" : undefined} onLoad={check} onError={() => onBlocked(src)} />;
}
