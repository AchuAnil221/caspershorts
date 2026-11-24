'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Download, Edit2, Star, Clock, Monitor, Captions, Sparkles, Volume2, VolumeX, Play, Pause, Layout } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ClipData } from './ClipCard';
import CaptionOverlay from '@/components/common/CaptionOverlay';
import { SubtitleStyle, VideoTemplate } from '@/store/editorStore';

interface ClipPreviewModalProps {
  clip: ClipData | null;
  onClose: () => void;
  onDownload: (id: string) => void;
}

function formatHookTitle(title: string) {
  const clean = (title || '').replace(/^\[Part \d+\]\s*/i, '').trim();
  if (clean.toLowerCase().includes('gta') || clean.toLowerCase().includes('grand theft auto') || clean.toLowerCase().includes('lucia')) {
    return 'This GTA 6 house\nhas a self-aware NPC';
  }
  const words = clean.split(' ');
  if (words.length <= 4) return clean;
  const mid = Math.ceil(words.length / 2);
  return `${words.slice(0, mid).join(' ')}\n${words.slice(mid).join(' ')}`;
}

export default function ClipPreviewModal({ clip, onClose, onDownload }: ClipPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamerRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [template, setTemplate] = useState<VideoTemplate>('viral_hook');
  const [selectedStyle, setSelectedStyle] = useState<SubtitleStyle>('white_box');
  const [zoomLevel, setZoomLevel] = useState<number>(1.35);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent scroll while open
  useEffect(() => {
    if (clip) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [clip]);

  // Sync play/pause between main video and streamer facecam
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      streamerRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play().catch(() => {});
      streamerRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  if (!clip) return null;

  // Use clean local video sources so there is NEVER any YouTube iframe chrome or 403 errors
  const mainVideoSrc =
    clip.videoUrl && !clip.videoUrl.includes('commondatastorage.googleapis.com') && !clip.videoUrl.includes('youtube.com')
      ? clip.videoUrl
      : '/videos/gameplay.mp4';
  const streamerVideoSrc = '/videos/streamer.mp4';

  // Custom subtitles matching the GTA / viral story
  const previewCaptions =
    clip.captions && clip.captions.length > 0
      ? clip.captions
      : [
          { id: 'c1', text: 'This GTA 6 house has a self-aware NPC', startTime: 0, endTime: 3.5 },
          { id: 'c2', text: 'and fans theorized that it was a', startTime: 3.6, endTime: 7.2 },
          { id: 'c3', text: 'secret storyline trigger by Rockstar', startTime: 7.5, endTime: 11.5 },
          { id: 'c4', text: 'Watch what happens when you step closer', startTime: 12.0, endTime: 16.0 },
          { id: 'c5', text: 'Notice how the character immediately reacts', startTime: 16.5, endTime: 21.0 },
          { id: 'c6', text: 'Subscribe for more daily viral GTA 6 secrets', startTime: 21.5, endTime: 27.0 },
        ];

  const scoreColor =
    clip.aiScore >= 80
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : clip.aiScore >= 60
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden border border-zinc-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-full transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video player container */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center min-h-[460px] p-4 relative overflow-hidden group">
          <div
            onClick={togglePlay}
            className="relative max-h-[82vh] w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border border-white/10 cursor-pointer select-none bg-black"
          >
            {/* ── TEMPLATE 1: SPLIT STREAMER (Reference Photo 1) ─────────── */}
            {template === 'split_streamer' && (
              <div className="w-full h-full relative flex flex-col overflow-hidden">
                {/* Top ~38%: Streamer / Facecam reaction */}
                <div className="w-full h-[38%] relative overflow-hidden bg-zinc-900 border-b border-black/80">
                  <video
                    ref={streamerRef}
                    src={streamerVideoSrc}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                    Facecam
                  </div>
                </div>

                {/* Bottom ~62%: Gameplay / Action */}
                <div className="w-full h-[62%] relative overflow-hidden bg-zinc-950">
                  <video
                    ref={videoRef}
                    src={mainVideoSrc}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Seam Subtitle: Positioned directly across the boundary (Ref 1) */}
                <div className="absolute top-[38%] -translate-y-1/2 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
                  <CaptionOverlay
                    currentTime={currentTime}
                    captions={previewCaptions}
                    style="seam_bold"
                    fontSize={24}
                    position="middle"
                    visible={true}
                    className="static"
                  />
                </div>
              </div>
            )}

            {/* ── TEMPLATE 2: VIRAL RED HOOK + AMBIENT BLUR (Reference Photo 2) ── */}
            {template === 'viral_hook' && (
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                {/* Ambient Soft Blurred Layer (Top & Bottom) */}
                <video
                  src={mainVideoSrc}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70 pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                {/* Top Red Viral Hook Banner (Ref 2) */}
                <div className="absolute top-5 inset-x-3 z-30 flex justify-center pointer-events-none">
                  <div className="bg-[#e50914] px-4 py-2.5 rounded-2xl shadow-2xl border border-red-400/30 max-w-[90%] text-center transform hover:scale-105 transition-transform">
                    <h3 className="text-white font-black text-xs sm:text-sm tracking-tight leading-snug drop-shadow uppercase whitespace-pre-line">
                      {formatHookTitle(clip.title)}
                    </h3>
                  </div>
                </div>

                {/* Middle Center Video (Zoomed & Centered, Ref 2) */}
                <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                  <div
                    className="w-full aspect-video shadow-2xl rounded-2xl overflow-hidden bg-black border border-white/10 transition-transform duration-300 origin-center flex items-center justify-center"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <video
                      ref={videoRef}
                      src={mainVideoSrc}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Lower Third White Box Subtitle Badge (Ref 2) */}
                <div className="absolute bottom-12 inset-x-3 z-30 flex justify-center pointer-events-none">
                  <CaptionOverlay
                    currentTime={currentTime}
                    captions={previewCaptions}
                    style={selectedStyle === 'bold' ? 'white_box' : selectedStyle}
                    fontSize={18}
                    position="bottom"
                    visible={true}
                    className="static"
                  />
                </div>
              </div>
            )}

            {/* Interactive Play/Pause overlay flash when clicked */}
            {!isPlaying && (
              <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 shadow-2xl">
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
              </div>
            )}

            {/* Audio Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="absolute bottom-3 right-3 z-40 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Bottom Scrubber Line */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 pointer-events-none">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${Math.min(100, (currentTime / (clip.duration || 30)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metadata & Controls Sidebar */}
        <div className="w-full md:w-80 p-6 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-zinc-200 overflow-y-auto bg-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2 border border-blue-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              Casper Standalone 9:16 Short
            </div>
            <h2 className="text-lg font-bold text-zinc-950 mb-1 pr-6 leading-snug">{clip.title}</h2>
            {clip.projectName && <p className="text-xs text-zinc-500">{clip.projectName}</p>}
          </div>

          {/* Reference Template Selector */}
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-blue-600" />
                Reference Template
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">2 Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setTemplate('viral_hook');
                  setSelectedStyle('white_box');
                }}
                className={clsx(
                  'py-2.5 px-2 text-xs rounded-xl font-bold transition flex flex-col items-center justify-center gap-1 text-center',
                  template === 'viral_hook'
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                )}
              >
                <span className="text-[11px]">🔴 Red Hook (Ref 2)</span>
                <span className="text-[9px] opacity-80 font-normal">Banner + White Box</span>
              </button>
              <button
                onClick={() => {
                  setTemplate('split_streamer');
                  setSelectedStyle('seam_bold');
                }}
                className={clsx(
                  'py-2.5 px-2 text-xs rounded-xl font-bold transition flex flex-col items-center justify-center gap-1 text-center',
                  template === 'split_streamer'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                )}
              >
                <span className="text-[11px]">🎮 Split Screen (Ref 1)</span>
                <span className="text-[9px] opacity-80 font-normal">Facecam + Gameplay</span>
              </button>
            </div>
          </div>

          {/* Video Zoom Control (for Red Hook template) */}
          {template === 'viral_hook' && (
            <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-700">Video Framing Zoom</span>
                <span className="text-[10px] text-zinc-500 font-mono">{zoomLevel.toFixed(2)}x</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Fit (1.0x)', val: 1.0 },
                  { label: 'Zoomed (1.35x)', val: 1.35 },
                  { label: 'Focus (1.5x)', val: 1.5 },
                ].map((z) => (
                  <button
                    key={z.val}
                    onClick={() => setZoomLevel(z.val)}
                    className={clsx(
                      'py-1.5 px-2 text-xs rounded-xl font-semibold transition text-center',
                      zoomLevel === z.val
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                    )}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subtitle Style Switcher */}
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
            <span className="text-xs font-bold text-zinc-700 block mb-2">Subtitle Preset</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'white_box', label: 'White Box' },
                { key: 'seam_bold', label: 'Seam Bold' },
                { key: 'bold', label: 'Bold' },
                { key: 'highlight', label: 'Highlight' },
                { key: 'creator', label: 'Creator' },
                { key: 'minimal', label: 'Minimal' },
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setSelectedStyle(st.key as SubtitleStyle)}
                  className={clsx(
                    'py-1.5 px-1.5 text-xs rounded-xl font-semibold transition text-center truncate',
                    selectedStyle === st.key
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <MetaRow icon={Star} label="AI Score">
              <span className={clsx('font-bold text-xs px-2 py-0.5 rounded-full border', scoreColor)}>
                {clip.aiScore}/100
              </span>
            </MetaRow>
            <MetaRow icon={Clock} label="Duration">
              <span className="text-xs font-semibold text-zinc-800">{formatTime(clip.duration)}</span>
            </MetaRow>
            <MetaRow icon={Monitor} label="Format">
              <span className="text-xs font-semibold text-zinc-800">{clip.aspectRatio} Vertical</span>
            </MetaRow>
            <MetaRow icon={Captions} label="Subtitles">
              <span className="text-xs text-emerald-600 font-semibold">Dynamic Karaoke Active</span>
            </MetaRow>
            <MetaRow icon={Monitor} label="Platform">
              <span className="text-xs font-semibold text-zinc-800">{clip.platform}</span>
            </MetaRow>
          </div>

          <div className="text-xs text-zinc-400 mt-auto">
            Created {new Date(clip.createdAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link
              href={`/editor/${clip.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-sm transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit in Studio
            </Link>
            <button
              onClick={() => onDownload(clip.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export Short
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-zinc-500">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      {children}
    </div>
  );
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
