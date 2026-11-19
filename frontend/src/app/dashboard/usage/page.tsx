"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gauge, Clock, Zap, CheckCircle2, History, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UsagePage() {
  const usageHistory = [
    { id: 1, title: "Alex Hormozi — $100M SaaS", date: "2026-11-18", duration: "74 mins", clips: 5, status: "Free" },
    { id: 2, title: "Lex Fridman Podcast #412", date: "2026-11-17", duration: "120 mins", clips: 8, status: "Free" },
    { id: 3, title: "All-In Podcast E180", date: "2026-11-15", duration: "80 mins", clips: 4, status: "Free" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Usage & Processing Status</h1>
        <p className="text-xs text-zinc-500">
          Your account has full unlimited free access. No credits or payment required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Processing Minutes Quota
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-emerald-600">
            Unlimited <span className="text-sm font-normal text-zinc-500">Free</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            No credit balance deduction. Process as many videos as you want.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            100% Free Tier Active
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Generated Clips Cap
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-zinc-900">
            No Limit <span className="text-sm font-normal text-zinc-500">(Unlimited)</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Export in 1080p and 4K without watermarks
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Full Resolution Unlocked
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Unlocked Features
            </p>
            <ul className="mt-2 space-y-1 text-xs text-zinc-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Smart 9:16 Speaker Tracking
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Karaoke Highlighted Subtitles
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Custom Brand Templates
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Batch ZIP Downloads
              </li>
            </ul>
          </div>
          <Link
            href="/dashboard/create"
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow"
          >
            Create Video Now
          </Link>
        </Card>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <History className="h-4 w-4 text-zinc-400" />
            Processed Videos
          </h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 uppercase font-semibold">
            <tr>
              <th className="px-5 py-3">Source Video</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Input Duration</th>
              <th className="px-5 py-3">Clips Output</th>
              <th className="px-5 py-3 text-right">Fee / Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {usageHistory.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50/70">
                <td className="px-5 py-3.5 font-semibold text-zinc-900">{row.title}</td>
                <td className="px-5 py-3.5 text-zinc-500">{row.date}</td>
                <td className="px-5 py-3.5 text-zinc-600">{row.duration}</td>
                <td className="px-5 py-3.5 font-bold text-zinc-800">{row.clips} shorts</td>
                <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-600">
                  FREE ($0)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
