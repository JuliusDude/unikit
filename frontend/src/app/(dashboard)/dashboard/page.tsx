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
import type { Task } from "@/features/types";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ tasks: Task[] }>("/api/tasks")
      .then((res) => setTasks(res.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-[10px] p-6 md:p-8 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight" style={{ letterSpacing: "-0.04em" }}>
              {getGreeting()}, {user?.name?.split(" ")[0] || "Student"} 👋
            </h1>
            <p className="text-white/70 text-sm">
              Here&apos;s what&apos;s happening with your deadlines today.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-[10px] px-3 py-1.5">
              <CalendarDays className="w-4 h-4" />
              <span className="font-medium">{getFormattedDate()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-[10px] px-3 py-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{getFormattedTime()}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white border border-border rounded-[10px] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <motion.div variants={itemVariants}>
            <StatCard icon={ListTodo} label="Total Tasks" value={String(totalCount)} color="bg-primary/10 text-primary" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon={Clock} label="Pending" value={String(pendingCount)} color="bg-primary/5 text-primary" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard icon={CheckCircle} label="Completed" value={String(completedCount)} color="bg-primary/10 text-primary" />
          </motion.div>
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}><MonthlyCalendarWidget /></motion.div>
        <div className="grid grid-rows-2 gap-6">
          <motion.div variants={itemVariants} className="h-full"><TodayTasksWidget /></motion.div>
          <motion.div variants={itemVariants} className="h-full"><UpcomingDeadlinesWidget /></motion.div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}><AttendanceWidget /></motion.div>
        <motion.div variants={itemVariants}><StudyStreakWidget /></motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}><QuickActionsWidget /></motion.div>
        <motion.div variants={itemVariants}><WeeklyProgressWidget /></motion.div>
        <motion.div variants={itemVariants}><UpcomingEventsWidget /></motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}><RecentActivityWidget /></motion.div>
        <motion.div variants={itemVariants}><ProductivityScoreWidget /></motion.div>
        <motion.div variants={itemVariants}><FocusTimerWidget /></motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}><CampusNewsWidget /></motion.div>
        <motion.div variants={itemVariants}><AchievementWidget /></motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="flex justify-center"
      >
        <div className="w-full max-w-lg">
          <QuoteWidget />
        </div>
      </motion.div>
    </motion.div>
  );
}

