"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  PlusCircle,
  Video,
  Film,
  Clock,
  ArrowRight,
  Play,
  Flame,
  CheckCircle2,
  TrendingUp,
  Download,
  Sliders,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INITIAL_PROJECTS, INITIAL_CLIPS, INITIAL_SUBSCRIPTION } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [projects] = useState(INITIAL_PROJECTS);
  const [clips] = useState(INITIAL_CLIPS);
  const [subscription] = useState(INITIAL_SUBSCRIPTION);

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold backdrop-blur-sm mb-2">
            <Sparkles className="h-3.5 w-3.5" /> 100% Free • Unlimited Credits
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Creator"}!
          </h1>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            You have <strong className="text-white font-bold">Unlimited Processing</strong> with zero credit limits. Upload or paste any video to repurpose into viral shorts!
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow-md transition-all hover:bg-blue-50 active:scale-[0.98] shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Video
        </Link>
      </div>

      {/* ── Metric KPI Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Videos Processed
              </p>
              <h3 className="mt-1 text-2xl font-bold text-zinc-950">14</h3>
              <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +3 this week
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Video className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Clips Generated
              </p>
              <h3 className="mt-1 text-2xl font-bold text-zinc-950">58</h3>
              <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> 92% viral score avg
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Film className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Processing Quota
              </p>
              <h3 className="mt-1 text-2xl font-bold text-emerald-600">
                Unlimited
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                No credit consumption limits
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Current Plan
              </p>
              <h3 className="mt-1 text-2xl font-bold text-zinc-950">
                Full Free
              </h3>
              <p className="mt-1 text-xs text-emerald-600 font-semibold">
                ✓ All Pro & Studio features unlocked
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Generated Clips ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Recent Generated Clips</h2>
            <p className="text-xs text-zinc-500">Ready-to-publish vertical clips with high viral scores</p>
          </div>
          <Link
            href="/dashboard/clips"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all clips ({clips.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clips.slice(0, 4).map((clip) => (
            <Card key={clip.id} className="overflow-hidden group">
              <div className="relative aspect-[9/16] w-full bg-zinc-950 overflow-hidden">
                <img
                  src={clip.thumbnail_url}
                  alt={clip.title}
                  className="h-full w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-blue-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                  <Flame className="h-3 w-3 fill-white" />
                  Score {clip.ai_score}
                </div>
                <div className="absolute top-2.5 right-2.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono text-white">
                  {Math.floor(clip.duration)}s
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/editor/${clip.id}`}
                    className="p-2 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 shadow"
                    title="Open in Video Editor"
                  >
                    <Sliders className="h-4 w-4" />
                  </Link>
                  <a
                    href={clip.rendered_url}
                    download
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow"
                    title="Download Clip"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="p-3.5">
                <p className="text-xs font-semibold text-zinc-900 truncate" title={clip.title}>
                  {clip.title}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="capitalize">{clip.platform.replace("_", " ")}</span>
                  <Link
                    href={`/editor/${clip.id}`}
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Recent Projects ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Recent Video Projects</h2>
            <p className="text-xs text-zinc-500">Source episodes analyzed and queued</p>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all projects ({projects.length}) <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Project Name</th>
                  <th className="px-5 py-3.5">Source</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Clips</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="px-5 py-4 font-semibold text-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Video className="h-4 w-4" />
                        </div>
                        <span className="truncate max-w-xs">{proj.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 capitalize">
                      {proj.source_type === "youtube" ? "YouTube Link" : "Direct Upload"}
                    </td>
                    <td className="px-5 py-4 font-mono text-zinc-500">
                      {Math.floor(proj.duration / 60)} mins
                    </td>
                    <td className="px-5 py-4">
                      {proj.status === "completed" ? (
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]">
                          ✓ Completed
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-blue-500/10 text-blue-700 border-blue-200 text-[10px] animate-pulse">
                          ● {proj.status.replace("_", " ")} ({proj.progress}%)
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 font-bold text-zinc-800">
                      {proj.clips_count || 0} clips
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href="/dashboard/clips"
                        className="rounded-lg border border-zinc-200 px-3 py-1 font-semibold text-zinc-700 hover:bg-zinc-100"
                      >
                        View Clips
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

