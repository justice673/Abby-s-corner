"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <AuthLayout
      title="Join us"
      subtitle="Create an account to save your favorites, place orders and enjoy our exclusive offers."
      backLabel="Back to login"
      backHref="/login"
    >
      <div className="rounded-lg p-8">
        <h2 className="text-xl font-semibold text-(--brand-primary)">
          Sign up
        </h2>
        <p className="mt-1 text-sm text-(--brand-primary)/70">
          Fill in the form to create your account
        </p>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-(--brand-primary)"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full rounded border border-(--brand-primary)/20 bg-white px-3 py-2.5 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/40 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
              required
            />
          </div>
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
              placeholder="you@example.com"
              className="mt-1 w-full rounded border border-(--brand-primary)/20 bg-white px-3 py-2.5 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/40 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-(--brand-primary)"
            >
              Password
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-(--brand-primary)"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded border border-(--brand-primary)/20 bg-white px-3 py-2.5 text-sm text-(--brand-primary) placeholder:text-(--brand-primary)/40 focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
              required
            />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-(--brand-primary)/30 text-(--brand-primary)"
              required
            />
            <span className="text-(--brand-primary)/80">
              I accept the{" "}
              <Link href="#" className="text-(--brand-primary) hover:underline">
                terms and conditions
              </Link>{" "}
              and the{" "}
              <Link href="#" className="text-(--brand-primary) hover:underline">
                privacy policy
              </Link>
            </span>
          </label>
          <button
            type="submit"
            className="w-full rounded bg-(--brand-primary) py-2.5 text-sm font-semibold text-(--brand-light) transition hover:bg-[#4a101a]"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--brand-primary)/70">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-(--brand-primary) hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
