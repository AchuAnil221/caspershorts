'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Subtitles } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { clsx } from 'clsx';
import CaptionOverlay from '@/components/common/CaptionOverlay';

interface VideoPreviewProps {
  className?: string;
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

export default function VideoPreview({ className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const streamerRef = useRef<HTMLVideoElement>(null);

  const {
    clipTitle,
    videoUrl,
    youtubeId,
    aspectRatio,
    layoutMode,
    template,
    setTemplate,
    isPlaying,
    currentTime,
    startTrim,
    endTrim,
    captions,
    selectedStyle,
    fontSize,
    fontColor,
    fontFamily,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  } = useEditorStore();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showCaptions, setShowCaptions] = useState(true);

  // Suppress any native YouTube / video embedded subtitles
  const disableNativeSubtitleTracks = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.textTracks) return;
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'disabled';
    }
  }, []);

  useEffect(() => {
    disableNativeSubtitleTracks();
  }, [videoUrl, disableNativeSubtitleTracks]);

  // Sync play/pause between main and background video
  useEffect(() => {
    const video = videoRef.current;
    const bgVideo = bgVideoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
      if (bgVideo) bgVideo.play().catch(() => {});
    } else {
      video.pause();
      if (bgVideo) bgVideo.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Handle time update — enforce trim bounds and sync background video
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    setCurrentTime(t);

    if (bgVideoRef.current && Math.abs(bgVideoRef.current.currentTime - t) > 0.3) {
      bgVideoRef.current.currentTime = t;
    }

    if (t >= endTrim && endTrim > 0) {
      video.pause();
      if (bgVideoRef.current) bgVideoRef.current.pause();
      setIsPlaying(false);
      video.currentTime = startTrim;
      if (bgVideoRef.current) bgVideoRef.current.currentTime = startTrim;
    }
  }, [endTrim, startTrim, setCurrentTime, setIsPlaying]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    disableNativeSubtitleTracks();
    setDuration(video.duration);
    video.currentTime = startTrim;
    if (bgVideoRef.current) bgVideoRef.current.currentTime = startTrim;
  };

  const togglePlay = () => {
    if (!isPlaying && videoRef.current) {
      if (videoRef.current.currentTime >= endTrim) {
        videoRef.current.currentTime = startTrim;
        if (bgVideoRef.current) bgVideoRef.current.currentTime = startTrim;
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen();
  };

  const aspectClass = {
    '9:16': 'aspect-[9/16] max-h-[540px] max-w-[304px]',
    '1:1': 'aspect-square max-h-[420px] max-w-[420px]',
    '16:9': 'aspect-video max-h-[290px] max-w-[516px]',
  }[aspectRatio];

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      {/* Video container */}
      <div
        className={clsx(
          'relative bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl w-full select-none group border border-zinc-200/80',
          aspectClass
        )}
      >
        {videoUrl || youtubeId ? (
          <>
            {/* ── TEMPLATE 1: SPLIT STREAMER (Ref Photo 1) ── */}
            {aspectRatio === '9:16' && template === 'split_streamer' ? (
              <div className="w-full h-full relative flex flex-col overflow-hidden">
                {/* Top 38%: Streamer Facecam */}
                <div className="w-full h-[38%] relative overflow-hidden bg-zinc-900 border-b border-black">
                  <video
                    ref={streamerRef}
                    src="/videos/streamer.mp4"
                    autoPlay
                    loop
                    muted={isMuted}
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
                    ref={videoRef}
                    src={
                      videoUrl && !videoUrl.includes('commondatastorage.googleapis.com') && !videoUrl.includes('youtube.com')
                        ? videoUrl
                        : '/videos/gameplay.mp4'
                    }
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Seam Subtitle across boundary */}
                <div className="absolute top-[38%] -translate-y-1/2 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
                  <CaptionOverlay
                    currentTime={currentTime}
                    captions={captions}
                    style="seam_bold"
                    fontSize={22}
                    position="middle"
                    visible={showCaptions}
                    className="static"
                  />
                </div>
              </div>
            ) : (
              /* ── TEMPLATE 2: VIRAL RED HOOK + AMBIENT BLUR (Ref Photo 2) ── */
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                {/* Top & Bottom Ambient Blur Layer */}
                {aspectRatio === '9:16' && (
                  <video
                    ref={bgVideoRef}
                    src={
                      videoUrl && !videoUrl.includes('commondatastorage.googleapis.com') && !videoUrl.includes('youtube.com')
                        ? videoUrl
                        : '/videos/gameplay.mp4'
                    }
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70 pointer-events-none"
                  />
                )}

                {/* Top Red Viral Hook Headline Badge (Ref 2) */}
                {aspectRatio === '9:16' && (
                  <div className="absolute top-4 inset-x-3 z-30 flex justify-center pointer-events-none">
                    <div className="bg-[#e50914] px-4 py-2 rounded-2xl shadow-2xl border border-red-400/30 max-w-[90%] text-center">
                      <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-tight leading-snug drop-shadow whitespace-pre-line">
                        {formatHookTitle(clipTitle)}
                      </h4>
                    </div>
                  </div>
                )}

                {/* Center Scaled Video */}
                <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                  <div
                    className={clsx(
                      'transition-transform duration-300 origin-center flex items-center justify-center',
                      aspectRatio === '9:16'
                        ? 'w-full aspect-video shadow-2xl rounded-2xl overflow-hidden bg-black border border-white/10 scale-[1.35]'
                        : 'w-full h-full'
                    )}
                  >
                    <video
                      ref={videoRef}
                      src={
                        videoUrl && !videoUrl.includes('commondatastorage.googleapis.com') && !videoUrl.includes('youtube.com')
                          ? videoUrl
                          : '/videos/gameplay.mp4'
                      }
                      className="w-full h-full object-cover"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                      muted={isMuted}
                      playsInline
                    />
                  </div>
                </div>

                {/* Lower Third White Box Subtitle Badge (Ref 2) */}
                <div className="absolute bottom-12 inset-x-3 z-30 flex justify-center pointer-events-none">
                  <CaptionOverlay
                    currentTime={currentTime}
                    captions={captions}
                    style={selectedStyle === 'bold' ? 'white_box' : selectedStyle}
                    fontSize={fontSize || 18}
                    fontColor={fontColor || '#000000'}
                    fontFamily={fontFamily}
                    position="bottom"
                    visible={showCaptions}
                    className="static"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Play className="w-8 h-8 text-zinc-400 ml-1" />
              </div>
              <p className="text-xs font-semibold text-zinc-500">No video loaded</p>
            </div>
          </div>
        )}

        {/* Overlay controls */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition shadow-sm"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 text-white/80 hover:text-white transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              className="w-14 h-1 accent-blue-500 cursor-pointer"
            />

            {/* Subtitles Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={clsx(
                'p-1.5 rounded-lg transition flex items-center gap-1 text-[11px] font-bold px-2 shadow-sm',
                showCaptions
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/60 hover:text-white'
              )}
              title="Toggle Dynamic Subtitles"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span>CC</span>
            </button>

            <span className="text-[11px] text-white/80 ml-auto font-mono font-medium">
              {formatTime(currentTime)} / {formatTime(endTrim)}
            </span>

            <button
              onClick={handleFullscreen}
              className="p-1.5 text-white/80 hover:text-white transition"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
