'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Eye,
  Edit2,
  Download,
  Trash2,
  Check,
  Star,
  Clock,
  Monitor,
  Captions,
  MoreHorizontal,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface ClipData {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  aiScore: number;
  aspectRatio: '9:16' | '1:1' | '16:9';
  platform: string;
  captionStatus: 'none' | 'pending' | 'done';
  createdAt: string;
  projectName?: string;
  captions?: Array<{ id: string; text: string; startTime: number; endTime: number }>;
  captionStyle?: 'minimal' | 'bold' | 'highlight' | 'creator' | 'professional';
}

interface ClipCardProps {
  clip: ClipData;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onSelect: (id: string) => void;
  onPreview: (clip: ClipData) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function ClipCard({
  clip,
  isSelected,
  isMultiSelectMode,
  onSelect,
  onPreview,
  onDelete,
  onDownload,
  onRename,
}: ClipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(clip.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && clip.videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleRenameSubmit = () => {
    onRename(clip.id, renameValue);
    setIsRenaming(false);
  };

  const scoreColor =
    clip.aiScore >= 80
      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
      : clip.aiScore >= 60
      ? 'bg-amber-50 text-amber-600 border-amber-200'
      : 'bg-rose-50 text-rose-600 border-rose-200';

  const captionColors = {
    none: 'text-zinc-400',
    pending: 'text-amber-500',
    done: 'text-emerald-600',
  };

  return (
    <div
      className={clsx(
        'group relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 shadow-sm',
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10'
          : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
      )}
    >
      {/* Thumbnail / Video hover area */}
      <div
        className="relative bg-zinc-900 cursor-pointer overflow-hidden"
        style={{ aspectRatio: clip.aspectRatio === '16:9' ? '16/9' : clip.aspectRatio === '1:1' ? '1/1' : '9/16' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => isMultiSelectMode ? onSelect(clip.id) : onPreview(clip)}
      >
        {/* Skeleton */}
        {!thumbnailLoaded && (
          <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
        )}

        {/* Thumbnail */}
        {clip.thumbnailUrl ? (
          <img
            src={clip.thumbnailUrl}
            alt={clip.title}
            className={clsx(
              'w-full h-full object-cover transition-opacity duration-300',
              thumbnailLoaded ? 'opacity-100' : 'opacity-0',
              isHovering ? 'opacity-0' : 'opacity-100'
            )}
            onLoad={() => setThumbnailLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-100 flex items-center justify-center">
            <Monitor className="w-10 h-10 text-zinc-400" />
          </div>
        )}

        {/* Hover video */}
        {clip.videoUrl && (
          <video
            ref={videoRef}
            src={clip.videoUrl}
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              if (video.textTracks) {
                for (let i = 0; i < video.textTracks.length; i++) {
                  video.textTracks[i].mode = 'disabled';
                }
              }
            }}
            className={clsx(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
              isHovering ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* AI Score badge */}
        <div
          className={clsx(
            'absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border',
            scoreColor
          )}
        >
          <Star className="w-3 h-3" />
          {clip.aiScore}
        </div>

        {/* Select checkbox */}
        <div
          className={clsx(
            'absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
            isMultiSelectMode || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            isSelected ? 'bg-blue-500 border-blue-500' : 'bg-black/50 border-white/60'
          )}
          onClick={(e) => { e.stopPropagation(); onSelect(clip.id); }}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white">
          <Clock className="w-3 h-3" />
          {formatTime(clip.duration)}
        </div>
      </div>

      {/* Card info */}
      <div className="p-3.5 space-y-2 bg-white">
        {/* Title */}
        {isRenaming ? (
          <form
            onSubmit={(e) => { e.preventDefault(); handleRenameSubmit(); }}
            className="flex gap-1"
          >
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="flex-1 bg-zinc-50 text-zinc-900 text-sm px-2.5 py-1 rounded-xl border border-blue-500 outline-none"
              onBlur={handleRenameSubmit}
            />
          </form>
        ) : (
          <p className="text-sm font-semibold text-zinc-950 truncate leading-snug">{clip.title}</p>
        )}

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-semibold border border-zinc-200">
            {clip.aspectRatio}
          </span>
          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-semibold border border-zinc-200">
            {clip.platform}
          </span>
          <span
            className={clsx(
              'flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border',
              clip.captionStatus === 'done'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : clip.captionStatus === 'pending'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
            )}
          >
            <Captions className="w-3 h-3" />
            {clip.captionStatus === 'done' ? 'CC' : clip.captionStatus === 'pending' ? 'Processing' : 'No CC'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => onPreview(clip)}
            title="Preview"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <Link
            href={`/editor/${clip.id}`}
            title="Edit in Studio"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold border border-blue-200/60 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onDownload(clip.id)}
            title="Download"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-32 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 py-1">
                <button
                  onClick={() => { setIsRenaming(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100"
                >
                  <Edit2 className="w-3 h-3" /> Rename
                </button>
                <button
                  onClick={() => { onDelete(clip.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
