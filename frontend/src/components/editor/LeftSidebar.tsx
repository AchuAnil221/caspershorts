'use client';

import React, { useState } from 'react';
import {
  Settings,
  Type,
  Layout,
  Palette,
  Subtitles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useEditorStore, CropMode } from '@/store/editorStore';
import AspectRatioSelector from './AspectRatioSelector';
import SubtitleStylePicker from './SubtitleStylePicker';
import CaptionEditor from './CaptionEditor';

type Tab = 'settings' | 'captions' | 'layout' | 'branding';

interface TabItem {
  id: Tab;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'captions', label: 'Styles', icon: Subtitles },
  { id: 'layout', label: 'Captions', icon: Type },
  { id: 'branding', label: 'Brand', icon: Palette },
];

const CROP_MODES: { value: CropMode; label: string }[] = [
  { value: 'smart', label: 'AI Smart' },
  { value: 'center', label: 'Center' },
  { value: 'manual', label: 'Manual' },
];

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const { cropMode, setCropMode, fontFamily, fontSize, fontColor, setFontFamily, setFontSize, setFontColor } =
    useEditorStore();

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-zinc-200 flex flex-col h-full shadow-sm">
      {/* Tab nav */}
      <div className="flex border-b border-zinc-200 bg-zinc-50/50">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={clsx(
                'flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors',
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <Section title="Aspect Ratio">
              <AspectRatioSelector />
            </Section>

            <Section title="Framing & Crop Mode">
              <div className="flex gap-1.5">
                {CROP_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setCropMode(mode.value)}
                    className={clsx(
                      'flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                      cropMode === mode.value
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === 'captions' && (
          <div className="space-y-4">
            <Section title="Subtitle Presets">
              <SubtitleStylePicker compact />
            </Section>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <Section title="Timed Transcript Blocks">
              <CaptionEditor />
            </Section>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="space-y-5">
            <Section title="Font Family">
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-white text-zinc-900 text-xs font-semibold rounded-xl px-3 py-2 border border-zinc-200 focus:outline-none focus:border-blue-600 shadow-sm"
              >
                {['Inter', 'Arial', 'Montserrat', 'Helvetica', 'Roboto', 'Poppins', 'Impact'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </Section>

            <Section title="Font Size">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={16}
                  max={64}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-xs font-bold text-zinc-700 w-9 text-right font-mono">{fontSize}px</span>
              </div>
            </Section>

            <Section title="Font Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-zinc-200 cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs text-zinc-600 font-mono font-bold uppercase">{fontColor}</span>
              </div>
            </Section>
          </div>
        )}
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{title}</h4>
      {children}
    </div>
  );
}
