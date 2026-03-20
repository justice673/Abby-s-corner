// Re-export onboarding-app API type definitions.
//
// The main Next.js build compiles the whole monorepo, and onboarding-app uses
// `@/lib/api/types`. Our root project aliases `@/` to the repo root, so this
// shim makes those imports resolve.
export * from "../../../onboarding-app/src/lib/api/types";

