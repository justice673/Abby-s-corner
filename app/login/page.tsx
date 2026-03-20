"use client";

import * as React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Loader2, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const cb = sp.get("callbackUrl") || "/dashboard";
    const err = sp.get("error") || "";
    setCallbackUrl(cb);
    setErrorMessage(err);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
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
                <span>Admin Dashboard</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-heading">
                Manage your
                <br />
                perfume empire
              </h1>
              <p className="text-lg opacity-80 max-w-md">
                Track orders, manage products, and grow your fragrance business
                all in one place.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm opacity-70">Products managed</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <p className="text-2xl font-bold">1.2k</p>
                <p className="text-sm opacity-70">Happy customers</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-white/20 border-2 border-(--brand-primary) flex items-center justify-center text-xs font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm opacity-70">
              Trusted by store owners in Cameroon
            </p>
          </div>
        </div>

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/IMG_7827.jpeg"
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-(--brand-primary)">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-(--brand-primary)/60">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-(--brand-primary)"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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

              <Button
                type="submit"
                className="w-full bg-(--brand-primary) text-white hover:bg-(--brand-primary)/90 h-11 rounded-xl font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-(--brand-light) px-4 text-(--brand-primary)/40">
                  Abby&apos;s Corner Admin
                </span>
              </div>
            </div>

            {/* Help text */}
            <p className="text-center text-xs text-(--brand-primary)/50">
              Need help?{" "}
              <a
                href="https://wa.me/237123456789"
                className="text-(--brand-primary) hover:underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
