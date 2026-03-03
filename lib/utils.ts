import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in CFA (Senegal currency). Uses space as thousands separator. */
export function formatPriceCFA(amount: number): string {
  return `${amount.toLocaleString("fr-FR").replace(/\s/g, " ")} FCFA`;
}

/** Approximate conversion: 1 EUR ≈ 656 FCFA */
export const EUR_TO_CFA = 656;
