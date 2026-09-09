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
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-[10px] p-6 card-hover h-full flex flex-col text-white">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 rounded-[10px] bg-white/15 flex items-center justify-center shrink-0 shadow-inner">
          <Flame className="w-5 h-5 text-orange-200" />
        </div>
        <h3 className="font-bold text-lg tracking-tight">Study Streak</h3>
      </div>

      <div className="text-center flex-1 flex flex-col items-center justify-center min-h-[120px]">
        {loading ? (
          <div className="h-[60px] w-[80px] bg-white/20 rounded mx-auto animate-pulse"></div>
        ) : (
          <>
            <p className="text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-sm mb-2">{streak}</p>
            <p className="text-sm text-white/80 font-bold uppercase tracking-[0.2em]">Day Streak</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 shrink-0">
        <div className="bg-white/10 backdrop-blur-sm rounded-[12px] p-4 text-center border border-white/5 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Hours</span>
          </div>
          <p className="text-2xl font-bold">{loading ? "-" : totalHours}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-[12px] p-4 text-center border border-white/5 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-white/70" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Done</span>
          </div>
          <p className="text-2xl font-bold">{loading ? "-" : totalFinished}</p>
        </div>
      </div>
    </div>
  );
}
