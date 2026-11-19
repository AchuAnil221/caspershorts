"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  ArrowRight,
  Video,
  CheckCircle2,
  Zap,
  Sliders,
  Type,
  Maximize2,
  Download,
  Share2,
  ChevronDown,
  Star,
  Users,
  Flame,
  ShieldCheck,
  Smartphone,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const pricingData = {
    free: {
      name: "Starter",
      desc: "Perfect for testing AI video repurposing",
      priceUSD: 0,
      priceINR: 0,
      mins: "60 mins/month",
      clips: "Up to 10 clips",
      res: "720p Export",
      features: [
        "60 minutes of video analysis",
        "AI highlight detection",
        "Center crop 9:16 conversion",
        "Standard subtitle presets",
        "Casper watermark",
      ],
      cta: "Start Free",
      popular: false,
    },
    pro: {
      name: "Creator Pro",
      desc: "For content creators & active podcasters",
      priceUSD: billingCycle === "monthly" ? 19 : 15,
      priceINR: billingCycle === "monthly" ? 1499 : 1199,
      mins: "300 mins/month",
      clips: "Unlimited clips",
      res: "1080p Full HD",
      features: [
        "300 minutes of video analysis",
        "AI hook & retention scoring",
        "Smart AI speaker tracking",
        "Dynamic word-level karaoke subtitles",
        "No watermark",
        "Custom brand templates & logos",
        "Fast rendering queue",
      ],
      cta: "Get Started with Pro",
      popular: true,
    },
    business: {
      name: "Studio / Agency",
      desc: "For media agencies and production teams",
      priceUSD: billingCycle === "monthly" ? 49 : 39,
      priceINR: billingCycle === "monthly" ? 3999 : 3199,
      mins: "1,200 mins/month",
      clips: "Unlimited clips",
      res: "4K Ultra HD",
      features: [
        "1,200 minutes of video analysis",
        "Priority GPU rendering queue",
        "Multi-speaker side-by-side framing",
        "Custom font uploads & brand kits",
        "Team workspace & collaboration",
        "Batch export to Google Drive / Dropbox",
        "Dedicated account manager",
      ],
      cta: "Upgrade to Studio",
      popular: false,
    },
  };

  const faqs = [
    {
      q: "How does Casper Shorts find the most engaging clips?",
      a: "Our AI engine extracts audio, generates timestamped transcripts using Whisper, and uses advanced language models to evaluate hook strength, storytelling structure, emotional intensity, and stand-alone context. It gives every candidate moment an AI Viral Score from 0 to 100.",
    },
    {
      q: "How does smart speaker tracking work in 9:16 vertical video?",
      a: "Casper Shorts uses computer vision face tracking to dynamically detect the active speaker in horizontal footage and smoothly pans the 9:16 crop box so the speaker is always framed in center without manual keyframing.",
    },
    {
      q: "Can I edit the generated subtitles and timing?",
      a: "Yes! Our built-in browser video editor lets you change any word in the transcript, adjust word-level timing, change subtitle presets (Minimal, Bold, Highlight, Creator, Professional), resize fonts, and change active word colors.",
    },
    {
      q: "What video formats and sources are supported?",
      a: "We support direct MP4, MOV, and WebM uploads up to 4GB. You can also paste authorized YouTube links to import video metadata and process your owned channel content seamlessly.",
    },
    {
      q: "What platforms can I export to?",
      a: "Export optimized 9:16 vertical videos tailored for YouTube Shorts, Instagram Reels, TikTok, and Snapchat, or 1:1 square videos for LinkedIn and Twitter/X.",
    },
    {
      q: "Can I download clips in bulk?",
      a: "Absolutely. You can select individual clips to export or click 'Download All as ZIP' to download every high-resolution clip generated from your source video in one package.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-600 selection:text-white">
      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-zinc-950">
                Casper<span className="text-blue-600">Shorts</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                AI Video Repurposing
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              Features
            </a>
            <a href="#comparison" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              Showcase
            </a>
            <a href="#pricing" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98]"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)] opacity-60" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>100% Free • No Credits Needed • Unlimited Processing</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl sm:leading-[1.15]">
              Turn 1 Long Video Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                10 Viral Shorts
              </span>{" "}
              In Seconds
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Upload any podcast, interview, or YouTube video. Casper Shorts analyzes hooks,
              tracks active speakers into 9:16 vertical, adds animated karaoke captions, and delivers
              ready-to-post Shorts, Reels, and TikToks.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard/create"
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-7 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] sm:w-auto"
              >
                <Sparkles className="h-4 w-4" />
                Start Creating Free
              </Link>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-base font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-300 sm:w-auto"
              >
                <Play className="h-4 w-4 fill-zinc-800" />
                Watch 60s Demo
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credits or tokens required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                100% Free & Unlimited
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No watermarks or paywalls
              </span>
            </div>
          </div>

          {/* ── Realistic Product Mockup ────────────────────────────────────── */}
          <div className="mt-14 rounded-2xl border border-zinc-200/90 bg-zinc-950 p-2 sm:p-4 shadow-2xl shadow-blue-900/10">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              {/* App Window Topbar */}
              <div className="flex h-11 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/70 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-zinc-400">
                    casper-shorts.app/dashboard/project/alex-hormozi-100m
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold">
                    ● 5 Clips Extracted
                  </Badge>
                  <Link
                    href="/dashboard/clips"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Open in Dashboard →
                  </Link>
                </div>
              </div>

              {/* Inside Dashboard Preview: 3 Vertical Clips */}
              <div className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-200">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      Source: Alex Hormozi — $100M SaaS Playbook (1h 14m)
                    </h3>
                    <p className="text-xs text-zinc-500">
                      AI identified 5 viral clips based on hook strength & retention curves
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Export:</span>
                    <span className="rounded-lg bg-white border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 shadow-sm">9:16 Vertical</span>
                    <span className="rounded-lg bg-white border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 shadow-sm">1080p HD</span>
                  </div>
                </div>

                {/* 3 Clip Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Clip 1 */}
                  <div className="group relative rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-zinc-100">
                      <img
                        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60"
                        alt="Clip 1 preview"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                        <Flame className="h-3 w-3 fill-white" />
                        AI Score 98
                      </div>
                      <div className="absolute top-2.5 right-2.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono text-white">
                        0:45
                      </div>
                      <div className="absolute inset-x-2 bottom-3 rounded-lg bg-black/80 p-2 backdrop-blur-sm">
                        <p className="text-center font-black tracking-wide text-amber-400 text-xs uppercase drop-shadow">
                          "THE NUMBER ONE REASON STARTUPS FAIL..."
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        Why 99% of Startups Die in Year One
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Hook: 98/100</span>
                        <span className="text-blue-600 font-semibold">Ready to post</span>
                      </div>
                    </div>
                  </div>

                  {/* Clip 2 */}
                  <div className="group relative rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-zinc-100">
                      <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60"
                        alt="Clip 2 preview"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                        <Flame className="h-3 w-3 fill-white" />
                        AI Score 94
                      </div>
                      <div className="absolute top-2.5 right-2.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono text-white">
                        0:34
                      </div>
                      <div className="absolute inset-x-2 bottom-3 rounded-lg bg-black/80 p-2 backdrop-blur-sm">
                        <p className="text-center font-black tracking-wide text-white text-xs uppercase drop-shadow">
                          "STOP SELLING CHEAP SERVICES"
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        The $0 Customer Acquisition Secret
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Hook: 95/100</span>
                        <span className="text-blue-600 font-semibold">Ready to post</span>
                      </div>
                    </div>
                  </div>

                  {/* Clip 3 */}
                  <div className="group relative rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-zinc-100">
                      <img
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=60"
                        alt="Clip 3 preview"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                        <Flame className="h-3 w-3 fill-white" />
                        AI Score 91
                      </div>
                      <div className="absolute top-2.5 right-2.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono text-white">
                        0:58
                      </div>
                      <div className="absolute inset-x-2 bottom-3 rounded-lg bg-black/80 p-2 backdrop-blur-sm">
                        <p className="text-center font-black tracking-wide text-blue-400 text-xs uppercase drop-shadow">
                          "PRICING IS AN EMOTIONAL LEVER"
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        How High Prices Build Loyalty
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Hook: 91/100</span>
                        <span className="text-blue-600 font-semibold">Ready to post</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof Bar ────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-100 bg-zinc-50/70 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Publish seamlessly to top social platforms
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-zinc-700">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <span className="h-3 w-3 rounded-full bg-red-600" />
              YouTube Shorts
            </div>
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <span className="h-3 w-3 rounded-full bg-pink-600" />
              Instagram Reels
            </div>
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <span className="h-3 w-3 rounded-full bg-black" />
              TikTok
            </div>
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <span className="h-3 w-3 rounded-full bg-blue-700" />
              LinkedIn Video
            </div>
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              <span className="h-3 w-3 rounded-full bg-black" />
              Twitter / X
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-3 text-blue-600 border-blue-200 bg-blue-50">
              Simple 3-Step Repurposing
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              From Raw Video to Viral Shorts in 3 Minutes
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              No manual clipping, no subtitle transcription, no manual crop keyframing.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold text-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-zinc-950">Upload or Paste URL</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Drop your MP4, MOV video or paste a YouTube URL. Choose your target platform,
                number of clips, and caption styling.
              </p>
              <div className="mt-6 rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-xs text-zinc-500 font-mono">
                ✓ Auto-detects audio tracks <br />
                ✓ Supports files up to 4GB
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-bold text-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-zinc-950">AI Analyzes & Scores</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                OpenAI Whisper generates word-level transcripts. Our LLM highlight engine
                identifies viral hooks, jokes, insights, and complete self-contained stories.
              </p>
              <div className="mt-6 rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-xs text-zinc-500 font-mono">
                ✓ Hook strength analysis <br />
                ✓ AI Viral Quality Score (0-100)
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 font-bold text-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-zinc-950">Export 9:16 Shorts</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                Computer vision keeps the speaker in center frame. Animated subtitles are burned
                in, and clips are exported in 1080p ready for direct social upload.
              </p>
              <div className="mt-6 rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-xs text-zinc-500 font-mono">
                ✓ Smart face & speaker tracking <br />
                ✓ 1-click batch ZIP download
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Features Grid ────────────────────────────────────────────────── */}
      <section id="features" className="bg-zinc-50/60 py-20 sm:py-28 border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-3 text-blue-600 border-blue-200 bg-blue-50">
              Enterprise AI Capabilities
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              Everything You Need to Dominate Short-Form Video
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Engineered with production-grade AI models, computer vision, and high-performance FFmpeg rendering.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:border-blue-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">AI Highlight Detection</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Trained on millions of top-performing TikToks and Shorts to recognize conversational
                hooks, contrarian insights, punchlines, and emotional high points.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:border-blue-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Smart Speaker Tracking</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Automatic computer-vision face and speaker detection ensures the active speaker stays centered
                in the vertical 9:16 frame, with smooth automated camera panning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:border-blue-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 mb-5">
                <Type className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Dynamic Karaoke Captions</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Word-by-word highlighted active words in 5 creator presets: Minimal, Bold,
                Highlight, Creator Style, and Professional. 98.5% transcription accuracy.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:border-blue-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Built-in Browser Editor</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Need to tweak a word or trim a couple of seconds? Use our full timeline editor
                with audio waveform, subtitle text correction, and real-time canvas preview.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:border-blue-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Brand Templates & Logos</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Save your custom brand colors, fonts, logo watermarks, and subtitle positions.
                Apply your brand identity to every generated clip with a single click.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm transition-all hover:border-blue-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-5">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Batch 1080p / 4K Export</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Download individual clips or click "Download All as ZIP". Fast cloud GPU rendering
                exports crisp MP4 video encoded for optimal mobile playback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Before & After Showcase ─────────────────────────────────────────── */}
      <section id="comparison" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-3 text-blue-600 border-blue-200 bg-blue-50">
              Before & After
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              See How 1 Long Episode Becomes 10 Viral Clips
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Compare the raw horizontal recording with the final AI-reframed vertical clips.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
            {/* Before: Horizontal video */}
            <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Before: Raw Recording (16:9)
                </span>
                <span className="text-xs font-mono text-zinc-400">58 mins</span>
              </div>
              <div className="mt-4 relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=60"
                  alt="Raw horizontal podcast"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-black/60 p-3 text-white backdrop-blur">
                    <Play className="h-6 w-6 fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
                  Full Podcast Studio Setup (1920x1080)
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-zinc-500">
                <p>⚠️ Horizontal format gets 85% less engagement on mobile feeds</p>
                <p>⚠️ No captions means silent mobile viewers scroll past</p>
                <p>⚠️ Finding key moments manually takes 4+ hours per episode</p>
              </div>
            </div>

            {/* Arrow Divider */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/25">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Casper AI Pipeline
              </span>
            </div>

            {/* After: 9:16 vertical clips */}
            <div className="lg:col-span-5 rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  After: 10 Ready-to-Post Shorts (9:16)
                </span>
                <Badge variant="default" className="bg-blue-600 text-white text-[10px]">
                  Generated in 2 mins
                </Badge>
              </div>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                <div className="relative aspect-[9/16] w-36 shrink-0 rounded-xl overflow-hidden bg-zinc-950 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60"
                    alt="After vertical clip 1"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Score 98
                  </div>
                  <div className="absolute bottom-2 inset-x-1 rounded bg-black/80 p-1 text-center font-bold text-[9px] text-yellow-400">
                    "AI WILL CHANGE THIS..."
                  </div>
                </div>

                <div className="relative aspect-[9/16] w-36 shrink-0 rounded-xl overflow-hidden bg-zinc-950 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60"
                    alt="After vertical clip 2"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Score 95
                  </div>
                  <div className="absolute bottom-2 inset-x-1 rounded bg-black/80 p-1 text-center font-bold text-[9px] text-white">
                    "HOW WE SCALED TO 10M"
                  </div>
                </div>

                <div className="relative aspect-[9/16] w-36 shrink-0 rounded-xl overflow-hidden bg-zinc-950 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60"
                    alt="After vertical clip 3"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Score 92
                  </div>
                  <div className="absolute bottom-2 inset-x-1 rounded bg-black/80 p-1 text-center font-bold text-[9px] text-blue-400">
                    "SECRET RETENTION HACK"
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-xs text-blue-900 font-medium">
                <p>✓ Active speaker tracked in 9:16 vertical crop</p>
                <p>✓ Karaoke highlighted subtitles with zero typing</p>
                <p>✓ Instant export to YouTube Shorts, Reels & TikTok</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ─────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-zinc-50/70 py-20 sm:py-28 border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-3 text-emerald-600 border-emerald-200 bg-emerald-50">
              100% Free Forever
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              No Subscriptions. No Credits. Full Free Access.
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Every single feature is completely unlocked for all creators with zero credit limitations or paywalls.
            </p>

            {/* Billing Toggle & Currency Select */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                    billingCycle === "annual"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  Annual
                  <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                    Save 20%
                  </span>
                </button>
              </div>

              <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setCurrency("USD")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    currency === "USD" ? "bg-zinc-950 text-white" : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrency("INR")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    currency === "INR" ? "bg-zinc-950 text-white" : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  ₹ INR
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Free */}
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-zinc-950">{pricingData.free.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{pricingData.free.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-950">
                  {currency === "USD" ? "$0" : "₹0"}
                </span>
                <span className="text-xs text-zinc-500">/month</span>
              </div>
              <div className="mt-2 text-xs font-medium text-blue-600">
                {pricingData.free.mins} • {pricingData.free.clips}
              </div>

              <ul className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-xs text-zinc-600">
                {pricingData.free.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/create"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50"
              >
                {pricingData.free.cta}
              </Link>
            </div>

            {/* Pro (Popular) */}
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3.5 py-0.5 text-[11px] font-bold text-white shadow">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-zinc-950">{pricingData.pro.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{pricingData.pro.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-950">
                  {currency === "USD"
                    ? `$${pricingData.pro.priceUSD}`
                    : `₹${pricingData.pro.priceINR}`}
                </span>
                <span className="text-xs text-zinc-500">/month</span>
              </div>
              <div className="mt-2 text-xs font-medium text-blue-600">
                {pricingData.pro.mins} • {pricingData.pro.res}
              </div>

              <ul className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-xs text-zinc-600">
                {pricingData.pro.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-medium text-zinc-800">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/subscription"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                {pricingData.pro.cta}
              </Link>
            </div>

            {/* Business */}
            <div className="relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-zinc-950">{pricingData.business.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{pricingData.business.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-950">
                  {currency === "USD"
                    ? `$${pricingData.business.priceUSD}`
                    : `₹${pricingData.business.priceINR}`}
                </span>
                <span className="text-xs text-zinc-500">/month</span>
              </div>
              <div className="mt-2 text-xs font-medium text-blue-600">
                {pricingData.business.mins} • {pricingData.business.res}
              </div>

              <ul className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-xs text-zinc-600">
                {pricingData.business.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/subscription"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50"
              >
                {pricingData.business.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="outline" className="mb-3 text-blue-600 border-blue-200 bg-blue-50">
              Questions & Answers
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Everything you need to know about our AI engine, speaker tracking, and licensing.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-zinc-950 hover:bg-zinc-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-zinc-600 border-t border-zinc-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to Multiply Your Video Reach 10x?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-blue-100 sm:text-lg">
            Join thousands of creators turning long-form podcasts, webinars, and gameplay
            into viral TikToks, Reels, and YouTube Shorts.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard/create"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-blue-600 shadow-xl transition-all hover:bg-blue-50 active:scale-[0.98] sm:w-auto"
            >
              Start Creating Now — Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20 sm:w-auto"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200 bg-white py-12 text-zinc-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-zinc-950">
                  Casper<span className="text-blue-600">Shorts</span>
                </span>
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500 max-w-sm">
                The modern AI video repurposing platform. Turn long horizontal videos into
                viral vertical shorts with automatic highlight detection, smart speaker framing,
                and dynamic karaoke captions.
              </p>
              <p className="mt-4 text-xs text-zinc-400">
                © {new Date().getFullYear()} Casper Shorts SaaS. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950">Product</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><a href="#features" className="hover:text-zinc-950">AI Highlight Engine</a></li>
                <li><a href="#features" className="hover:text-zinc-950">Speaker Tracking</a></li>
                <li><a href="#features" className="hover:text-zinc-950">Dynamic Captions</a></li>
                <li><Link href="/dashboard/editor/clip-1" className="hover:text-zinc-950">Video Editor</Link></li>
                <li><Link href="/dashboard/templates" className="hover:text-zinc-950">Brand Templates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950">Platforms</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><span className="text-zinc-500">YouTube Shorts</span></li>
                <li><span className="text-zinc-500">Instagram Reels</span></li>
                <li><span className="text-zinc-500">TikTok Video</span></li>
                <li><span className="text-zinc-500">LinkedIn Vertical</span></li>
                <li><span className="text-zinc-500">Snapchat Spotlight</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950">Legal & Auth</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link href="/dashboard" className="hover:text-zinc-950">Dashboard</Link></li>
                <li><Link href="/admin" className="hover:text-zinc-950">Admin Console</Link></li>
                <li><span className="text-zinc-400">Privacy Policy</span></li>
                <li><span className="text-zinc-400">Terms of Service</span></li>
                <li><span className="text-zinc-400">YouTube API Compliance</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Demo Modal ──────────────────────────────────────────────────────── */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl text-zinc-900">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-600 fill-blue-600" />
                Casper Shorts Product Walkthrough
              </h3>
              <button
                onClick={() => setDemoModalOpen(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-lg">
              <video
                controls
                autoPlay
                className="h-full w-full object-cover"
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              />
            </div>
            <div className="mt-4 flex items-center justify-between pt-1">
              <span className="text-xs text-zinc-500 font-medium">
                Experience automatic 9:16 extraction with synchronized subtitles
              </span>
              <Link
                href="/dashboard/create"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20"
              >
                Try It on Your Video →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
