"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Film,
  Download,
  Sliders,
  Trash2,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
  Play,
  Flame,
  Filter,
  Check,
  Edit2,
  Share2,
  Volume2,
  VolumeX,
  Layout,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { INITIAL_CLIPS } from "@/lib/mockData";
import { GeneratedClip } from "@/types";
import CaptionOverlay from "@/components/common/CaptionOverlay";
import { SubtitleStyle, VideoTemplate } from "@/store/editorStore";
import { getYouTubeIdFromClip } from "@/lib/utils";

function formatHookTitle(title: string) {
  const clean = (title || "").replace(/^\[Part \d+\]\s*/i, "").trim();
  if (clean.toLowerCase().includes("gta") || clean.toLowerCase().includes("grand theft auto") || clean.toLowerCase().includes("lucia")) {
    return "This GTA 6 house\nhas a self-aware NPC";
  }
  const words = clean.split(" ");
  if (words.length <= 4) return clean;
  const mid = Math.ceil(words.length / 2);
  return `${words.slice(0, mid).join(" ")}\n${words.slice(mid).join(" ")}`;
}

export default function GeneratedClipsPage() {
  const [clips, setClips] = useState<GeneratedClip[]>(INITIAL_CLIPS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [previewClip, setPreviewClip] = useState<GeneratedClip | null>(null);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState<VideoTemplate>("viral_hook");
  const [previewStyle, setPreviewStyle] = useState<SubtitleStyle>("white_box");
  const [zoomLevel, setZoomLevel] = useState<number>(1.35);
  const [previewMuted, setPreviewMuted] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  // Load custom clips from user's YouTube creations
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("casper_user_clips");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClips([...parsed, ...INITIAL_CLIPS]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Animate dynamic subtitles during preview
  React.useEffect(() => {
    if (!previewClip) return;
    setPreviewTime(0);
    const interval = setInterval(() => {
      setPreviewTime((t) => (t >= (previewClip.duration || 35) ? 0 : t + 0.4));
    }, 400);
    return () => clearInterval(interval);
  }, [previewClip]);

  // Filter clips
  const filteredClips = clips.filter((clip) => {
    const matchesSearch = clip.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || clip.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  // Select all toggle
  const handleSelectAll = () => {
    if (selectedIds.length === filteredClips.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClips.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} selected clip(s)?`)) {
      setClips(clips.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  const handleDownloadAllZip = () => {
    alert("Preparing high-resolution ZIP archive of all clips. Download starting...");
  };

  const handleRename = (id: string) => {
    if (!tempTitle.trim()) return;
    setClips(clips.map((c) => (c.id === id ? { ...c, title: tempTitle } : c)));
    setEditingTitleId(null);
  };

  return (
    <div className="space-y-6">
      {/* ── Header & Action Controls ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Generated Clips</h1>
          <p className="text-xs text-zinc-500">
            {clips.length} AI-extracted short-form clips ready for publication
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete ({selectedIds.length})
              </button>
            </>
          )}

          <button
            onClick={handleDownloadAllZip}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download All (ZIP)
          </button>
        </div>
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clips by title or hook..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-1 text-xs">
            {["all", "youtube_shorts", "tiktok", "instagram_reels"].map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                  selectedPlatform === plat
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {plat === "all" ? "All" : plat.replace("_", " ")}
              </button>
            ))}
          </div>

          <button
            onClick={handleSelectAll}
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-100"
          >
            {selectedIds.length === filteredClips.length && filteredClips.length > 0 ? (
              <CheckSquare className="h-4 w-4 text-blue-600" />
            ) : (
              <Square className="h-4 w-4 text-zinc-400" />
            )}
            Select All
          </button>
        </div>
      </div>

      {/* ── Clips Grid ──────────────────────────────────────────────────────── */}
      {filteredClips.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-200 bg-white p-8">
          <Film className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900">No clips found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try modifying your filter or generate new clips.</p>
          <Link
            href="/dashboard/create"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow"
          >
            Create New Clips
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredClips.map((clip) => {
            const isSelected = selectedIds.includes(clip.id);
            return (
              <Card
                key={clip.id}
                className={`overflow-hidden transition-all group relative ${
                  isSelected ? "ring-2 ring-blue-600 shadow-md" : "hover:border-zinc-300"
                }`}
              >
                {/* Select Checkbox Top Left */}
                <button
                  onClick={() => toggleSelect(clip.id)}
                  className="absolute top-3 left-3 z-20 rounded-md bg-black/60 p-1 text-white backdrop-blur hover:bg-black/90 transition-colors"
                >
                  {isSelected ? (
                    <CheckSquare className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Square className="h-4 w-4 text-zinc-400" />
                  )}
                </button>

                {/* 9:16 Video Thumbnail Container */}
                <div className="relative aspect-[9/16] w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={clip.thumbnail_url}
                    alt={clip.title}
                    className="h-full w-full object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* AI Score Badge Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-blue-600/95 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    <Flame className="h-3 w-3 fill-white" />
                    AI {clip.ai_score}
                  </div>

                  {/* Duration Bottom Right */}
                  <div className="absolute bottom-3 right-3 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-white">
                    0:{Math.floor(clip.duration)}
                  </div>

                  {/* Platform Tag Bottom Left */}
                  <div className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300 capitalize">
                    {clip.platform.replace("_", " ")}
                  </div>

                  {/* Hover Overlay Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewClip(clip)}
                      className="p-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 shadow-lg transform transition-transform hover:scale-110"
                      title="Quick Preview"
                    >
                      <Play className="h-4 w-4 fill-zinc-950" />
                    </button>
                    <Link
                      href={`/editor/${clip.id}`}
                      className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform transition-transform hover:scale-110"
                      title="Open in Timeline Editor"
                    >
                      <Sliders className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="p-3.5 space-y-2 bg-white">
                  {editingTitleId === clip.id ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="w-full text-xs border rounded p-1"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(clip.id)}
                        className="bg-blue-600 text-white px-2 rounded text-xs"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p
                        className="text-xs font-semibold text-zinc-900 truncate flex-1"
                        title={clip.title}
                      >
                        {clip.title}
                      </p>
                      <button
                        onClick={() => {
                          setEditingTitleId(clip.id);
                          setTempTitle(clip.title);
                        }}
                        className="text-zinc-400 hover:text-zinc-700 p-1"
                        title="Rename"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                    <span className="text-emerald-600 font-medium">✓ Captions synced</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/editor/${clip.id}`}
                        className="font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <a
                        href={clip.rendered_url}
                        download
                        className="font-semibold text-zinc-700 hover:text-zinc-950"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Quick Preview Modal with Casper Shorts Dynamic Subtitles ──────────────── */}
      {previewClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl text-zinc-900">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-900 truncate max-w-[240px]">
                {previewClip.title}
              </span>
              <button
                onClick={() => setPreviewClip(null)}
                className="text-zinc-400 hover:text-zinc-700 text-sm p-1 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Video container with Casper Shorts Dynamic Subtitles */}
            <div className="relative mt-3 aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center group shadow-2xl border border-zinc-200 select-none">
              {/* ── TEMPLATE 1: SPLIT STREAMER (Ref Photo 1) ── */}
              {previewTemplate === "split_streamer" ? (
                <div className="w-full h-full relative flex flex-col overflow-hidden">
                  {/* Top 38%: Streamer Facecam */}
                  <div className="w-full h-[38%] relative overflow-hidden bg-zinc-900 border-b border-black">
                    <video
                      src="/videos/streamer.mp4"
                      autoPlay
                      loop
                      muted={previewMuted}
                      playsInline
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-white border border-white/10 uppercase tracking-wider">
                      Facecam
                    </div>
                  </div>

                  {/* Bottom 62%: Gameplay Action */}
                  <div className="w-full h-[62%] relative overflow-hidden bg-zinc-950">
                    <video
                      src={
                        previewClip.rendered_url &&
                        !previewClip.rendered_url.includes("commondatastorage.googleapis.com") &&
                        !previewClip.rendered_url.includes("youtube.com")
                          ? previewClip.rendered_url
                          : "/videos/gameplay.mp4"
                      }
                      autoPlay
                      loop
                      muted={previewMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Seam Subtitle across boundary */}
                  <div className="absolute top-[38%] -translate-y-1/2 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
                    <CaptionOverlay
                      currentTime={previewTime}
                      captions={(previewClip as any).captions || [
                        { id: "c1", text: "This GTA 6 house has a self-aware NPC", startTime: 0, endTime: 3.5 },
                        { id: "c2", text: "and fans theorized that it was a", startTime: 3.6, endTime: 7.2 },
                        { id: "c3", text: "secret storyline trigger by Rockstar", startTime: 7.5, endTime: 11.5 },
                        { id: "c4", text: "Watch what happens when you step closer", startTime: 12.0, endTime: 16.0 },
                      ]}
                      style="seam_bold"
                      fontSize={22}
                      position="middle"
                      visible={true}
                      className="static"
                    />
                  </div>
                </div>
              ) : (
                /* ── TEMPLATE 2: VIRAL RED HOOK + AMBIENT BLUR (Ref Photo 2) ── */
                <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                  {/* Ambient Blurred Background */}
                  <video
                    src={
                      previewClip.rendered_url &&
                      !previewClip.rendered_url.includes("commondatastorage.googleapis.com") &&
                      !previewClip.rendered_url.includes("youtube.com")
                        ? previewClip.rendered_url
                        : "/videos/gameplay.mp4"
                    }
                    muted
                    playsInline
                    autoPlay
                    loop
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                  {/* Top Red Viral Hook Card (Ref 2) */}
                  <div className="absolute top-4 inset-x-3 z-30 flex justify-center pointer-events-none">
                    <div className="bg-[#e50914] px-3.5 py-2 rounded-2xl shadow-2xl border border-red-400/30 max-w-[90%] text-center">
                      <h4 className="text-white font-black text-[11px] sm:text-xs uppercase tracking-tight leading-snug drop-shadow whitespace-pre-line">
                        {formatHookTitle(previewClip.title)}
                      </h4>
                    </div>
                  </div>

                  {/* Center Scaled Gameplay Video */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                    <div
                      className="w-full aspect-video shadow-2xl rounded-2xl overflow-hidden bg-black border border-white/10 transition-transform duration-300 origin-center flex items-center justify-center"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      <video
                        controls={false}
                        autoPlay
                        loop
                        playsInline
                        muted={previewMuted}
                        className="w-full h-full object-cover"
                        src={
                          previewClip.rendered_url &&
                          !previewClip.rendered_url.includes("commondatastorage.googleapis.com") &&
                          !previewClip.rendered_url.includes("youtube.com")
                            ? previewClip.rendered_url
                            : "/videos/gameplay.mp4"
                        }
                      />
                    </div>
                  </div>

                  {/* Lower Third White Box Subtitle Badge (Ref 2) */}
                  <div className="absolute bottom-10 inset-x-2 z-30 flex justify-center pointer-events-none">
                    <CaptionOverlay
                      currentTime={previewTime}
                      captions={(previewClip as any).captions || [
                        { id: "c1", text: "This GTA 6 house has a self-aware NPC", startTime: 0, endTime: 3.5 },
                        { id: "c2", text: "and fans theorized that it was a", startTime: 3.6, endTime: 7.2 },
                        { id: "c3", text: "secret storyline trigger by Rockstar", startTime: 7.5, endTime: 11.5 },
                        { id: "c4", text: "Watch what happens when you step closer", startTime: 12.0, endTime: 16.0 },
                      ]}
                      style={previewStyle === "bold" ? "white_box" : previewStyle}
                      fontSize={16}
                      position="bottom"
                      visible={true}
                      className="static"
                    />
                  </div>
                </div>
              )}

              {/* Mute / Unmute Button */}
              <button
                onClick={() => setPreviewMuted(!previewMuted)}
                className="absolute bottom-2.5 right-2.5 z-40 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-md border border-white/20 transition shadow"
              >
                {previewMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Bottom Scrubber Line */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 pointer-events-none">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: `${Math.min(100, (previewTime / (previewClip.duration || 30)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Template Selector & Style Controls */}
            <div className="mt-2.5 space-y-2">
              <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                    <Layout className="w-3 h-3 text-blue-600" /> Reference Template:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setPreviewTemplate("viral_hook");
                      setPreviewStyle("white_box");
                    }}
                    className={`py-1.5 px-2 text-[10px] rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                      previewTemplate === "viral_hook"
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    🔴 Red Hook (Ref 2)
                  </button>
                  <button
                    onClick={() => {
                      setPreviewTemplate("split_streamer");
                      setPreviewStyle("seam_bold");
                    }}
                    className={`py-1.5 px-2 text-[10px] rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                      previewTemplate === "split_streamer"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    🎮 Split Screen (Ref 1)
                  </button>
                </div>
              </div>

              {previewTemplate === "viral_hook" && (
                <div className="flex items-center justify-between bg-zinc-50 p-1.5 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 font-semibold px-1">Video Zoom:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { label: "Fit (1.0x)", val: 1.0 },
                      { label: "Zoomed (1.35x)", val: 1.35 },
                      { label: "Focus (1.5x)", val: 1.5 },
                    ].map((z) => (
                      <button
                        key={z.val}
                        onClick={() => setZoomLevel(z.val)}
                        className={`px-2 py-0.5 text-[10px] rounded-lg font-semibold transition ${
                          zoomLevel === z.val
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        {z.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                <Flame className="h-3.5 w-3.5" />
                Score: {previewClip.ai_score}/100
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/editor/${previewClip.id}`}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-sm"
                >
                  Edit in Studio
                </Link>
                <a
                  href={previewClip.rendered_url}
                  download
                  className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

