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
      ? 'bg-green-500/20 text-green-400 border-green-500/40'
      : clip.aiScore >= 60
      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
      : 'bg-red-500/20 text-red-400 border-red-500/40';

  const captionColors = {
    none: 'text-gray-500',
    pending: 'text-yellow-400',
    done: 'text-green-400',
  };

  return (
    <div
      className={clsx(
        'group relative bg-gray-900 rounded-2xl overflow-hidden border transition-all duration-200',
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-900/20'
          : 'border-gray-800 hover:border-gray-600 hover:shadow-xl hover:shadow-black/30'
      )}
    >
      {/* Thumbnail / Video hover area */}
      <div
        className="relative bg-black cursor-pointer overflow-hidden"
        style={{ aspectRatio: clip.aspectRatio === '16:9' ? '16/9' : clip.aspectRatio === '1:1' ? '1/1' : '9/16' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => isMultiSelectMode ? onSelect(clip.id) : onPreview(clip)}
      >
        {/* Skeleton */}
        {!thumbnailLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
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
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <Monitor className="w-10 h-10 text-gray-600" />
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
      <div className="p-3 space-y-2">
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
              className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded-lg border border-blue-500 outline-none"
              onBlur={handleRenameSubmit}
            />
          </form>
        ) : (
          <p className="text-sm font-semibold text-white truncate">{clip.title}</p>
        )}

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px] font-medium">
            {clip.aspectRatio}
          </span>
          <span className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px] font-medium">
            {clip.platform}
          </span>
          <span
            className={clsx(
              'flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium',
              captionColors[clip.captionStatus]
            )}
          >
            <Captions className="w-3 h-3" />
            {clip.captionStatus === 'done' ? 'CC' : clip.captionStatus === 'pending' ? 'Processing' : 'No CC'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-0.5">
          <button
            onClick={() => onPreview(clip)}
            title="Preview"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <Link
            href={`/editor/${clip.id}`}
            title="Edit"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-800 hover:bg-blue-700 text-gray-300 hover:text-white text-xs transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onDownload(clip.id)}
            title="Download"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 py-1">
                <button
                  onClick={() => { setIsRenaming(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Edit2 className="w-3 h-3" /> Rename
                </button>
                <button
                  onClick={() => { onDelete(clip.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/40"
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
