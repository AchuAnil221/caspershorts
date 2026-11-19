import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AspectRatio = '9:16' | '1:1' | '16:9';
export type SubtitleStyle = 'minimal' | 'bold' | 'highlight' | 'creator' | 'professional';
export type CropMode = 'smart' | 'center' | 'manual';
export type LayoutMode = 'blur_padded' | 'smart_crop';
export type ExportQuality = '720p' | '1080p';

export interface Caption {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words?: { word: string; start: number; end: number }[];
}

export interface EditorState {
  clipId: string | null;
  clipTitle: string;
  videoUrl: string | null;
  youtubeId: string | null;
  thumbnailUrl: string | null;
  currentTime: number;
  duration: number;
  startTrim: number;
  endTrim: number;
  isPlaying: boolean;
  selectedStyle: SubtitleStyle;
  aspectRatio: AspectRatio;
  cropMode: CropMode;
  layoutMode: LayoutMode;
  captions: Caption[];
  selectedCaption: string | null;
  exportQuality: ExportQuality;
  isExporting: boolean;
  exportProgress: number;
  isSaving: boolean;
  aiScore: number | null;
  platform: string | null;
  // Font customization
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  // Actions
  setClipId: (id: string) => void;
  setClipTitle: (title: string) => void;
  setVideoUrl: (url: string) => void;
  setYoutubeId: (id: string | null) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setStartTrim: (time: number) => void;
  setEndTrim: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSelectedStyle: (style: SubtitleStyle) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setCropMode: (mode: CropMode) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setCaptions: (captions: Caption[]) => void;
  updateCaption: (id: string, updates: Partial<Caption>) => void;
  deleteCaption: (id: string) => void;
  setSelectedCaption: (id: string | null) => void;
  setExportQuality: (quality: ExportQuality) => void;
  setIsExporting: (exporting: boolean) => void;
  setExportProgress: (progress: number) => void;
  setIsSaving: (saving: boolean) => void;
  setAiScore: (score: number | null) => void;
  setPlatform: (platform: string | null) => void;
  setFontFamily: (font: string) => void;
  setFontSize: (size: number) => void;
  setFontColor: (color: string) => void;
  setClipMeta: (meta: { thumbnailUrl?: string; aiScore?: number; platform?: string }) => void;
  reset: () => void;
}

const initialState = {
  clipId: null,
  clipTitle: 'Untitled Clip',
  videoUrl: null,
  youtubeId: null,
  thumbnailUrl: null,
  currentTime: 0,
  duration: 0,
  startTrim: 0,
  endTrim: 0,
  isPlaying: false,
  selectedStyle: 'minimal' as SubtitleStyle,
  aspectRatio: '9:16' as AspectRatio,
  cropMode: 'smart' as CropMode,
  layoutMode: 'blur_padded' as LayoutMode,
  captions: [],
  selectedCaption: null,
  exportQuality: '1080p' as ExportQuality,
  isExporting: false,
  exportProgress: 0,
  isSaving: false,
  aiScore: null,
  platform: null,
  fontFamily: 'Arial',
  fontSize: 36,
  fontColor: '#FFFFFF',
};

export const useEditorStore = create<EditorState>()(
  devtools(
    (set) => ({
      ...initialState,
      setClipId: (id) => set({ clipId: id }),
      setClipTitle: (title) => set({ clipTitle: title }),
      setVideoUrl: (url) => set({ videoUrl: url }),
      setYoutubeId: (id) => set({ youtubeId: id }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration, endTrim: duration }),
      setStartTrim: (time) => set({ startTrim: time }),
      setEndTrim: (time) => set({ endTrim: time }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setSelectedStyle: (style) => set({ selectedStyle: style }),
      setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
      setCropMode: (mode) => set({ cropMode: mode }),
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      setCaptions: (captions) => set({ captions }),
      updateCaption: (id, updates) =>
        set((state) => ({
          captions: state.captions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCaption: (id) =>
        set((state) => ({ captions: state.captions.filter((c) => c.id !== id) })),
      setSelectedCaption: (id) => set({ selectedCaption: id }),
      setExportQuality: (quality) => set({ exportQuality: quality }),
      setIsExporting: (exporting) => set({ isExporting: exporting }),
      setExportProgress: (progress) => set({ exportProgress: progress }),
      setIsSaving: (saving) => set({ isSaving: saving }),
      setAiScore: (score) => set({ aiScore: score }),
      setPlatform: (platform) => set({ platform }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setFontSize: (size) => set({ fontSize: size }),
      setFontColor: (color) => set({ fontColor: color }),
      setClipMeta: (meta) =>
        set({
          ...(meta.thumbnailUrl !== undefined && { thumbnailUrl: meta.thumbnailUrl }),
          ...(meta.aiScore !== undefined && { aiScore: meta.aiScore }),
          ...(meta.platform !== undefined && { platform: meta.platform }),
        }),
      reset: () => set(initialState),
    }),
    { name: 'editor-store' }
  )
);
