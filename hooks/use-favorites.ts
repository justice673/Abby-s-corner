"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "abbys-favorites";

function readStored(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.map(String));
    }
  } catch {
    // ignore
  }
  return new Set();
}

function writeStored(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLikedIds(readStored());
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeStored(next);
      return next;
    });
  }, []);

  const isLiked = useCallback(
    (id: string) => likedIds.has(id),
    [likedIds]
  );

  return { likedIds, toggleLike, isLiked };
}

