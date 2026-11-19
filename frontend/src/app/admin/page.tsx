"use client";

import React, { useState } from "react";
import {
  Users,
  Video,
  DollarSign,
  HardDrive,
  RefreshCw,
  Plus,
  Minus,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [stats] = useState({
    total_users: 14820,
    active_subscriptions: 3940,
    total_videos_processed: 89420,
    total_clips_generated: 412950,
    platform_revenue_usd: 84900,
    platform_revenue_inr: 7046700,
    storage_usage_gb: 4120,
    celery_queue_size: 14,
  });

  const [users, setUsers] = useState([
    { id: "u-1", name: "Alex Rivera", email: "alex@creatorgrowth.io", plan: "Community Free", credits: "Unlimited", totalClips: 84 },
    { id: "u-2", name: "Sophia Zhang", email: "sophia@podcaster.ai", plan: "Community Free", credits: "Unlimited", totalClips: 192 },
    { id: "u-3", name: "Marcus Vance", email: "marcus@reelsflow.com", plan: "Community Free", credits: "Unlimited", totalClips: 41 },
    { id: "u-4", name: "Priya Sharma", email: "priya@mediaagency.in", plan: "Community Free", credits: "Unlimited", totalClips: 310 },
  ]);

  const [jobs, setJobs] = useState([
    { id: "job-8912", project: "Huberman Lab Ep 241", status: "completed", duration: "1h 42m" },
    { id: "job-8913", project: "Y Combinator Demo Day", status: "processing", duration: "54m" },
    { id: "job-8914", project: "MKBHD Studio Tour 4K", status: "queued", duration: "24m" },
    { id: "job-8915", project: "Lex Fridman AI Debate", status: "failed", duration: "3h 10m", error: "FFmpeg memory limit" },
  ]);

  const retryJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "queued", error: undefined } : j))
    );
  };

  return (
    <div className="space-y-8">
      {/* ── KPI Stats Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Total Registered Users</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="mt-2 text-2xl font-bold text-zinc-950">{stats.total_users.toLocaleString()}</h3>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
            {stats.active_subscriptions.toLocaleString()} active creators
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Videos Repurposed</span>
            <Video className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="mt-2 text-2xl font-bold text-zinc-950">
            {stats.total_videos_processed.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500">
            {stats.total_clips_generated.toLocaleString()} total vertical clips
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Gross Value Delivered</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="mt-2 text-2xl font-bold text-zinc-950">
            ${stats.platform_revenue_usd.toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold">100% Free for creators</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>R2 / S3 Storage Usage</span>
            <HardDrive className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="mt-2 text-2xl font-bold text-zinc-950">
            {(stats.storage_usage_gb / 1024).toFixed(1)} TB
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500">99.8% job success rate</p>
        </div>
      </div>

      {/* ── User Credit Management ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" /> User Directory & Account Management
          </h3>
        </div>
        <table className="w-full text-left text-xs text-zinc-700">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-semibold">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Clips Output</th>
              <th className="px-5 py-3">Credits</th>
              <th className="px-5 py-3 text-right">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-bold text-zinc-900">{u.name}</p>
                  <p className="text-[11px] text-zinc-500">{u.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {u.plan}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-bold text-zinc-900">{u.totalClips}</td>
                <td className="px-5 py-3.5 font-mono text-emerald-600 font-bold">{u.credits}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-xs text-zinc-500 font-medium">Uncapped</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Processing Jobs Queue Monitor ───────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-emerald-600" /> Background Celery Pipeline Jobs
          </h3>
        </div>
        <table className="w-full text-left text-xs text-zinc-700">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase font-semibold">
            <tr>
              <th className="px-5 py-3">Job ID</th>
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-zinc-500">{j.id}</td>
                <td className="px-5 py-3.5 font-bold text-zinc-900">{j.project}</td>
                <td className="px-5 py-3.5 text-zinc-500">{j.duration}</td>
                <td className="px-5 py-3.5">
                  {j.status === "completed" ? (
                    <span className="text-emerald-600 font-semibold">✓ Completed</span>
                  ) : j.status === "failed" ? (
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Failed: {j.error}
                    </span>
                  ) : (
                    <span className="text-blue-600 font-semibold animate-pulse">● Queued</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {j.status === "failed" && (
                    <button
                      onClick={() => retryJob(j.id)}
                      className="rounded-lg bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-1 text-[11px] font-bold hover:bg-rose-100 transition-colors"
                    >
                      Retry Job
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
