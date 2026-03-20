// Minimal API types used by the (removed) onboarding-app shim.
//
// This repo no longer includes `onboarding-app/`, but Vercel/Next can still
// compile this file. Keep it lightweight and self-contained.

export interface UserProfile {
  activeCompanyId?: string | null;
}


