"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CarouselImage = { src: string; alt: string };

const SWIPE_THRESHOLD = 40;

export function Carousel({
  images,
  intervalMs = 5000,
}: {
  images: CarouselImage[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs, paused]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      go(delta > 0 ? -1 : 1);
    }
    touchStartX.current = null;
  }

  const current = images[index];

  return (
    <div className="carousel">
      <div
        className="carousel-frame"
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.src} alt={current.alt} />
        {count > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-prev"
              onClick={() => go(-1)}
              aria-label="Image précédente"
            >
              ←
            </button>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-next"
              onClick={() => go(1)}
              aria-label="Image suivante"
            >
              →
            </button>
          </>
        )}
      </div>
      <div className="carousel-caption" aria-live="polite">
        <span>
          <b>Détail 0{index + 1}</b> : {current.alt}
        </span>
        {count > 1 && (
          <span>
            {index + 1} / {count}
          </span>
        )}
      </div>
      {count > 1 && (
        <div className="carousel-dots">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={"carousel-dot" + (i === index ? " active" : "")}
              onClick={() => setIndex(i)}
              aria-label={`Aller à l’image ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
