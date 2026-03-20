"use client";

import * as React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Heart,
  Package,
  Clock,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/auth/login");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-(--brand-primary) relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-lg font-bold">
                AC
              </div>
              <div>
                <span className="text-xs font-medium tracking-[0.2em] uppercase opacity-70">
                  Abby&apos;s Corner
                </span>
                <p className="text-sm font-medium">Perfumery</p>
              </div>
            </Link>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Join Abby&apos;s Corner</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-heading">
                Discover your
                <br />
                signature scent
              </h1>
              <p className="text-lg opacity-80 max-w-md">
                Create an account to track your orders, save your favorites, and
                get exclusive offers.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 max-w-md">
              <div className="flex items-start gap-4 rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Track Your Orders</p>
                  <p className="text-sm opacity-70">
                    Follow your perfumes from purchase to delivery
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Save Favorites</p>
                  <p className="text-sm opacity-70">
                    Build your wishlist of dream fragrances
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Faster Checkout</p>
                  <p className="text-sm opacity-70">
                    Save your details for quick reorders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm opacity-70">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline hover:opacity-100">
              Sign in
            </Link>
          </div>
        </div>

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/IMG_7764.jpeg"
            alt="Abby's Corner Perfumery"
            fill
            className="object-cover opacity-20"
          />
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-(--brand-light) flex flex-col">
        {/* Mobile header */}
        <div className="p-4 lg:p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-(--brand-primary)/70 hover:text-(--brand-primary) transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-(--brand-primary) text-white text-xl font-bold mb-4">
                AC
              </div>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-(--brand-primary)">
                Create an account
              </h1>
              <p className="mt-2 text-sm text-(--brand-primary)/60">
                Join Abby&apos;s Corner today
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-(--brand-primary)"
                >
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl bg-white border-black/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-(--brand-primary)"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-11 rounded-xl bg-white border-black/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-(--brand-primary)"
                >
                  Phone number{" "}
                  <span className="text-(--brand-primary)/40">(optional)</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-xl bg-white border-black/10"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-(--brand-primary)"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl bg-white border-black/10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--brand-primary)/50 hover:text-(--brand-primary) transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-(--brand-primary)"
                >
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-xl bg-white border-black/10"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90 h-11 rounded-xl font-medium mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-(--brand-primary)/60">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-(--brand-primary) font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
