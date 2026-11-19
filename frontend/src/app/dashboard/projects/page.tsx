"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  PlusCircle,
  Video,
  Clock,
  Film,
  Trash2,
  ExternalLink,
  Search,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { INITIAL_PROJECTS } from "@/lib/mockData";
import { Project } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [search, setSearch] = useState("");

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("casper_user_projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects([...parsed, ...INITIAL_PROJECTS]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Delete this project and all its generated clips?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">My Video Projects</h1>
          <p className="text-xs text-zinc-500">
            Source videos, podcasts, and webinars imported for short-form repurposing
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Import New Video
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full text-xs text-zinc-900 outline-none placeholder:text-zinc-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((proj) => (
          <Card key={proj.id} className="overflow-hidden hover:border-zinc-300 transition-all">
            <div className="relative aspect-video w-full bg-zinc-950">
              <img
                src={proj.video?.thumbnail_url || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=60"}
                alt={proj.name}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="default" className="bg-black/75 text-white backdrop-blur text-[10px]">
                  {proj.source_type === "youtube" ? "YouTube" : "Direct Upload"}
                </Badge>
              </div>
              <div className="absolute bottom-3 right-3 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-white">
                {Math.floor(proj.duration / 60)} mins
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 line-clamp-1" title={proj.name}>
                {proj.name}
              </h3>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Film className="h-3.5 w-3.5 text-blue-600" />
                  <strong>{proj.clips_count || 0}</strong> clips generated
                </span>
                <span>{new Date(proj.created_at).toLocaleDateString()}</span>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <Link
                  href="/dashboard/clips"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View Clips →
                </Link>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1 text-zinc-400 hover:text-rose-600"
                  title="Delete Project"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

