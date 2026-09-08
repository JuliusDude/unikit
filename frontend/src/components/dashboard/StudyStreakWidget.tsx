"use client";

import { Activity as Flame, CheckCircle, Clock } from "@untitledui/icons";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Task } from "@/features/types";

export function StudyStreakWidget() {
  const [streak, setStreak] = useState(0);
  const [totalHours, setTotalHours] = useState("0.0");
  const [totalFinished, setTotalFinished] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ streak: number, totalHours: string }>("/api/activity/stats").catch(() => ({ streak: 0, totalHours: "0.0" })),
      api.get<{ tasks: Task[] }>("/api/tasks").catch(() => ({ tasks: [] }))
    ]).then(([statsRes, tasksRes]) => {
      setStreak(statsRes.streak || 0);
      setTotalHours(statsRes.totalHours || "0.0");
      setTotalFinished((tasksRes.tasks || []).filter((t: Task) => t.status === "completed").length);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-[10px] p-5 card-hover h-full text-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-[10px] bg-white/15 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5" />
        </div>
        <h3 className="font-semibold">Study Streak</h3>
      </div>

      <div className="text-center mb-4">
        {loading ? (
          <div className="h-[40px] w-[60px] bg-white/20 rounded mx-auto animate-pulse"></div>
        ) : (
          <>
            <p className="text-4xl font-bold tracking-tight">{streak}</p>
            <p className="text-xs text-white/70 mt-0.5">Day Streak</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-[10px] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs text-white/70">Hours</span>
          </div>
          <p className="text-lg font-bold">{loading ? "-" : totalHours}</p>
        </div>
        <div className="bg-white/10 rounded-[10px] p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs text-white/70">Tasks Done</span>
          </div>
          <p className="text-lg font-bold">{loading ? "-" : totalFinished}</p>
        </div>
      </div>
    </div>
  );
}
