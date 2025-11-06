"use client";

import * as React from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { getProxiedImageUrl } from "@/lib/imageProxy";
import { motion, AnimatePresence } from "framer-motion";

export default function PropertyCarouselMobile({
  urls,
  onChangeIndex,
}: {
  urls: string[];
  onChangeIndex?: (i: number) => void;
}) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    // reset index when urls change
    setIndex(0);
  }, [urls]);

  React.useEffect(() => {
    onChangeIndex?.(index);
  }, [index, onChangeIndex]);

  const proxied = React.useMemo(
    () => urls.map((u) => getProxiedImageUrl(u)),
    [urls]
  );

  const [animDir, setAnimDir] = React.useState(0);

  const prev = React.useCallback(() => {
    setAnimDir(-1);
    setIndex((i) => (i - 1 + urls.length) % Math.max(1, urls.length));
  }, [urls.length]);

  const next = React.useCallback(() => {
    setAnimDir(1);
    setIndex((i) => (i + 1) % Math.max(1, urls.length));
  }, [urls.length]);

  // Touch tracking refs for swipe gestures
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);
  const touchMoved = React.useRef(false);

  if (!urls || urls.length === 0) {
    return <div className="w-full h-[300px] bg-[var(--card-bg)] rounded-md" />;
  }

  return (
    <PhotoProvider>
      <div className="relative w-full">
        <div className="relative w-full h-[300px] rounded-md overflow-hidden bg-[#f3f3f3]">
          {/* Current index indicator */}
          <div className="absolute top-2 right-2 z-30">
            <div className="px-2 py-1 rounded-md bg-white/90 text-black text-sm font-medium shadow-sm">
              {`${index + 1}/${urls.length}`}
            </div>
          </div>
          {/* Main image gallery: render a PhotoView for every image so the lightbox
              has access to the full gallery (prevents 1/1 issue). Only the current
              image shows the visible button and content. */}
          {proxied.map((p, i) => (
            <PhotoView key={i} src={urls[i]}>
              <div
                className={`${i === index ? "block" : "hidden"} w-full h-full`}
              >
                <button
                  aria-label={`Open image ${i + 1}`}
                  className="w-full h-full p-0 m-0 block"
                  style={{ background: "transparent", border: 0 }}
                  onTouchStart={(e) => {
                    const t = e.touches[0];
                    touchStartX.current = t.clientX;
                    touchStartY.current = t.clientY;
                    touchMoved.current = false;
                  }}
                  onTouchMove={(e) => {
                    const t = e.touches[0];
                    const dx = t.clientX - (touchStartX.current ?? 0);
                    const dy = t.clientY - (touchStartY.current ?? 0);
                    if (Math.abs(dx) > 10 && Math.abs(dy) < 100) {
                      touchMoved.current = true;
                    }
                  }}
                  onTouchEnd={(e) => {
                    const lastTouch = e.changedTouches[0];
                    const startX = touchStartX.current ?? 0;
                    const startY = touchStartY.current ?? 0;
                    const dx = lastTouch.clientX - startX;
                    const dy = lastTouch.clientY - startY;
                    const THRESHOLD = 50; // px
                    if (Math.abs(dx) > THRESHOLD && Math.abs(dy) < 120) {
                      if (dx > 0) prev();
                      else next();
                    }
                    touchStartX.current = null;
                    touchStartY.current = null;
                  }}
                  onClick={(e) => {
                    if (touchMoved.current) {
                      e.preventDefault();
                      e.stopPropagation();
                      touchMoved.current = false;
                    }
                  }}
                >
                  <AnimatePresence initial={false} custom={animDir}>
                    {i === index && (
                      <motion.div
                        key={index}
                        custom={animDir}
                        initial={{ x: animDir * 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -animDir * 100, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full relative"
                      >
                        <Image
                          src={p}
                          alt={`Property image ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority={i === 0}
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </PhotoView>
          ))}

          {/* Prev / Next buttons */}
          {urls.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-white rounded-full w-16 h-16 flex items-center justify-center bg-transparent"
                style={{ lineHeight: 1 }}
              >
                <span
                  className="text-5xl"
                  style={{ display: "block", lineHeight: 1 }}
                >
                  ‹
                </span>
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-white rounded-full w-16 h-16 flex items-center justify-center bg-transparent"
                style={{ lineHeight: 1 }}
              >
                <span
                  className="text-5xl"
                  style={{ display: "block", lineHeight: 1 }}
                >
                  ›
                </span>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {urls.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2">
            {proxied.map((p, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${i === index ? "border-[var(--btn-primary)]" : "border-transparent"}`}
                style={{ width: 80, height: 60 }}
              >
                <Image
                  src={p}
                  alt={`Thumb ${i + 1}`}
                  width={80}
                  height={60}
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </PhotoProvider>
  );
}
