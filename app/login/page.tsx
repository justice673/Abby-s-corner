"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout
      title="Welcome"
      subtitle="Sign in to your account to access your favorites, cart and orders."
      backLabel="Back to home"
      backHref="/"
    >
      <div className="rounded-lg p-8">
        <h2 className="text-xl font-semibold text-(--brand-primary)">
          Sign in
        </h2>
        <p className="mt-1 text-sm text-(--brand-primary)/70">
          Enter your credentials to sign in
        </p>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-(--brand-primary)"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="mt-1 w-full rounded border border-(--brand-primary)/20 bg-white px-3 py-2.5 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/40 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-(--brand-primary)"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded border border-(--brand-primary)/20 bg-white px-3 py-2.5 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/40 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-(--brand-primary)/30 text-(--brand-primary)"
              />
              <span className="text-(--brand-primary)/80">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-(--brand-primary) hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-(--brand-primary) py-2.5 text-sm font-semibold text-(--brand-light) transition hover:bg-[#4a101a]"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--brand-primary)/70">
          Don't have an account yet?{" "}
          <Link href="/register" className="font-medium text-(--brand-primary) hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
