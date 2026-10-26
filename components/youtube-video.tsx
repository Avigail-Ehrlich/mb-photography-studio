"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function YouTubeVideo({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button type="button" className="video-frame video-poster" onClick={() => setPlaying(true)} aria-label={`הפעלת הקליפ: ${title}`}>
      <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" loading="lazy" />
      <span className="video-play"><Play size={26} strokeWidth={1.5} fill="currentColor" aria-hidden="true" /></span>
    </button>
  );
}
