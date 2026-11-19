"use client";

import React, { useState } from "react";
import { User, Lock, Bell, Key, Save, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Alex Rivera");
  const [email, setEmail] = useState(user?.email || "alex@creatorgrowth.io");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Account Settings</h1>
        <p className="text-xs text-zinc-500">
          Manage your personal profile, authentication, and notifications
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-blue-600" />
            Profile Details
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Reset */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4 text-blue-600" />
            Security & Password
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => alert("Password updated successfully.")}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Update Password
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

