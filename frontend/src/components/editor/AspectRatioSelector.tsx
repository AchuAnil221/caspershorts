'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useEditorStore, AspectRatio } from '@/store/editorStore';

const RATIOS: { label: string; value: AspectRatio; icon: string }[] = [
  { label: '9:16', value: '9:16', icon: '▮' },
  { label: '1:1', value: '1:1', icon: '▪' },
  { label: '16:9', value: '16:9', icon: '▬' },
];

export default function AspectRatioSelector() {
  const { aspectRatio, setAspectRatio } = useEditorStore();

  return (
    <div className="flex gap-2">
      {RATIOS.map((r) => (
        <button
          key={r.value}
          onClick={() => setAspectRatio(r.value)}
          className={clsx(
            'flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all',
            aspectRatio === r.value
              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
          )}
        >
          <span className="text-base">{r.icon}</span>
          <span>{r.label}</span>
        </button>
      ))}
    </div>
  );
}
