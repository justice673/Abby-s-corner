"use client";

import React from "react";

export interface HealthcareLoaderProps {
  className?: string;
  size?: number;
}

// Lightweight fallback loader for builds.
// The onboarding-app expects this import path: "@/components/ui/healthcare-loader".
export function HealthcareLoader({
  className = "",
  size = 200,
}: HealthcareLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-(--brand-primary)/20 border-t-(--brand-primary)/80"
        aria-label="Loading..."
      />
    </div>
  );
}

