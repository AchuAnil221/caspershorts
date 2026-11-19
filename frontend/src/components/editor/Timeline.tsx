'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { clsx } from 'clsx';

interface TimelineProps {
  className?: string;
}

export default function Timeline({ className }: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'start' | 'end' | 'playhead' | null>(null);

  const {
    duration,
    startTrim,
    endTrim,
    currentTime,
    setStartTrim,
    setEndTrim,
    setCurrentTime,
  } = useEditorStore();

  const getPositionFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent): number => {
      const track = trackRef.current;
      if (!track || duration === 0) return 0;
      const rect = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      return (x / rect.width) * duration;
    },
    [duration]
  );

  const handleMouseDown = (e: React.MouseEvent, handle: 'start' | 'end' | 'playhead') => {
    e.preventDefault();
    dragging.current = handle;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const time = getPositionFromEvent(e);
      if (dragging.current === 'start') {
        setStartTrim(Math.min(time, endTrim - 0.5));
      } else if (dragging.current === 'end') {
        setEndTrim(Math.max(time, startTrim + 0.5));
      } else if (dragging.current === 'playhead') {
        setCurrentTime(Math.max(startTrim, Math.min(time, endTrim)));
      }
    };
    const handleMouseUp = () => {
      dragging.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [getPositionFromEvent, startTrim, endTrim, setStartTrim, setEndTrim, setCurrentTime]);

  const pct = (t: number) => (duration > 0 ? `${(t / duration) * 100}%` : '0%');

  const handleTrackClick = (e: React.MouseEvent) => {
    if (dragging.current) return;
    const time = getPositionFromEvent(e as unknown as MouseEvent);
    setCurrentTime(Math.max(startTrim, Math.min(time, endTrim)));
  };

  return (
    <div className={clsx('select-none', className)}>
      {/* Time indicators */}
      <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1 px-1">
        <span>{formatTime(0)}</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-10 bg-zinc-100 border border-zinc-200 rounded-xl cursor-pointer overflow-visible shadow-inner"
        onClick={handleTrackClick}
      >
        {/* Trimmed-out region (left) */}
        <div
          className="absolute top-0 left-0 h-full bg-zinc-200/60 rounded-l-xl"
          style={{ width: pct(startTrim) }}
        />

        {/* Active region */}
        <div
          className="absolute top-0 h-full bg-blue-50 border-y-2 border-blue-500 shadow-sm"
          style={{ left: pct(startTrim), width: pct(endTrim - startTrim) }}
        />

        {/* Trimmed-out region (right) */}
        <div
          className="absolute top-0 right-0 h-full bg-zinc-200/60 rounded-r-xl"
          style={{ width: pct(duration - endTrim) }}
        />

        {/* Waveform decoration */}
        <div
          className="absolute inset-0 flex items-center gap-0.5 px-1.5 pointer-events-none opacity-60"
          style={{ left: pct(startTrim), width: pct(endTrim - startTrim) }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-500 rounded-full"
              style={{ height: `${12 + Math.sin(i * 0.8) * 8 + (i % 3) * 4}px` }}
            />
          ))}
        </div>

        {/* Start trim handle */}
        <div
          className="absolute top-0 bottom-0 w-3.5 bg-blue-600 rounded-l-lg cursor-ew-resize flex items-center justify-center hover:bg-blue-700 transition z-10 shadow-md"
          style={{ left: pct(startTrim), transform: 'translateX(-50%)' }}
          onMouseDown={(e) => handleMouseDown(e, 'start')}
        >
          <div className="w-0.5 h-4 bg-white rounded" />
        </div>

        {/* End trim handle */}
        <div
          className="absolute top-0 bottom-0 w-3.5 bg-blue-600 rounded-r-lg cursor-ew-resize flex items-center justify-center hover:bg-blue-700 transition z-10 shadow-md"
          style={{ left: pct(endTrim), transform: 'translateX(-50%)' }}
          onMouseDown={(e) => handleMouseDown(e, 'end')}
        >
          <div className="w-0.5 h-4 bg-white rounded" />
        </div>

        {/* Playhead */}
        {duration > 0 && (
          <div
            className="absolute top-0 bottom-0 z-20 cursor-ew-resize"
            style={{ left: pct(currentTime), transform: 'translateX(-50%)' }}
            onMouseDown={(e) => handleMouseDown(e, 'playhead')}
          >
            <div className="w-0.5 h-full bg-zinc-900 relative">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-zinc-900 rounded-full shadow-md" />
            </div>
          </div>
        )}
      </div>

      {/* Trim time labels */}
      <div className="flex justify-between text-[11px] font-semibold text-zinc-500 mt-1 px-1">
        <span className="text-blue-600 font-bold">In: {formatTime(startTrim)}</span>
        <span className="text-zinc-800 font-mono font-bold">{formatTime(currentTime)}</span>
        <span className="text-blue-600 font-bold">Out: {formatTime(endTrim)}</span>
      </div>
    </div>
  );
}

function formatTime(secs: number): string {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
