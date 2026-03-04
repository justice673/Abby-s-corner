"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { EmptyStateLottie } from "@/app/components/EmptyStateLottie";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-(--brand-light) flex items-center justify-center px-4">
      <div className="max-w-2xl w-full flex flex-col items-center text-center gap-6">
        <div className="w-48 h-48 shrink-0">
          <EmptyStateLottie />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-(--brand-primary)">
            Error 404
          </h1>
          <p className="mt-2 text-(--brand-primary)/80">
            The page you are looking for could not be found or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-(--brand-primary) text-(--brand-light) font-semibold px-6 py-3 rounded-full hover:bg-[#4a101a] transition-colors"
        >
          Back to home
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
