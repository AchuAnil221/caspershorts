'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useEditorStore, Caption } from '@/store/editorStore';

interface CaptionEditorProps {
  className?: string;
}

export default function CaptionEditor({ className }: CaptionEditorProps) {
  const { captions, selectedCaption, setSelectedCaption, updateCaption, deleteCaption, duration } =
    useEditorStore();

  const [localText, setLocalText] = useState('');
  const [localStart, setLocalStart] = useState('');
  const [localEnd, setLocalEnd] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const selected = captions.find((c) => c.id === selectedCaption);

  useEffect(() => {
    if (selected) {
      setLocalText(selected.text);
      setLocalStart(selected.startTime.toFixed(2));
      setLocalEnd(selected.endTime.toFixed(2));
      setIsDirty(false);
    } else {
      setLocalText('');
      setLocalStart('');
      setLocalEnd('');
      setIsDirty(false);
    }
  }, [selected]);

  const handleSave = () => {
    if (!selected) return;
    const start = parseFloat(localStart);
    const end = parseFloat(localEnd);
    if (isNaN(start) || isNaN(end) || start >= end) return;
    updateCaption(selected.id, {
      text: localText.trim(),
      startTime: Math.max(0, start),
      endTime: Math.min(duration, end),
    });
    setIsDirty(false);
  };

  const handleDelete = () => {
    if (selected) deleteCaption(selected.id);
  };

  const addNewCaption = () => {
    const id = `cap-${Date.now()}`;
    const lastCap = captions[captions.length - 1];
    const startTime = lastCap ? Math.min(duration - 1, lastCap.endTime + 0.2) : 0;
    const newCap: Caption = {
      id,
      text: 'New subtitle moment',
      startTime,
      endTime: Math.min(duration, startTime + 3.0),
    };
    useEditorStore.getState().setCaptions([...captions, newCap]);
    setSelectedCaption(id);
  };

  return (
    <div className={clsx('bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
        <h3 className="text-xs font-bold text-zinc-900">Transcript Blocks</h3>
        <button
          onClick={addNewCaption}
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Block
        </button>
      </div>

      {/* Caption list */}
      <div className="max-h-48 overflow-y-auto divide-y divide-zinc-100">
        {captions.length === 0 ? (
          <p className="p-4 text-xs text-zinc-400 text-center">No captions yet</p>
        ) : (
          captions.map((cap) => (
            <div
              key={cap.id}
              onClick={() => setSelectedCaption(cap.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 cursor-pointer transition text-xs',
                selectedCaption === cap.id
                  ? 'bg-blue-50/80 border-l-2 border-blue-600 text-blue-950 font-semibold'
                  : 'hover:bg-zinc-50 text-zinc-700'
              )}
            >
              <span className="text-zinc-400 w-12 shrink-0 font-mono text-[10px]">
                {formatTime(cap.startTime)}
              </span>
              <span className="truncate flex-1">{cap.text}</span>
            </div>
          ))
        )}
      </div>

      {/* Edit panel */}
      {selected && (
        <div className="p-3.5 border-t border-zinc-100 space-y-3 bg-zinc-50/40">
          <textarea
            value={localText}
            onChange={(e) => {
              setLocalText(e.target.value);
              setIsDirty(true);
            }}
            rows={2}
            className="w-full bg-white text-zinc-900 text-xs rounded-xl px-2.5 py-2 border border-zinc-200 focus:outline-none focus:border-blue-600 resize-none shadow-sm"
            placeholder="Edit subtitle text..."
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-500 mb-1 block">Start (s)</label>
              <input
                type="number"
                step="0.01"
                value={localStart}
                onChange={(e) => {
                  setLocalStart(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full bg-white text-zinc-900 text-xs rounded-lg px-2 py-1 border border-zinc-200 focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-500 mb-1 block">End (s)</label>
              <input
                type="number"
                step="0.01"
                value={localEnd}
                onChange={(e) => {
                  setLocalEnd(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full bg-white text-zinc-900 text-xs rounded-lg px-2 py-1 border border-zinc-200 focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm',
                isDirty
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              )}
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
