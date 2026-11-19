"use client";

import React, { useState } from "react";
import {
  Palette,
  Plus,
  Check,
  Trash2,
  Upload,
  Type,
  Sliders,
  Shield,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INITIAL_TEMPLATES } from "@/lib/mockData";
import { BrandTemplate } from "@/types";

export default function BrandTemplatesPage() {
  const [templates, setTemplates] = useState<BrandTemplate[]>(INITIAL_TEMPLATES);
  const [isCreating, setIsCreating] = useState(false);

  // New template form state
  const [name, setName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [secondaryColor, setSecondaryColor] = useState("#FACC15");
  const [fontFamily, setFontFamily] = useState("Arial Bold, sans-serif");
  const [captionPosition, setCaptionPosition] = useState<"top" | "center" | "bottom">("bottom");
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTpl: BrandTemplate = {
      id: `tpl-${Date.now()}`,
      user_id: "user-1",
      name,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      font_family: fontFamily,
      caption_position: captionPosition,
      watermark_enabled: watermarkEnabled,
      watermark_opacity: 0.8,
      is_default: false,
      created_at: new Date().toISOString(),
    };

    setTemplates([newTpl, ...templates]);
    setIsCreating(false);
    setName("");
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setTemplates(
      templates.map((t) => ({
        ...t,
        is_default: t.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Brand Templates</h1>
          <p className="text-xs text-zinc-500">
            Define reusable fonts, subtitle palettes, logos, and watermark presets for your clips
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Preset
        </button>
      </div>

      {/* ── Create Template Form Modal ──────────────────────────────────────── */}
      {isCreating && (
        <Card className="border-2 border-blue-600 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-zinc-950 mb-4">Create Brand Preset</h3>
            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Preset Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Personal Brand (Neon Blue)"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-600"
                  >
                    <option value="Impact, sans-serif">Impact (Bold YouTube Style)</option>
                    <option value="Arial Bold, sans-serif">Arial Bold (Modern Clean)</option>
                    <option value="Montserrat, sans-serif">Montserrat Black (Creator)</option>
                    <option value="Helvetica, sans-serif">Helvetica (Professional)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Active Highlight Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-8 w-12 rounded cursor-pointer border"
                    />
                    <span className="font-mono text-xs text-zinc-600">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-8 w-12 rounded cursor-pointer border"
                    />
                    <span className="font-mono text-xs text-zinc-600">{secondaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Caption Position
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["top", "center", "bottom"] as const).map((pos) => (
                      <button
                        type="button"
                        key={pos}
                        onClick={() => setCaptionPosition(pos)}
                        className={`rounded-lg py-1.5 text-xs font-bold capitalize border ${
                          captionPosition === pos
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-zinc-200 text-zinc-600"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-zinc-900 shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">
                  Live Subtitle Preview
                </span>
                <p
                  style={{
                    fontFamily,
                  }}
                  className="text-lg font-black uppercase tracking-wide text-zinc-950 drop-shadow-sm"
                >
                  "THE SECRET TO{" "}
                  <span style={{ color: primaryColor }} className="font-black">BUILDING VIRAL</span> SHORT-FORM
                  CONTENT"
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Preset Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="p-5 hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-zinc-900">{tpl.name}</h3>
              </div>
              {tpl.is_default ? (
                <Badge variant="default" className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]">
                  Default Template
                </Badge>
              ) : (
                <button
                  onClick={() => handleSetDefault(tpl.id)}
                  className="text-[11px] font-semibold text-zinc-500 hover:text-blue-600"
                >
                  Set as Default
                </button>
              )}
            </div>

            <div className="mt-4 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Font Family:</span>
                <span className="font-semibold text-zinc-900">{tpl.font_family.split(",")[0]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Highlight Color:</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: tpl.primary_color }}
                  />
                  <span className="font-mono text-zinc-800">{tpl.primary_color}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Caption Position:</span>
                <span className="font-semibold capitalize text-zinc-900">{tpl.caption_position}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => handleDelete(tpl.id)}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
              <span className="text-[11px] text-zinc-400">Ready to apply to clips</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

