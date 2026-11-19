"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionPage() {
  const freeFeatures = [
    "Unlimited video minutes analysis",
    "Unlimited vertical short-form clip generation",
    "1080p & 4K Ultra HD exports",
    "Smart speaker tracking & automatic 9:16 framing",
    "Dynamic word-level karaoke animated subtitles",
    "All 5 subtitle theme presets (Minimal, Bold, Highlight, Creator, Professional)",
    "Custom brand templates, logos, and color palettes",
    "Batch ZIP downloads with single click",
    "No watermarks on exported videos",
    "Browser-based multi-track video timeline editor",
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Free & Open Access</h1>
        <p className="text-xs text-zinc-500">
          Casper Shorts is 100% free with no credits needed and zero subscription paywalls
        </p>
      </div>

      <Card className="border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 overflow-hidden">
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-base font-bold">Community Edition — All Features Free</h2>
          </div>
          <Badge variant="default" className="bg-white text-emerald-800 font-bold border-0 text-xs">
            ACTIVE FOR EVERYONE
          </Badge>
        </div>

        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <h3 className="text-2xl font-extrabold text-zinc-950">Unlimited Everything</h3>
              <p className="text-xs text-zinc-500 mt-1">
                No monthly subscriptions, no tokens, no credit deductions.
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-emerald-600">$0</span>
              <span className="text-xs text-zinc-400 font-semibold">/ forever</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-4">
              Everything Included With Zero Restrictions:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-zinc-700">
              {freeFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Full commercial usage rights for all created content</span>
            </div>
            <Link
              href="/dashboard/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              Start Repurposing Videos Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
