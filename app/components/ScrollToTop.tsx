"use client";

import { useState, useEffect } from "react";
import { FiChevronUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const halfHeight = document.documentElement.scrollHeight / 2;
      setIsVisible(typeof window !== "undefined" && window.scrollY > halfHeight);
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-(--brand-primary) text-(--brand-light) shadow-lg transition hover:bg-[#4a101a] hover:scale-110"
    >
      <FiChevronUp className="h-6 w-6" />
    </button>
  );
}
