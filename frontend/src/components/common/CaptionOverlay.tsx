'use client';

import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { SubtitleStyle, Caption } from '@/store/editorStore';

interface CaptionOverlayProps {
  currentTime: number;
  captions?: Caption[];
  style?: SubtitleStyle;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  position?: 'top' | 'middle' | 'bottom';
  visible?: boolean;
  className?: string;
}

export default function CaptionOverlay({
  currentTime,
  captions = [],
  style = 'bold',
  fontSize = 24,
  fontColor = '#ffffff',
  fontFamily = 'Inter, sans-serif',
  position = 'middle',
  visible = true,
  className,
}: CaptionOverlayProps) {
  if (!visible || !captions || captions.length === 0) {
    return null;
  }

  // Find currently active caption
  const activeCaption = useMemo(() => {
    return captions.find(
      (cap) => currentTime >= cap.startTime && currentTime <= cap.endTime
    );
  }, [captions, currentTime]);

  if (!activeCaption) {
    return null;
  }

  // Calculate active word index
  const words = useMemo(() => {
    if (activeCaption.words && activeCaption.words.length > 0) {
      return activeCaption.words.map((w) => w.word);
    }
    return activeCaption.text.trim().split(/\s+/);
  }, [activeCaption]);

  const activeWordIndex = useMemo(() => {
    if (words.length === 0) return 0;
    if (activeCaption.words && activeCaption.words.length > 0) {
      const idx = activeCaption.words.findIndex(
        (w) => currentTime >= w.start && currentTime <= w.end
      );
      if (idx !== -1) return idx;
    }
    // Interpolate progress through caption duration
    const dur = Math.max(0.1, activeCaption.endTime - activeCaption.startTime);
    const progress = Math.min(1, Math.max(0, (currentTime - activeCaption.startTime) / dur));
    return Math.min(words.length - 1, Math.floor(progress * words.length));
  }, [activeCaption, currentTime, words]);

  // Position classes
  const positionClass = {
    top: 'top-14',
    middle: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-16',
  }[position];

  return (
    <div
      className={clsx(
        'absolute left-0 right-0 z-30 pointer-events-none flex justify-center px-4 transition-all duration-150',
        positionClass,
        className
      )}
      style={{ fontFamily }}
    >
      {style === 'bold' && (
        <div
          className="text-center font-black uppercase tracking-wider leading-tight select-none transform scale-100 transition-transform"
          style={{
            fontSize: `${fontSize}px`,
            color: fontColor,
            textShadow:
              '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 4px 12px rgba(0,0,0,0.85)',
          }}
        >
          {words.map((word, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <span
                key={idx}
                className={clsx(
                  'inline-block mx-1 transition-all duration-100',
                  isActive
                    ? 'text-yellow-400 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                    : 'text-white'
                )}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {style === 'highlight' && (
        <div
          className="text-center font-extrabold uppercase tracking-wide leading-tight select-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          {words.map((word, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <span
                key={idx}
                className={clsx(
                  'inline-block mx-1 my-0.5 px-1.5 py-0.5 rounded transition-all duration-100',
                  isActive
                    ? 'bg-yellow-400 text-black font-black shadow-lg scale-110 rotate-[-1deg]'
                    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                )}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {style === 'creator' && (
        <div
          className="text-center font-black italic tracking-tight leading-tight select-none"
          style={{
            fontSize: `${fontSize}px`,
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}
        >
          {words.map((word, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <span
                key={idx}
                className={clsx(
                  'inline-block mx-1 transition-all duration-150',
                  isActive
                    ? 'text-cyan-400 font-extrabold scale-115 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                    : 'text-white'
                )}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {style === 'minimal' && (
        <div
          className="inline-flex flex-wrap justify-center items-center bg-black/65 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl text-center select-none max-w-[90%]"
          style={{ fontSize: `${Math.max(14, fontSize * 0.8)}px`, color: fontColor }}
        >
          {words.map((word, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <span
                key={idx}
                className={clsx(
                  'inline-block mx-1 transition-colors duration-100',
                  isActive ? 'text-blue-400 font-bold' : 'text-white/90'
                )}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {style === 'white_box' && (
        <div
          className="inline-flex flex-wrap justify-center items-center bg-white text-zinc-950 font-black px-4 py-2 rounded-xl shadow-2xl border border-black/10 text-center select-none max-w-[92%]"
          style={{ fontSize: `${Math.max(14, fontSize * 0.85)}px` }}
        >
          {words.map((word, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <span
                key={idx}
                className={clsx(
                  'inline-block mx-1 transition-colors duration-100',
                  isActive ? 'text-black font-black scale-105' : 'text-zinc-600 font-bold'
                )}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {style === 'seam_bold' && (
        <div
          className="text-center font-black uppercase tracking-wider leading-none select-none"
          style={{
            fontSize: `${Math.max(20, fontSize * 1.05)}px`,
            color: '#ffffff',
            textShadow:
              '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 4px 8px rgba(0,0,0,0.9)',
          }}
        >
          {words.map((word, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <span
                key={idx}
                className={clsx(
                  'inline-block mx-1 transition-all duration-100',
                  isActive
                    ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                    : 'text-white'
                )}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {style === 'professional' && (
        <div
          className="w-full bg-gradient-to-r from-black/80 via-black/90 to-black/80 py-2.5 px-4 text-center select-none border-y border-white/10 shadow-xl"
          style={{
            fontSize: `${Math.max(15, fontSize * 0.82)}px`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <span className="font-semibold text-white tracking-normal">
            {words.map((word, idx) => {
              const isActive = idx === activeWordIndex;
              return (
                <span
                  key={idx}
                  className={clsx(
                    'inline-block mx-1 transition-colors',
                    isActive ? 'text-yellow-300 font-bold underline decoration-yellow-400 underline-offset-4' : 'text-gray-100'
                  )}
                >
                  {word}
                </span>
              );
            })}
          </span>
        </div>
      )}
    </div>
  );
}

