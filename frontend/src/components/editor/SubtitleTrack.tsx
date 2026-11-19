'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useEditorStore, Caption } from '@/store/editorStore';
import { clsx } from 'clsx';

interface SubtitleTrackProps {
  className?: string;
}

export default function SubtitleTrack({ className }: SubtitleTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; edge: 'start' | 'end' | 'move'; startX: number; initTime: number } | null>(
    null
  );

  const { captions, duration, selectedCaption, setSelectedCaption, updateCaption } = useEditorStore();

  const getPositionFromEvent = useCallback(
    (e: MouseEvent): number => {
      const track = trackRef.current;
      if (!track || duration === 0) return 0;
      const rect = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      return (x / rect.width) * duration;
    },
    [duration]
  );

  const handleBlockMouseDown = (
    e: React.MouseEvent,
    caption: Caption,
    edge: 'start' | 'end' | 'move'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedCaption(caption.id);
    dragging.current = {
      id: caption.id,
      edge,
      startX: e.clientX,
      initTime: edge === 'start' ? caption.startTime : caption.endTime,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const { id, edge, startX, initTime } = dragging.current;
      const track = trackRef.current;
      if (!track || duration === 0) return;

      const rect = track.getBoundingClientRect();
      const dt = ((e.clientX - startX) / rect.width) * duration;

      const caption = captions.find((c) => c.id === id);
      if (!caption) return;

      if (edge === 'start') {
        updateCaption(id, { startTime: Math.max(0, Math.min(initTime + dt, caption.endTime - 0.1)) });
      } else if (edge === 'end') {
        updateCaption(id, { endTime: Math.min(duration, Math.max(initTime + dt, caption.startTime + 0.1)) });
      } else if (edge === 'move') {
        const dur = caption.endTime - caption.startTime;
        const newStart = Math.max(0, Math.min(caption.startTime + dt, duration - dur));
        updateCaption(id, { startTime: newStart, endTime: newStart + dur });
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
  }, [captions, duration, updateCaption]);

  const pct = (t: number) => `${(t / Math.max(duration, 1)) * 100}%`;

  if (captions.length === 0) {
    return (
      <div className={clsx('h-10 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center', className)}>
        <span className="text-xs text-zinc-400">No captions — generate or add captions to begin editing</span>
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className={clsx('relative h-10 bg-zinc-100 border border-zinc-200 rounded-xl select-none overflow-hidden shadow-inner', className)}
    >
      {captions.map((caption) => {
        const left = pct(caption.startTime);
        const width = pct(caption.endTime - caption.startTime);
        const isSelected = selectedCaption === caption.id;

        return (
          <div
            key={caption.id}
            className={clsx(
              'absolute top-1 bottom-1 rounded-lg flex items-center px-2 text-[11px] font-semibold cursor-move transition-colors overflow-hidden border',
              isSelected
                ? 'bg-blue-600 text-white z-10 border-blue-700 shadow-md ring-2 ring-blue-300'
                : 'bg-white text-zinc-800 border-zinc-300 hover:border-blue-400 hover:bg-blue-50/60 shadow-sm'
            )}
            style={{ left, width }}
            onMouseDown={(e) => handleBlockMouseDown(e, caption, 'move')}
          >
            {/* Left resize */}
            <div
              className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/10"
              onMouseDown={(e) => handleBlockMouseDown(e, caption, 'start')}
            />

            <span className="truncate pointer-events-none flex-1 text-center font-medium">{caption.text}</span>

            {/* Right resize */}
            <div
              className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/10"
              onMouseDown={(e) => handleBlockMouseDown(e, caption, 'end')}
            />
          </div>
        );
      })}
    </div>
  );
}
