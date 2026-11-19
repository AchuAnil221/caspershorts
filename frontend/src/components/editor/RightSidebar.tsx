'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Star, Clock, Monitor, Type } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import SubtitleStylePicker from './SubtitleStylePicker';
import ExportPanel from './ExportPanel';

export default function RightSidebar() {
  const { duration, startTrim, endTrim, aiScore, platform, aspectRatio, selectedStyle } = useEditorStore();

  const clipDuration = endTrim - startTrim;

  const scoreColor =
    aiScore === null
      ? 'text-zinc-400'
      : aiScore >= 80
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : aiScore >= 60
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <aside className="w-68 shrink-0 bg-white border-l border-zinc-200 flex flex-col h-full overflow-y-auto shadow-sm">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Clip Details</h3>
      </div>

      <div className="flex-1 p-4 space-y-5">
        {/* Clip stats */}
        <div className="space-y-2.5 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
          <InfoRow icon={Clock} label="Duration" value={formatTime(clipDuration)} />
          <InfoRow
            icon={Star}
            label="AI Score"
            value={
              aiScore !== null ? (
                <span className={clsx('font-bold text-xs px-2 py-0.5 rounded-full border', scoreColor)}>
                  {aiScore}/100
                </span>
              ) : (
                <span className="text-zinc-400">N/A</span>
              )
            }
          />
          <InfoRow icon={Monitor} label="Format" value={`${aspectRatio} Vertical`} />
          {platform && <InfoRow icon={Type} label="Platform" value={platform} />}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200" />

        {/* Subtitle style */}
        <div>
          <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">
            Subtitle Style
          </h4>
          <SubtitleStylePicker compact />
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200" />

        {/* Export */}
        <ExportPanel />
      </div>
    </aside>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-zinc-500 font-medium">
        <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span>{label}</span>
      </div>
      <div className="font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function formatTime(secs: number): string {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
