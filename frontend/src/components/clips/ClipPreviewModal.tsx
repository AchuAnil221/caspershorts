'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Download, Edit2, Star, Clock, Monitor, Captions, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ClipData } from './ClipCard';
import CaptionOverlay from '@/components/common/CaptionOverlay';
import { SubtitleStyle } from '@/store/editorStore';

interface ClipPreviewModalProps {
  clip: ClipData | null;
  onClose: () => void;
  onDownload: (id: string) => void;
}

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
  if (clip.videoUrl && clip.videoUrl.includes("youtube.com")) {
    const match = clip.videoUrl.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default function ClipPreviewModal({ clip, onClose, onDownload }: ClipPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<SubtitleStyle>('bold');

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

  // Suppress any original YouTube/video text tracks
  const disableNativeSubtitleTracks = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.textTracks) return;
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'disabled';
    }
  }, []);

  useEffect(() => {
    disableNativeSubtitleTracks();
  }, [clip?.videoUrl, disableNativeSubtitleTracks]);

  if (!clip) return null;

  // Fallback captions if clip doesn't have custom ones
  const previewCaptions = clip.captions && clip.captions.length > 0 ? clip.captions : [
    { id: 'c1', text: 'Turn your long YouTube video into viral shorts', startTime: 0, endTime: 3.5 },
    { id: 'c2', text: 'AI automatically finds the most engaging hook', startTime: 3.6, endTime: 7.2 },
    { id: 'c3', text: 'Keeps the active speaker centered in vertical 9:16', startTime: 7.5, endTime: 11.5 },
    { id: 'c4', text: 'With dynamic animated karaoke subtitles', startTime: 12.0, endTime: 16.0 },
  ];

  const scoreColor =
    clip.aiScore >= 80
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : clip.aiScore >= 60
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden border border-zinc-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video player container */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center min-h-[420px] relative overflow-hidden group">
          {clip.videoUrl || getYouTubeIdFromClip(clip) ? (
            <div
              className="relative max-h-[78vh] w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/10"
            >
              {/* Top & Bottom Ambient Blur Layer */}
              {getYouTubeIdFromClip(clip) ? (
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl scale-125 opacity-70 pointer-events-none"
                  style={{
                    backgroundImage: `url(${
                      clip.thumbnailUrl ||
                      `https://img.youtube.com/vi/${getYouTubeIdFromClip(clip)}/hqdefault.jpg`
                    })`,
                  }}
                />
              ) : (
                <video
                  src={clip.videoUrl}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70 pointer-events-none"
                />
              )}

              {/* Top Viral Hook Headline Badge */}
              <div className="absolute top-4 inset-x-3 z-30 flex justify-center pointer-events-none">
                <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-xl max-w-[92%]">
                  <h4 className="text-white font-black text-xs uppercase tracking-wide text-center leading-snug drop-shadow truncate">
                    {clip.title.replace(/^\[Part \d+\]\s*/, '') || 'VIRAL 30-SEC HOOK'}
                  </h4>
                </div>
              </div>

              {/* Foreground Centered Video (YouTube or Native) */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                {getYouTubeIdFromClip(clip) ? (
                  <div className="w-full aspect-video max-h-[64%] shadow-2xl rounded-xl overflow-hidden bg-black border border-white/10">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${getYouTubeIdFromClip(
                        clip
                      )}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                      className="w-full h-full border-0 rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={clip.videoUrl}
                    controls
                    autoPlay
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => {
                      disableNativeSubtitleTracks();
                      setCurrentTime(0);
                    }}
                    className="w-full object-contain max-h-[64%] shadow-2xl rounded-lg"
                  />
                )}
              </div>

              {/* Dynamic Bottom Subtitle Overlay */}
              <CaptionOverlay
                currentTime={currentTime}
                captions={previewCaptions}
                style={selectedStyle}
                fontSize={20}
                fontColor="#ffffff"
                position="bottom"
                visible={true}
                className="z-30 pointer-events-none"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-zinc-400 p-12">
              <Monitor className="w-16 h-16" />
              <p>No video available</p>
            </div>
          )}
        </div>

        {/* Metadata sidebar */}
        <div className="w-full md:w-80 p-6 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-zinc-200 overflow-y-auto bg-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2 border border-blue-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              Casper AI Subtitles Active
            </div>
            <h2 className="text-lg font-bold text-zinc-950 mb-1 pr-6 leading-snug">{clip.title}</h2>
            {clip.projectName && <p className="text-xs text-zinc-500">{clip.projectName}</p>}
          </div>

          {/* Subtitle Style Switcher */}
          <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
            <span className="text-xs font-bold text-zinc-700 block mb-2">Subtitle Preset</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['bold', 'highlight', 'creator', 'minimal', 'professional'] as SubtitleStyle[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  className={clsx(
                    'py-1.5 px-2 text-xs rounded-xl font-semibold capitalize transition text-center',
                    selectedStyle === st
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                  )}
                >
                  {st}
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
              <span className="text-xs text-emerald-600 font-semibold">Dynamic AI Captions</span>
            </MetaRow>
            <MetaRow icon={Monitor} label="Platform">
              <span className="text-xs font-semibold text-zinc-800">{clip.platform}</span>
            </MetaRow>
          </div>

          <div className="text-xs text-zinc-400 mt-auto">
            Created {new Date(clip.createdAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => onDownload(clip.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              Download 1080p MP4
            </button>
            <Link
              href={`/editor/${clip.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition border border-zinc-200"
            >
              <Edit2 className="w-4 h-4" />
              Open in Timeline Editor
            </Link>
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
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}
