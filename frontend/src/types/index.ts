// ============================================================================
// Casper Shorts — Shared TypeScript Types & Interfaces
// ============================================================================

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  supabase_user_id?: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus =
  | "created"
  | "uploaded"
  | "queued"
  | "extracting_audio"
  | "transcribing"
  | "analysing"
  | "detecting_highlights"
  | "generating_clips"
  | "adding_captions"
  | "rendering"
  | "completed"
  | "failed";

export type TargetPlatform = "youtube_shorts" | "instagram_reels" | "tiktok";
export type AspectRatio = "9:16" | "1:1" | "16:9";
export type ClipDurationPreference = "15-30" | "30-60" | "60-90" | "auto";
export type SubtitlePreset = "minimal" | "bold" | "highlight" | "creator" | "professional";

export interface ProjectSettings {
  num_clips: number | "auto";
  target_platform: TargetPlatform;
  aspect_ratio: AspectRatio;
  duration_preference: ClipDurationPreference;
  caption_language: string;
  subtitle_style: SubtitlePreset;
  speaker_tracking: boolean;
  ai_highlight_detection: boolean;
  brand_template_id?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  source_type: "upload" | "youtube";
  source_url?: string;
  duration: number; // in seconds
  status: ProjectStatus;
  progress: number; // 0 to 100
  error_message?: string;
  settings: ProjectSettings;
  created_at: string;
  updated_at: string;
  video?: Video;
  clips_count?: number;
}

export interface Video {
  id: string;
  project_id: string;
  file_url: string;
  file_key?: string;
  file_size: number; // bytes
  duration: number; // seconds
  format: string; // "mp4", "mov", etc.
  resolution?: string; // "1920x1080"
  thumbnail_url?: string;
  created_at: string;
}

export interface WordTimestamp {
  word: string;
  start: number; // seconds
  end: number; // seconds
  confidence?: number;
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words: WordTimestamp[];
}

export interface Transcript {
  id: string;
  video_id: string;
  language: string;
  full_text: string;
  segments: TranscriptSegment[];
  created_at: string;
}

export interface ClipQualityScores {
  hook_strength: number; // 0-100
  context_completeness: number; // 0-100
  engagement_potential: number; // 0-100
  duration_fit: number; // 0-100
  speech_continuity: number; // 0-100
  overall_score: number; // 0-100
}

export interface GeneratedClip {
  id: string;
  project_id: string;
  title: string;
  start_time: number; // in seconds
  end_time: number; // in seconds
  duration: number;
  ai_score: number; // overall 0-100
  scores: ClipQualityScores;
  rendered_url?: string;
  thumbnail_url?: string;
  status: "pending" | "rendering" | "completed" | "failed";
  aspect_ratio: AspectRatio;
  platform: TargetPlatform;
  caption_status: "burned" | "none" | "custom";
  caption_style: SubtitlePreset;
  captions?: TranscriptSegment[];
  created_at: string;
  updated_at: string;
}

export interface BrandTemplate {
  id: string;
  user_id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  caption_position: "top" | "center" | "bottom";
  watermark_enabled: boolean;
  watermark_opacity: number;
  intro_text?: string;
  outro_text?: string;
  is_default: boolean;
  created_at: string;
}

export type SubscriptionPlanTier = "free" | "pro" | "business";

export interface SubscriptionPlan {
  id: SubscriptionPlanTier;
  name: string;
  price_monthly_inr: number;
  price_monthly_usd: number;
  processing_minutes: number;
  max_clips_per_month: number;
  max_resolution: "720p" | "1080p" | "4k";
  speaker_tracking: boolean;
  watermark: boolean;
  priority_processing: boolean;
  features: string[];
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlanTier;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_end: string;
  processing_minutes_used: number;
  processing_minutes_limit: number;
  clips_generated: number;
  credits_remaining: number;
}

export interface ProcessingJobEvent {
  job_id: string;
  project_id: string;
  status: ProjectStatus;
  step: string;
  progress: number;
  message: string;
  timestamp: string;
  clip_id?: string;
}

export interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  total_videos_processed: number;
  total_clips_generated: number;
  processing_failures: number;
  storage_usage_gb: number;
  platform_revenue_inr: number;
}

