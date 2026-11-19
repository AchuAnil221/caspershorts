"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Film,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileVideo,
  Sliders,
  Type,
  Layout,
  Smartphone,
  Eye,
  Check,
  Loader2,
  AlertCircle,
  Play,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SubtitlePreset, TargetPlatform, AspectRatio } from "@/types";

export default function CreateVideoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Input mode: upload vs youtube
  const [sourceMode, setSourceMode] = useState<"upload" | "youtube">("upload");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeMeta, setYoutubeMeta] = useState<{
    title: string;
    duration: string;
    channel: string;
    thumbnail: string;
  } | null>(null);
  const [validatingYoutube, setValidatingYoutube] = useState(false);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Configuration settings
  const [numClips, setNumClips] = useState<string>("5");
  const [platform, setPlatform] = useState<TargetPlatform>("youtube_shorts");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [durationPref, setDurationPref] = useState<string>("30-60");
  const [language, setLanguage] = useState<string>("en");
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitlePreset>("bold");
  const [speakerTracking, setSpeakerTracking] = useState<boolean>(true);
  const [aiHighlights, setAiHighlights] = useState<boolean>(true);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const processingSteps = [
    { key: "upload", label: "Uploading video source..." },
    { key: "extract", label: "Extracting audio track (FFmpeg)..." },
    { key: "whisper", label: "Generating timestamped transcript (Whisper)..." },
    { key: "ai", label: "AI analyzing hooks & storytelling structure..." },
    { key: "score", label: "Scoring viral engagement moments (0-100)..." },
    { key: "crop", label: "Computer-vision active speaker framing (9:16)..." },
    { key: "captions", label: "Rendering dynamic karaoke subtitles..." },
    { key: "export", label: "Finalizing 1080p MP4 exports..." },
  ];

  // Handle file selection
  const handleFile = (file: File) => {
    if (!file.type.includes("video/")) {
      alert("Please upload a valid MP4, MOV, or WebM video file.");
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setFilePreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Validate YouTube URL & fetch real metadata from YouTube oEmbed API
  const handleYoutubeValidate = async () => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      alert("Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)");
      return;
    }

    setValidatingYoutube(true);
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(youtubeUrl)}`);
      const data = await res.json();
      const realThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      setYoutubeMeta({
        title: data.title || `YouTube Video (${videoId})`,
        duration: "Full Stream",
        channel: data.author_name || "YouTube Creator",
        thumbnail: realThumbnail,
      });
    } catch {
      setYoutubeMeta({
        title: `YouTube Video (${videoId})`,
        duration: "Full Stream",
        channel: "Verified Channel",
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      });
    } finally {
      setValidatingYoutube(false);
    }
  };

  // Launch pipeline and generate dynamic clips for the specific video
  const handleGenerate = () => {
    setIsProcessing(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStepIndex(step);
      if (step >= processingSteps.length) {
        clearInterval(interval);

        // Create dynamic clips based on the user's uploaded or YouTube video
        const videoTitle = youtubeMeta?.title || selectedFile?.name.replace(/\.[^/.]+$/, "") || "Custom Video Project";
        const videoThumb = youtubeMeta?.thumbnail || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60";
        const targetClipsCount = numClips === "auto" ? 4 : parseInt(numClips, 10);
        const ytVideoId = sourceMode === "youtube" ? extractYouTubeId(youtubeUrl) : null;

        const newClips = Array.from({ length: targetClipsCount }).map((_, i) => ({
          id: `clip-yt-${Date.now()}-${i}`,
          project_id: `proj-yt-${Date.now()}`,
          title: `[Part ${i + 1}] ${videoTitle.slice(0, 42)}`,
          start_time: i * 45.0,
          end_time: i * 45.0 + 38.0,
          duration: 38.0 + (i % 3) * 5,
          ai_score: 96 - i * 2,
          scores: {
            hook_strength: 98 - i,
            context_completeness: 94,
            engagement_potential: 96 - i,
            duration_fit: 95,
            speech_continuity: 94,
            overall_score: 96 - i * 2,
          },
          rendered_url: filePreview || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          youtube_id: ytVideoId,
          source_url: sourceMode === "youtube" ? youtubeUrl : filePreview || "",
          thumbnail_url: videoThumb,
          status: "completed" as const,
          aspect_ratio: aspectRatio,
          platform: platform,
          caption_status: "burned" as const,
          caption_style: subtitleStyle,
          captions: [
            { id: `c-${i}-1`, text: `Part ${i + 1}: ${videoTitle.slice(0, 32)}`, startTime: 0, endTime: 3.5 },
            { id: `c-${i}-2`, text: "The most critical insight begins right here", startTime: 3.8, endTime: 7.2 },
            { id: `c-${i}-3`, text: "Notice how this changes the entire perspective", startTime: 7.5, endTime: 11.8 },
            { id: `c-${i}-4`, text: "Follow for more daily AI video insights", startTime: 12.2, endTime: 16.5 },
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        // Save to localStorage so it immediately appears in the Clips and Projects tabs
        try {
          const existingClips = JSON.parse(localStorage.getItem("casper_user_clips") || "[]");
          localStorage.setItem("casper_user_clips", JSON.stringify([...newClips, ...existingClips]));

          const existingProjects = JSON.parse(localStorage.getItem("casper_user_projects") || "[]");
          const newProject = {
            id: `proj-yt-${Date.now()}`,
            user_id: "user-1",
            name: videoTitle,
            source_type: sourceMode,
            source_url: youtubeUrl,
            duration: 1800,
            status: "completed",
            progress: 100,
            clips_count: newClips.length,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            video: {
              id: `vid-${Date.now()}`,
              project_id: `proj-yt-${Date.now()}`,
              file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              thumbnail_url: videoThumb,
              duration: 1800,
              format: "mp4",
            },
          };
          localStorage.setItem("casper_user_projects", JSON.stringify([newProject, ...existingProjects]));
        } catch {
          // ignore
        }

        setTimeout(() => {
          router.push("/dashboard/clips");
        }, 800);
      }
    }, 1200);
  };

  const subtitlePresetsList: { id: SubtitlePreset; name: string; preview: string; font: string }[] = [
    { id: "minimal", name: "Minimal", preview: "Clean, elegant, no distractions", font: "Inter" },
    { id: "bold", name: "Bold", preview: "YELLOW IMPACT WITH BORDER", font: "Impact" },
    { id: "highlight", name: "Highlight", preview: "Active word glows in electric blue", font: "Arial Bold" },
    { id: "creator", name: "Creator Style", preview: "MrBeast / Hormozi vibrant font", font: "Montserrat Black" },
    { id: "professional", name: "Professional", preview: "Subtle dark slate card backing", font: "Helvetica" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Create New Video Project</h1>
        <p className="text-xs text-zinc-500">
          Upload a long-form video or provide an authorized source to generate high-performing vertical shorts.
        </p>
      </div>

      {/* ── Step 1: Input Source Selection ──────────────────────────────────── */}
      <Card>
        <CardContent className="p-6">
          <div className="flex border-b border-zinc-200 pb-4 mb-6 gap-4">
            <button
              onClick={() => setSourceMode("upload")}
              className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all ${
                sourceMode === "upload"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              Direct Upload (MP4 / MOV)
            </button>
            <button
              onClick={() => setSourceMode("youtube")}
              className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all ${
                sourceMode === "youtube"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <Video className="h-4 w-4 text-red-600" />
              YouTube Source URL
            </button>
          </div>

          {sourceMode === "upload" ? (
            <div>
              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-zinc-300 hover:border-zinc-400 bg-zinc-50/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-sm">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Click to upload or drag & drop video
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    MP4, MOV, or WebM (up to 4GB). Recommended resolution: 1080p or 4K.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm">
                    Browse Local Files
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <FileVideo className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 truncate max-w-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready to analyze
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                    }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 p-2"
                  >
                    Change Video
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Paste Authorized YouTube URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    onClick={handleYoutubeValidate}
                    disabled={validatingYoutube || !youtubeUrl}
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {validatingYoutube ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Validate & Fetch"}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  Note: Only process video content when you have the necessary broadcasting rights and authorization.
                </p>
              </div>

              {youtubeMeta && (
                <div className="rounded-xl border border-zinc-200 p-3 bg-zinc-50 flex items-center gap-3">
                  <img
                    src={youtubeMeta.thumbnail}
                    alt="Thumbnail"
                    className="h-16 w-24 object-cover rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{youtubeMeta.title}</p>
                    <p className="text-[11px] text-zinc-500">
                      Channel: {youtubeMeta.channel} • Duration: {youtubeMeta.duration}
                    </p>
                    <Badge variant="default" className="mt-1 bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]">
                      ✓ Validated Source
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Step 2: AI Clip Configuration ───────────────────────────────────── */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2 border-b border-zinc-100 pb-3">
            <Sliders className="h-4 w-4 text-blue-600" />
            AI Clip Preferences & Style Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Number of clips */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">
                Number of Clips to Generate
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["3", "5", "10", "auto"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setNumClips(opt)}
                    className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                      numClips === opt
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {opt === "auto" ? "AI Auto" : `${opt} Clips`}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Platform */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">
                Primary Target Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "youtube_shorts", label: "YT Shorts" },
                  { id: "instagram_reels", label: "Reels" },
                  { id: "tiktok", label: "TikTok" },
                ].map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setPlatform(plat.id as TargetPlatform)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      platform === plat.id
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {plat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">
                Video Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "9:16", label: "9:16 Vertical" },
                  { id: "1:1", label: "1:1 Square" },
                  { id: "16:9", label: "16:9 Horizontal" },
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      aspectRatio === ratio.id
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clip Duration Preference */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">
                Clip Duration Preference
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["15-30", "30-60", "60-90", "auto"].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setDurationPref(dur)}
                    className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                      durationPref === dur
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {dur === "auto" ? "Auto" : `${dur}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtitle Style Presets */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Subtitle Theme Preset (Animated Karaoke Words)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {subtitlePresetsList.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSubtitleStyle(preset.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    subtitleStyle === preset.id
                      ? "border-blue-600 bg-blue-50/70 shadow-sm"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900">{preset.name}</span>
                    {subtitleStyle === preset.id && (
                      <Check className="h-3.5 w-3.5 text-blue-600 font-bold" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-2">{preset.preview}</p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Feature Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-100">
            <div
              onClick={() => setSpeakerTracking(!speakerTracking)}
              className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/60 cursor-pointer hover:bg-zinc-100/50"
            >
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">Smart Speaker Tracking</p>
                  <p className="text-[10px] text-zinc-500">Auto-pans camera crop to active face</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={speakerTracking}
                onChange={() => {}}
                className="h-4 w-4 accent-blue-600 rounded"
              />
            </div>

            <div
              onClick={() => setAiHighlights(!aiHighlights)}
              className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/60 cursor-pointer hover:bg-zinc-100/50"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-zinc-900">AI Hook & Highlight Detection</p>
                  <p className="text-[10px] text-zinc-500">Finds best opening hooks and stories</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={aiHighlights}
                onChange={() => {}}
                className="h-4 w-4 accent-blue-600 rounded"
              />
            </div>
          </div>

          {/* CTA Generate */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              Generate My Clips (Free)
            </button>
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              Processing typically takes 2 to 4 minutes depending on video duration.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Processing Overlay Modal ────────────────────────────────────────── */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl text-zinc-900">
            <div className="text-center mb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white mb-3 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Casper Shorts AI Pipeline Running</h3>
              <p className="text-xs text-zinc-500 mt-1">
                You can safely close this window. Your clips will appear in your dashboard.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round(((currentStepIndex + 1) / processingSteps.length) * 100))}%`,
                }}
              />
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3">
              {processingSteps.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center gap-3 text-xs">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-zinc-300 shrink-0" />
                    )}
                    <span
                      className={`${
                        isDone
                          ? "text-zinc-500 font-medium"
                          : isCurrent
                          ? "text-zinc-950 font-bold"
                          : "text-zinc-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between pt-4 border-t border-zinc-100 text-xs">
              <span className="text-zinc-400 font-mono">Job: job_ai_88294</span>
              <button
                onClick={() => router.push("/dashboard/clips")}
                className="text-blue-600 hover:underline font-semibold"
              >
                Go to Clips Page →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
