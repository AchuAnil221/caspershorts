'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Subtitles } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { clsx } from 'clsx';
import CaptionOverlay from '@/components/common/CaptionOverlay';

interface VideoPreviewProps {
  className?: string;
}

export default function VideoPreview({ className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const {
    clipTitle,
    videoUrl,
    youtubeId,
    aspectRatio,
    layoutMode,
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
            {/* Top & Bottom Ambient Blur Layer for 9:16 Vertical repurposing */}
            {aspectRatio === '9:16' && layoutMode === 'blur_padded' && (
              youtubeId ? (
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl scale-125 opacity-70 pointer-events-none"
                  style={{
                    backgroundImage: `url(https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg)`,
                  }}
                />
              ) : (
                <video
                  ref={bgVideoRef}
                  src={videoUrl || undefined}
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70 pointer-events-none"
                />
              )
            )}

            {/* Top Viral Hook Headline Badge */}
            {aspectRatio === '9:16' && (
              <div className="absolute top-4 inset-x-3 z-30 flex justify-center pointer-events-none">
                <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-xl max-w-[92%]">
                  <h4 className="text-white font-black text-xs sm:text-sm uppercase tracking-wide text-center leading-snug drop-shadow truncate">
                    {clipTitle || 'VIRAL 30-SEC HOOK'}
                  </h4>
                </div>
              </div>
            )}

            {/* Foreground Sharp Center Video (YouTube or Native) */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
              {youtubeId ? (
                <div className="w-full aspect-video max-h-[64%] shadow-2xl rounded-xl overflow-hidden bg-black border border-white/10">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&start=${Math.floor(
                      startTrim || 0
                    )}`}
                    className="w-full h-full border-0 rounded-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl || undefined}
                  className={clsx(
                    'w-full transition-all',
                    aspectRatio === '9:16' && layoutMode === 'blur_padded'
                      ? 'object-contain max-h-[60%] sm:max-h-[64%] shadow-2xl rounded-lg'
                      : 'h-full object-cover'
                  )}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                  playsInline
                />
              )}
            </div>

            {/* Bottom Spoken/Translated Subtitles Overlay */}
            <CaptionOverlay
              currentTime={currentTime}
              captions={captions}
              style={selectedStyle}
              fontSize={fontSize || 22}
              fontColor={fontColor || '#ffffff'}
              fontFamily={fontFamily}
              position={aspectRatio === '9:16' ? 'bottom' : 'middle'}
              visible={showCaptions}
              className="z-30 pointer-events-none"
            />
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
