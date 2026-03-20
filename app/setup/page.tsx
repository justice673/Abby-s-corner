"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Loader2, Eye, EyeOff, Check, ArrowLeft, Sparkles, Shield } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const res = await fetch("/api/auth/setup");
      const data = await res.json();
      setSetupRequired(data.setupRequired);

      if (!data.setupRequired) {
        router.push("/login");
      }
    } catch {
      setError("Failed to check setup status");
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
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
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create admin account");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-(--brand-light) flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--brand-primary)/40" />
      </div>
    );
  }

  if (!setupRequired) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-(--brand-light) flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-(--brand-primary)">
            Admin account created!
          </h1>
          <p className="mt-2 text-sm text-(--brand-primary)/60">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

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
                <Shield className="h-4 w-4" />
                <span>One-time Setup</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-heading">
                Set up your
                <br />
                admin account
              </h1>
              <p className="text-lg opacity-80 max-w-md">
                Create your administrator account to start managing your perfume
                store. This is a one-time setup.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 max-w-md">
              {[
                "Full access to all dashboard features",
                "Manage products, orders, and customers",
                "View analytics and sales reports",
                "Add staff members later",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm opacity-90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-sm opacity-70">
            <Sparkles className="h-4 w-4" />
            <span>Your data is securely stored</span>
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
                Create admin account
              </h1>
              <p className="mt-2 text-sm text-(--brand-primary)/60">
                Set up your credentials to get started
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
                  Your name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Abby"
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
                  placeholder="abby@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-11 rounded-xl bg-white border-black/10"
                  required
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
                  "Create admin account"
                )}
              </Button>
            </form>

            {/* Help text */}
            <p className="mt-8 text-center text-xs text-(--brand-primary)/50">
              This is a one-time setup. You can add more users later from the
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
