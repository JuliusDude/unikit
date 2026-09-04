"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { TodayTasksWidget } from "@/features/dashboard/components/TodayTasksWidget";
import { UpcomingDeadlinesWidget } from "@/features/dashboard/components/UpcomingDeadlinesWidget";
import { AttendanceWidget } from "@/features/dashboard/components/AttendanceWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { WeeklyProgressWidget } from "@/components/dashboard/WeeklyProgressWidget";
import { StudyStreakWidget } from "@/components/dashboard/StudyStreakWidget";
import { UpcomingEventsWidget } from "@/components/dashboard/UpcomingEventsWidget";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { ProductivityScoreWidget } from "@/components/dashboard/ProductivityScoreWidget";
import { FocusTimerWidget } from "@/components/dashboard/FocusTimerWidget";
import { CampusNewsWidget } from "@/components/dashboard/CampusNewsWidget";
import { AchievementWidget } from "@/components/dashboard/AchievementWidget";
import { QuoteWidget } from "@/components/dashboard/QuoteWidget";
import { MonthlyCalendarWidget } from "@/components/dashboard/MonthlyCalendarWidget";
import { ListTodo, Clock, CheckCircle, CalendarDays } from "lucide-react";
import { api } from "@/lib/api";
import type { Task, Attendance } from "@/features/types";


function PopoutWidget({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Placeholder to keep grid layout intact when popped out */}
      {isExpanded && <div className="w-full h-full min-h-[250px] bg-muted/20 rounded-xl border border-dashed border-border" />}

      {/* The actual widget */}
      <div
        className={
          isExpanded
            ? "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            : "relative w-full h-full cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-md rounded-xl"
        }
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
      >
        {isExpanded && (
          <div
            className="absolute inset-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          />
        )}
        <div
          className={
            isExpanded
              ? "relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 rounded-xl shadow-2xl ring-1 ring-border bg-background"
              : "w-full h-full"
          }
          onClick={isExpanded ? (e) => e.stopPropagation() : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ tasks: Task[] }>("/api/tasks").catch(() => ({ tasks: [] })),
      api.get<{ attendance: Attendance[] }>("/api/attendance").catch(() => ({ attendance: [] }))
    ]).then(([taskRes, attRes]) => {
      setTasks(taskRes.tasks || []);
      setAttendance(attRes.attendance || []);
    }).finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">

      {/* ✨ Elegant Hero Header ✨ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-4xl md:text-5xl tracking-tight text-foreground tracking-tight leading-tight mb-2">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Student"}.
          </h1>
          
        </div>
        <div className="flex flex-col md:items-end gap-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <CalendarDays className="w-3.5 h-3.5" />
            {getFormattedDate()}
          </div>
          <div className="flex items-center gap-2 text-3xl font-medium tracking-tighter text-foreground tracking-tight">
            {getFormattedTime()}
          </div>
        </div>
      </div>

      {/* ── Row 1: Stat cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={ListTodo} label="Total Tasks"  value={String(totalCount)}    color="bg-primary/10 text-primary" />
          <StatCard icon={Clock}    label="Pending"      value={String(pendingCount)}   color="bg-amber-50 text-amber-600" />
          <StatCard icon={CheckCircle} label="Completed" value={String(completedCount)} color="bg-emerald-50 text-emerald-600" />
        </div>
      )}

      {/* ── Row 2: Calendar  |  Tasks + Deadlines ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <PopoutWidget><MonthlyCalendarWidget /></PopoutWidget>
        <div className="grid grid-cols-1 gap-6">
          <PopoutWidget><TodayTasksWidget tasks={tasks} /></PopoutWidget>
          <PopoutWidget><UpcomingDeadlinesWidget tasks={tasks} /></PopoutWidget>
        </div>
      </div>

      {/* ── Row 3: Attendance  |  Study Streak ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <PopoutWidget><AttendanceWidget attendance={attendance} /></PopoutWidget>
        <StudyStreakWidget attendance={attendance} />
      </div>

      {/* ── Row 4: Quick Actions  |  Weekly Progress  |  Upcoming Events ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <QuickActionsWidget />
        <WeeklyProgressWidget tasks={tasks} />
        <PopoutWidget><UpcomingEventsWidget /></PopoutWidget>
      </div>

      {/* ── Row 5: Recent Activity  |  Productivity Score  |  Focus Timer ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <RecentActivityWidget />
        <ProductivityScoreWidget tasks={tasks} attendance={attendance} />
        <PopoutWidget><FocusTimerWidget /></PopoutWidget>
      </div>

      {/* ── Row 6: Campus News  |  Achievements ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <PopoutWidget><CampusNewsWidget /></PopoutWidget>
        <AchievementWidget tasks={tasks} attendance={attendance} />
      </div>

      {/* ── Row 7: Quote (full-width centered) ── */}
      <QuoteWidget />
    </div>
  );
}
