/**
 * Shim for onboarding-app imports.
 *
 * Next.js build compiles the whole repo and aliases `@/` to the repo root,
 * so onboarding-app's `@/utils/auth-redirect` resolves here.
 *
 * Keep it lightweight to avoid pulling onboarding-app-only types.
 */
export function getPostLoginRedirect(
  userProfile: any,
  redirectParam?: string | null
): string {
  if (redirectParam) {
    try {
      const decoded = decodeURIComponent(redirectParam);
      if (decoded.startsWith("/") && !decoded.startsWith("//")) {
        return decoded;
      }
    } catch {
      // ignore invalid encoding
    }
  }

  if (userProfile?.activeCompanyId) {
    return "/company/dashboard";
  }

  return "/user/dashboard";
}

