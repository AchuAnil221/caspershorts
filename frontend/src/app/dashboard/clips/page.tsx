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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { INITIAL_CLIPS } from "@/lib/mockData";
import { GeneratedClip } from "@/types";
import CaptionOverlay from "@/components/common/CaptionOverlay";
import { SubtitleStyle } from "@/store/editorStore";

function getYouTubeIdFromClip(clip: any): string | null {
  if (!clip) return null;
  if (clip.youtube_id) return clip.youtube_id;
  if (clip.source_url) {
    const match = clip.source_url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/);
    if (match && match[2].length === 11) return match[2];
  }
  if (clip.thumbnail_url && clip.thumbnail_url.includes("youtube.com/vi/")) {
    const match = clip.thumbnail_url.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
    if (match && match[1]) return match[1];
  }
  if (clip.rendered_url && clip.rendered_url.includes("youtube.com")) {
    const match = clip.rendered_url.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default function GeneratedClipsPage() {
  const [clips, setClips] = useState<GeneratedClip[]>(INITIAL_CLIPS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [previewClip, setPreviewClip] = useState<GeneratedClip | null>(null);
  const [previewTime, setPreviewTime] = useState(0);
  const [previewStyle, setPreviewStyle] = useState<SubtitleStyle>("bold");
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
            <div className="relative mt-3 aspect-[9/16] w-full rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center group shadow-md border border-zinc-200">
              {/* Blurred Ambient Layer (Top & Bottom) */}
              {getYouTubeIdFromClip(previewClip) ? (
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl scale-125 opacity-70 pointer-events-none"
                  style={{
                    backgroundImage: `url(${
                      previewClip.thumbnail_url ||
                      `https://img.youtube.com/vi/${getYouTubeIdFromClip(previewClip)}/hqdefault.jpg`
                    })`,
                  }}
                />
              ) : (
                <video
                  src={previewClip.rendered_url}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70 pointer-events-none"
                />
              )}

              {/* Top Viral Hook Headline Badge */}
              <div className="absolute top-3 inset-x-2 z-30 flex justify-center pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg max-w-[92%]">
                  <h4 className="text-white font-black text-[11px] uppercase tracking-wide text-center truncate">
                    {previewClip.title.replace(/^\[Part \d+\]\s*/, '')}
                  </h4>
                </div>
              </div>

              {/* Foreground Center Video (YouTube Embed or Native Video) */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                {getYouTubeIdFromClip(previewClip) ? (
                  <div className="w-full aspect-video max-h-[64%] shadow-2xl rounded-xl overflow-hidden bg-black border border-white/10">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${getYouTubeIdFromClip(
                        previewClip
                      )}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&start=${Math.floor(
                        previewClip.start_time || 0
                      )}`}
                      className="w-full h-full border-0 rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full object-contain max-h-[64%] shadow-2xl rounded-lg"
                    src={previewClip.rendered_url}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget;
                      if (video.textTracks) {
                        for (let i = 0; i < video.textTracks.length; i++) {
                          video.textTracks[i].mode = 'disabled';
                        }
                      }
                    }}
                  />
                )}
              </div>

              {/* Dynamic Bottom Subtitle Overlay */}
              <CaptionOverlay
                currentTime={previewTime}
                captions={(previewClip as any).captions || [
                  { id: 'c1', text: `${previewClip.title.slice(0, 32)}`, startTime: 0, endTime: 3.5 },
                  { id: 'c2', text: 'AI detected high-retention viral moment', startTime: 3.8, endTime: 7.5 },
                  { id: 'c3', text: 'Smart speaker tracking in vertical 9:16', startTime: 7.8, endTime: 11.5 },
                  { id: 'c4', text: 'Dynamic animated karaoke subtitles', startTime: 12.0, endTime: 16.0 },
                ]}
                style={previewStyle}
                fontSize={18}
                fontColor="#ffffff"
                position="bottom"
                visible={true}
                className="z-30 pointer-events-none"
              />
            </div>

            {/* Subtitle Style Quick Selector */}
            <div className="mt-2.5 flex items-center justify-between bg-zinc-50 p-1.5 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 font-semibold px-1">Subtitle Style:</span>
              <div className="flex items-center gap-1">
                {(['bold', 'highlight', 'creator', 'minimal'] as SubtitleStyle[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPreviewStyle(st)}
                    className={`px-1.5 py-0.5 text-[10px] rounded-lg font-semibold capitalize transition ${
                      previewStyle === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
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

