import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-950">
              Casper<span className="text-blue-600">Shorts</span>
            </span>
          </Link>
          <p className="mt-2 text-xs text-zinc-500">
            AI Video to Shorts Repurposing Platform
          </p>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-zinc-200/90 shadow-xl shadow-zinc-200/50">
          {children}
        </div>
      </div>
    </div>
  );
}

