"use client";

import { FiArrowRight, FiPlayCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

const HERO_VIDEO_INTRO = "/videos/IMG_7673.MOV";
const HERO_VIDEO_MAIN = "/videos/IMG_7729.MOV";
const DELAY_BEFORE_VIDEO_MS = 5000;

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), DELAY_BEFORE_VIDEO_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    if (!mainVideo) return;

    const playVideo = () => {
      mainVideo.play().catch(() => {});
    };

    mainVideo.addEventListener("loadeddata", playVideo, { once: true });
    if (mainVideo.readyState >= 2) playVideo();
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background: image first (fast load), then video after 5 sec */}
      <div className="absolute inset-0">
        {/* Intro video - visible on load and until main video starts */}
        <video
          ref={introVideoRef}
          src={HERO_VIDEO_INTRO}
          muted
          playsInline
          preload="auto"
          autoPlay
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            showVideo ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Main video - loops infinitely after 5 sec */}
        <video
          ref={mainVideoRef}
          src={HERO_VIDEO_MAIN}
          muted
          playsInline
          loop
          preload="auto"
          autoPlay
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[520px] w-full max-w-6xl flex-col items-start justify-center px-4 py-16 text-left sm:px-6 md:min-h-[600px] lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--brand-light)/80">
          Abby's Corner
        </p>

        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl font-heading">
          Elevate your style with{" "}
          <span className="text-(--brand-light)">signature fragrances</span>.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-(--brand-light)/85 sm:text-base">
          Discover intimate, long-lasting perfumes, created in small batches. From
          luminous florals to deep ambers, build a wardrobe of scents that linger
          long after you've passed.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
          <a
            href="#collections"
            className="group flex h-12 items-center gap-3 rounded-full bg-(--brand-primary) pl-7 pr-2 text-base font-semibold text-(--brand-light) transition-colors hover:bg-[#4a101a]"
          >
            View collection
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-(--brand-primary) transition-transform group-hover:translate-x-0.5">
              <FiArrowRight className="h-4 w-4" />
            </span>
          </a>

          <a
            href="#about"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <FiPlayCircle className="h-5 w-5" />
            Discover our story
          </a>
        </div>
      </div>
    </section>
  );
}
