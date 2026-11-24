'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useEditorStore, SubtitleStyle } from '@/store/editorStore';
import { Check } from 'lucide-react';

interface StylePreset {
  id: SubtitleStyle;
  label: string;
  description: string;
  preview: {
    bg: string;
    text: string;
    font: string;
    border?: string;
  };
}

const PRESETS: StylePreset[] = [
  {
    id: 'white_box',
    label: 'White Box Badge',
    description: 'Crisp white pill box with black text (Ref 2)',
    preview: { bg: 'bg-white text-zinc-950 font-black', text: 'text-zinc-950', font: 'font-black' },
  },
  {
    id: 'seam_bold',
    label: 'Seam Bold Outline',
    description: 'Pure white with thick black outline (Ref 1)',
    preview: { bg: 'bg-transparent text-white font-black', text: 'text-white', font: 'font-black' },
  },
  {
    id: 'bold',
    label: 'Bold & Punchy',
    description: 'High-contrast yellow with black outline',
    preview: { bg: 'bg-transparent', text: 'text-yellow-400', font: 'font-black' },
  },
  {
    id: 'highlight',
    label: 'Karaoke Badge',
    description: 'Dynamic yellow active-word badge',
    preview: { bg: 'bg-yellow-400 text-black', text: 'text-black', font: 'font-black' },
  },
  {
    id: 'creator',
    label: 'Creator Italic',
    description: 'Dynamic slanted font with electric cyan punch',
    preview: { bg: 'bg-transparent', text: 'text-cyan-500', font: 'font-black italic' },
  },
  {
    id: 'minimal',
    label: 'Minimal Clean',
    description: 'Clean typography on subtle glass pill',
    preview: { bg: 'bg-zinc-800 text-white', text: 'text-white', font: 'font-medium' },
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Lower-third dark banner with crisp text',
    preview: { bg: 'bg-zinc-900 text-white', text: 'text-white', font: 'font-semibold' },
  },
];

interface SubtitleStylePickerProps {
  compact?: boolean;
}

export default function SubtitleStylePicker({ compact = false }: SubtitleStylePickerProps) {
  const { selectedStyle, setSelectedStyle } = useEditorStore();

  return (
    <div className={clsx('grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-1')}>
      {PRESETS.map((preset) => {
        const isSelected = selectedStyle === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => setSelectedStyle(preset.id)}
            className={clsx(
              'group flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all',
              isSelected
                ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
            )}
          >
            {/* Mini preview */}
            <div className="w-20 h-9 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              <span
                className={clsx(
                  'px-1.5 py-0.5 rounded text-[10px] leading-tight',
                  preset.preview.bg,
                  preset.preview.text,
                  preset.preview.font,
                  preset.preview.border
                )}
              >
                Sample
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={clsx(
                  'text-xs font-bold leading-tight',
                  isSelected ? 'text-blue-950' : 'text-zinc-900'
                )}
              >
                {preset.label}
              </p>
              <p className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5">
                {preset.description}
              </p>
            </div>

            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
