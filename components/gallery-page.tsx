"use client";

import { useCallback, useState } from "react";
import { CheckedImage } from "@/components/checked-image";
import { Lightbox } from "@/components/lightbox";
import { SiteFooter, SiteHeader, SkipLinks } from "@/components/site-chrome";
import { YouTubeVideo } from "@/components/youtube-video";
import { galleryCollections, type GalleryImage } from "@/lib/gallery-data";

// The full gallery: one section per collection (reached by #family, #chalake, #bat-mitzvah),
// each a fixed-ratio grid whose photos open in a lightbox that pages through that collection.
export function GalleryPage() {
  const [blocked, setBlocked] = useState<ReadonlySet<string>>(() => new Set());
  const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; index: number } | null>(null);
  // A photo the viewer's content filter blocks is dropped rather than shown as a mosaic
  const markBlocked = useCallback((src: string) => setBlocked((current) => current.has(src) ? current : new Set(current).add(src)), []);
  const moveLightbox = (step: number) =>
    setLightbox((current) => current === null ? null : { ...current, index: (current.index + step + current.images.length) % current.images.length });

  return (
    <main dir="rtl" className="gallery-page overflow-x-clip bg-[var(--cream)] text-[var(--ink)]">
      <SkipLinks />
      <SiteHeader home={false} />

      <section id="top" className="gal-hero">
        <span className="gal-hero-word" aria-hidden="true">Gallery</span>
        <h1>גלריית העבודות</h1>
      </section>

      {galleryCollections.map((collection) => {
        const images = collection.images.filter((image) => !blocked.has(image.src));
        return (
          <section key={collection.id} id={collection.id} className="gal-section" aria-labelledby={`${collection.id}-title`}>
            <div className="gal-inner">
              <div className="gal-intro">
                <p className="section-kicker">{collection.label}</p>
                <h2 id={`${collection.id}-title`} className="section-title mt-4">{collection.title}</h2>
                <p className="gal-summary">{collection.summary}</p>
              </div>
              {collection.youtubeId && <div className="gallery-video"><YouTubeVideo id={collection.youtubeId} title={collection.title} /></div>}
              {collection.images.length > 0 && (
                <div className="gal-grid">
                  {collection.images.map((image) => !blocked.has(image.src) && (
                    <button key={image.src} type="button" className="gal-tile" onClick={() => setLightbox({ images, index: images.findIndex((item) => item.src === image.src) })} aria-label={`הגדלת התמונה: ${image.alt}`}>
                      <CheckedImage src={image.src} alt={image.alt} onBlocked={markBlocked} />
                      <span className="gal-tile-overlay" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {lightbox !== null && <Lightbox images={lightbox.images} index={lightbox.index} onClose={() => setLightbox(null)} onMove={moveLightbox} />}
      <SiteFooter home={false} />
    </main>
  );
}
