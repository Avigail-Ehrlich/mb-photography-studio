"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { CheckedImage } from "@/components/checked-image";
import type { GalleryImage } from "@/lib/gallery-data";

export type Session = { number: string; id: string; title: string; text: string; photo?: GalleryImage };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const motionStopped = () => document.documentElement.classList.contains("a11y-still") || matchMedia("(prefers-reduced-motion: reduce)").matches;

// The collections block: one photo frame sticks beside the list; each next photo fades in while
// coming into focus from a soft blur, scrubbed by the scroll position of its text block.
export function SessionsShowcase({ sessions, onBlocked }: { sessions: Session[]; onBlocked: (src: string) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>(".session-block"));
    const layers = Array.from(root.querySelectorAll<HTMLElement>(".session-layer"));
    const target: number[] = layers.map((_, index) => (index === 0 ? 1 : 0));
    const current = [...target];
    let frame = 0;

    const paint = () => {
      const still = motionStopped();
      let settled = true;
      const eased = current.map((value) => value * value * (3 - 2 * value));
      layers.forEach((layer, index) => {
        if (index > 0) {
          current[index] = still ? Math.round(target[index]) : current[index] + (target[index] - current[index]) * 0.14;
          if (Math.abs(target[index] - current[index]) < 0.002) current[index] = target[index];
          else settled = false;
          eased[index] = current[index] * current[index] * (3 - 2 * current[index]);
          layer.style.opacity = String(eased[index]);
        }
        // Blurred while arriving, and blurred again while the next photo takes over
        const blur = (index > 0 ? (1 - eased[index]) * 14 : 0) + (index + 1 < layers.length ? eased[index + 1] * 8 : 0);
        layer.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : "";
        layer.style.transform = `scale(${1 + (index > 0 ? (1 - eased[index]) * 0.03 : 0)})`;
      });
      frame = settled ? 0 : requestAnimationFrame(paint);
    };
    const update = () => {
      const vh = window.innerHeight;
      blocks.forEach((block, index) => {
        if (index === 0) return;
        // From the block's top at 70% of the screen to 40% of the screen, so each photo then stays fully visible while the block scrolls on
        target[index] = clamp((vh * 0.7 - block.getBoundingClientRect().top) / (vh * 0.3));
      });
      if (!frame) frame = requestAnimationFrame(paint);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, [sessions.length]);

  return (
    <div ref={rootRef} className="session-showcase">
      <div className="session-stage">
        <div className="session-frame">
          <div className="session-photos">
            {sessions.map((session, index) => (
              <div key={session.id} className="session-layer" style={{ zIndex: index + 1, opacity: index === 0 ? undefined : 0, filter: index === 0 ? undefined : "blur(14px)" }}>
                {session.photo ? (
                  <CheckedImage key={session.photo.src} src={session.photo.src} alt={session.photo.alt} onBlocked={onBlocked} />
                ) : (
                  <div className="image-placeholder"><span>{session.title} · תמונה תתווסף כאן</span></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="session-blocks">
        {sessions.map((session) => (
          <article key={session.id} className="session-block">
            <span className="session-number">{session.number}</span>
            <h3>{session.title}</h3>
            <p>{session.text}</p>
            <a href={`/gallery#${session.id}`} className="session-more">לגלריית {session.title} <ArrowLeft size={17} strokeWidth={1.5} aria-hidden="true" /></a>
          </article>
        ))}
      </div>
    </div>
  );
}
