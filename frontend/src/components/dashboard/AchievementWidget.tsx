"use client";

import React, { useEffect, useState } from "react";
import {
  Lightning01 as Zap,
  Star01 as Star,
  Target01 as Target,
  Trophy01 as Trophy,
  BookOpen01 as BookOpen,
  CheckCircle,
  Lightbulb01 as Lightbulb,
  Award01 as Award
} from "@untitledui/icons";
import { api } from "@/lib/api";

interface Badge {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  earned: boolean;
}

interface AchievementsData {
  xp: number;
  level: number;
  title: string;
  currentLevelXp: number;
  maxXp: number;
  badges: Badge[];
}

interface AchievementWidgetProps {
  isExpanded?: boolean;
}

const getBadgeIcon = (id: string) => {
  switch (id) {
    case "task_master": return Target;
    case "task_legend": return Trophy;
    case "early_bird": return Star;
    case "attendance_hero": return Zap;
    case "quiz_ace": return CheckCircle;
    case "memory_master": return Lightbulb;
    case "top_performer": return Award;
    default: return Trophy;
  }
};

export function AchievementWidget({ isExpanded }: AchievementWidgetProps) {
  const [data, setData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{
        xp: number;
        level: number;
        title: string;
        currentLevelXp: number;
        maxXp: number;
        badges: Badge[];
      }>("/api/achievements")
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-[10px] p-5 card-hover h-full flex flex-col items-center justify-center min-h-[250px]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-border rounded-[10px] p-5 card-hover h-full flex flex-col items-center justify-center min-h-[250px]">
        <p className="text-sm text-muted-foreground">Failed to load achievements.</p>
      </div>
    );
  }

  const { level, title, currentLevelXp, maxXp, badges } = data;
  const xpPercent = Math.min((currentLevelXp / maxXp) * 100, 100);

  // Normal view: prioritize unearned badges close to completion (sort by progress/target descending)
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.earned && !b.earned) return -1;
    if (!a.earned && b.earned) return 1;
    return (b.progress / b.target) - (a.progress / a.target);
  });

  const displayBadges = sortedBadges.slice(0, 4);

  if (isExpanded) {
    return (
      <div className="p-6 md:p-8 flex flex-col h-full bg-white rounded-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Achievements</h2>
            <p className="text-sm text-muted-foreground">Level {level} &bull; {title}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">XP Progress</span>
            <span className="text-sm text-muted-foreground">{currentLevelXp} / {maxXp} XP</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary animate-progress-fill"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => {
            const Icon = getBadgeIcon(badge.id);
            const isEarned = badge.earned;
            const progressPct = Math.min((badge.progress / badge.target) * 100, 100);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-[12px] border flex gap-4 items-start ${
                  isEarned ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border opacity-70"
                }`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  isEarned ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h4 className={`font-semibold truncate ${isEarned ? "text-foreground" : "text-muted-foreground"}`}>
                      {badge.name}
                    </h4>
                    {isEarned && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary shrink-0">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{badge.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isEarned ? "bg-primary" : "bg-primary/50"}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">
                      {badge.progress} / {badge.target}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-[10px] p-5 card-hover h-full flex flex-col transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0">
          <Trophy className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground text-sm">Achievements</h3>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground">Level {level}</span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
              {title}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{currentLevelXp} / {maxXp} XP</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
        {displayBadges.map((badge) => {
          const Icon = getBadgeIcon(badge.id);
          const isEarned = badge.earned;

          return (
            <div
              key={badge.id}
              className={`flex items-center gap-2 p-2 rounded-[10px] transition-all border ${
                isEarned ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-transparent opacity-60"
              }`}
            >
              <div className={`w-8 h-8 rounded-[8px] flex shrink-0 items-center justify-center ${
                isEarned ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-[11px] font-semibold truncate ${isEarned ? "text-foreground" : "text-muted-foreground"}`}>
                  {badge.name}
                </span>
                {!isEarned && (
                  <span className="text-[9px] font-medium text-muted-foreground">
                    {badge.progress}/{badge.target}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pointer-events-none">
        <button className="w-full py-2 text-xs font-medium text-muted-foreground rounded-md transition-colors flex items-center justify-center gap-1 bg-muted/30">
          View All <Star className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
