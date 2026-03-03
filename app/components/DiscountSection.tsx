"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BG_IMAGE = "/images/discount-hero.jpg";

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

function GlassTimerUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-none border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5">
      <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl md:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/80">
        {label}
      </span>
    </div>
  );
}

export default function DiscountSection() {
  // Target: 3 days from now
  const [target] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(23, 59, 59, 999);
    return d;
  });

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden sm:min-h-[480px] md:min-h-[520px]">
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
          Offre limitée
        </p>
        <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl font-heading">
          Jusqu&apos;à <span className="text-amber-300">-25%</span> sur une
          sélection de parfums
        </h2>
        <p className="max-w-md text-sm text-white/85 sm:text-base">
          Profitez de nos offres exclusives. L&apos;offre se termine bientôt.
        </p>

        {/* Glass timer - each unit in its own glass div, no border radius */}
        {timeLeft.expired ? (
          <p className="text-lg font-semibold text-white">
            L&apos;offre est terminée
          </p>
        ) : (
          <div className="flex items-stretch gap-2 sm:gap-3">
            <GlassTimerUnit value={timeLeft.days} label="Jours" />
            <GlassTimerUnit value={timeLeft.hours} label="Heures" />
            <GlassTimerUnit value={timeLeft.minutes} label="Min" />
            <GlassTimerUnit value={timeLeft.seconds} label="Sec" />
          </div>
        )}

        <a
          href="#collections"
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-(--brand-primary) transition hover:bg-white/95"
        >
          Voir les offres
        </a>
      </div>
    </section>
  );
}
