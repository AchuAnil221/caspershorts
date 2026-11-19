"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">Reset your password</h2>
        <p className="mt-1 text-xs text-zinc-500">
          We'll send password reset instructions to your registered email
        </p>
      </div>

      {submitted ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
          <h4 className="text-sm font-bold text-emerald-900">Check your inbox</h4>
          <p className="mt-1 text-xs text-emerald-700">
            If an account exists for {email}, a recovery link has been dispatched.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

