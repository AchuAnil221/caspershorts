'use client';

import React, { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Download,
  Loader2,
  Edit2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useEditorStore } from '@/store/editorStore';
import VideoPreview from '@/components/editor/VideoPreview';
import Timeline from '@/components/editor/Timeline';
import SubtitleTrack from '@/components/editor/SubtitleTrack';
import LeftSidebar from '@/components/editor/LeftSidebar';
import RightSidebar from '@/components/editor/RightSidebar';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const clipId = params?.clipId as string;

  const {
    clipTitle,
    setClipTitle,
    setClipId,
    setVideoUrl,
    setDuration,
    setCaptions,
    setAiScore,
    setPlatform,
    setClipMeta,
    isSaving,
    setIsSaving,
    isExporting,
    reset,
  } = useEditorStore();

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load clip data on mount
  useEffect(() => {
    if (!clipId) return;
    setClipId(clipId);

    const loadClip = async () => {
      try {
        setLoading(true);
        // Replace with real API call: const data = await api.get(`/clips/${clipId}`);
        // Mock data for development
        await new Promise((r) => setTimeout(r, 600));
        let matchedClip = null;
        try {
          const userClips = JSON.parse(localStorage.getItem('casper_user_clips') || '[]');
          matchedClip = userClips.find((c: any) => c.id === clipId);
        } catch (e) {
          console.error('Failed reading user clips:', e);
        }

        const resolvedClip = matchedClip || {
          id: clipId,
          title: 'Why 99% of SaaS Startups Die in Year One',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: 45,
          aiScore: 98,
          platform: 'YouTube Shorts',
          aspectRatio: '9:16' as const,
          captions: [
            { id: 'c1', text: 'The number one reason startups fail', startTime: 0, endTime: 3.5 },
            { id: 'c2', text: "isn't competition or lack of capital", startTime: 3.8, endTime: 7.2 },
            { id: 'c3', text: 'it is building something nobody actually wants.', startTime: 7.5, endTime: 12.0 },
            { id: 'c4', text: 'If you solve a hair-on-fire problem, customers will find you.', startTime: 12.5, endTime: 18.0 },
          ],
        };

        setClipTitle(resolvedClip.title);
        // Extract YouTube ID if created from YouTube
        const ytId =
          resolvedClip.youtube_id ||
          (resolvedClip.source_url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/)?.[2]) ||
          (resolvedClip.thumbnail_url?.match(/\/vi\/([a-zA-Z0-9_-]{11})\//)?.[1]);

        if (ytId) {
          useEditorStore.getState().setYoutubeId(ytId);
        }

        if (resolvedClip.rendered_url || resolvedClip.videoUrl) {
          setVideoUrl(resolvedClip.rendered_url || resolvedClip.videoUrl);
        }
        setDuration(resolvedClip.duration || 45);
        if (resolvedClip.captions && resolvedClip.captions.length > 0) {
          setCaptions(resolvedClip.captions);
        } else {
          // Generate customized subtitle segments based on the clip title
          const title = resolvedClip.title.replace(/^\[Part \d+\]\s*/, '');
          setCaptions([
            { id: 'c1', text: `${title.slice(0, 35)}...`, startTime: 0, endTime: 3.5 },
            { id: 'c2', text: 'Analyzing key takeaways from this moment', startTime: 3.8, endTime: 7.5 },
            { id: 'c3', text: 'Speaker tracking framed automatically in 9:16', startTime: 7.8, endTime: 12.0 },
            { id: 'c4', text: 'Dynamic AI karaoke subtitles rendered in real-time', startTime: 12.5, endTime: 17.5 },
          ]);
        }
        setAiScore(resolvedClip.ai_score || resolvedClip.aiScore || 96);
        setPlatform(resolvedClip.platform || 'YouTube Shorts');
        setClipMeta({
          aiScore: resolvedClip.ai_score || resolvedClip.aiScore || 96,
          platform: resolvedClip.platform || 'YouTube Shorts',
        });
      } catch (err) {
        setError('Failed to load clip. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadClip();
    return () => reset();
  }, [clipId]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // await api.put(`/clips/${clipId}`, { title: clipTitle, ... });
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setIsSaving(false);
    }
  }, [clipId, clipTitle, setIsSaving]);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-600 mb-4 font-semibold">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-50 flex flex-col overflow-hidden text-zinc-900">
      {/* Header */}
      <header className="h-14 bg-white border-b border-zinc-200 flex items-center gap-3 px-4 shrink-0 shadow-sm z-10">
        <button
          onClick={() => router.back()}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isEditingTitle ? (
            <input
              autoFocus
              value={clipTitle}
              onChange={(e) => setClipTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingTitle(false); }}
              className="bg-white text-zinc-900 text-sm font-bold px-2.5 py-1 rounded-xl border border-blue-600 outline-none shadow-sm max-w-md w-full"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-blue-600 transition truncate max-w-lg"
            >
              <span className="truncate">{clipTitle}</span>
              <Edit2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm',
              isSaving
                ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
            )}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            Export 1080p
          </button>
        </div>
      </header>

      {/* Main editor layout */}
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />

        {/* Center: video preview + bottom timeline */}
        <main className="flex-1 flex flex-col overflow-hidden bg-zinc-100/60">
          {/* Video preview area */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <VideoPreview className="max-h-full" />
          </div>

          {/* Timeline bottom bar */}
          <div className="bg-white border-t border-zinc-200 p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider w-16 shrink-0">Trimming</span>
              <Timeline className="flex-1" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider w-16 shrink-0">Subtitles</span>
              <SubtitleTrack className="flex-1" />
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
