"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle, File01 as Newspaper, Plus, Users01 as Users } from "@untitledui/icons";
import { api } from "@/lib/api";
import type { Notice } from "@/features/types";

interface GroupEvent {
  id: string;
  title: string;
  event_date?: string;
  priority?: string;
  raw_message: string;
  created_at: string;
  telegram_groups?: { name: string };
}

interface UnifiedNews {
  id: string;
  type: "notice" | "event";
  title: string | null;
  summary: string;
  date: string;
  deadlineDate: string;
  priorityRank: number; // 3: High, 2: Medium, 1: Low, 0: Normal
  priorityLabel?: string;
  iconType: "ai" | "calendar" | "group";
}

interface CampusNewsWidgetProps {
  isExpanded?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getPriorityRank(priorityStr?: string | null): number {
  if (!priorityStr) return 0;
  const p = priorityStr.toLowerCase();
  if (p.includes("high") || p.includes("urgent") || p.includes("critical")) return 3;
  if (p.includes("medium")) return 2;
  if (p.includes("low")) return 1;
  return 0;
}

export function CampusNewsWidget({ isExpanded = false }: CampusNewsWidgetProps) {
  const [news, setNews] = useState<UnifiedNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ notices: Notice[] }>("/api/notices").catch(() => ({ notices: [] })),
      api.get<{ events: GroupEvent[] }>("/api/groups/events").catch(() => ({ events: [] }))
    ]).then(([noticesRes, eventsRes]) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const formattedNotices: UnifiedNews[] = (noticesRes.notices || []).map((n) => {
        const deadline = n.event_date || n.created_at;
        return {
          id: n.id,
          type: "notice",
          title: n.event_title || "Personal Notice",
          summary: n.ai_summary || n.notice_text,
          date: n.created_at,
          deadlineDate: deadline,
          priorityRank: 0,
          iconType: n.ai_summary ? "ai" : "calendar"
        };
      });

      const formattedEvents: UnifiedNews[] = (eventsRes.events || []).map((e) => {
        const deadline = e.event_date || e.created_at;
        return {
          id: e.id,
          type: "event",
          title: e.telegram_groups?.name ? `Group: ${e.telegram_groups.name}` : "Group Event",
          summary: e.title || e.raw_message,
          date: e.created_at,
          deadlineDate: deadline,
          priorityRank: getPriorityRank(e.priority),
          priorityLabel: e.priority,
          iconType: "group"
        };
      });

      // Filter to ONLY upcoming notices & events
      const upcomingItems = [...formattedNotices, ...formattedEvents].filter((item) => {
        const itemDate = new Date(item.deadlineDate);
        return itemDate >= today;
      });

      // Sort strictly by:
      // 1. Highest Priority first
      // 2. Earliest deadline/date first (closest upcoming)
      upcomingItems.sort((a, b) => {
        if (b.priorityRank !== a.priorityRank) {
          return b.priorityRank - a.priorityRank;
        }
        return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
      });

      setNews(upcomingItems);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-[10px] p-5 h-full">
        <div className="h-4 bg-muted rounded animate-pulse w-1/3 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse mb-2" />
        ))}
      </div>
    );
  }

  // Show a maximum of 3 in standard mode, or all upcoming notices when expanded
  const displayedNews = isExpanded ? news : news.slice(0, 3);

  return (
    <div className="bg-white border border-border rounded-[10px] p-5 card-hover h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Campus News</h3>
        </div>
        {isExpanded && news.length > 3 && (
          <span className="text-xs text-muted-foreground font-medium">
            {news.length} upcoming notices
          </span>
        )}
      </div>

      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 my-auto">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <Newspaper className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No upcoming notices</p>
          <p className="text-xs text-muted-foreground mb-3 text-center px-4">
            Upcoming announcements and reminders will appear here
          </p>
          <Link
            href="/dashboard/notices"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-medium rounded-[10px] hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Go to Announcements
          </Link>
        </div>
      ) : (
        <>
          <div className={`space-y-3 flex-1 overflow-y-auto scrollbar-hide ${isExpanded ? "max-h-[60vh]" : ""}`}>
            {displayedNews.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-[10px] hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.iconType === "ai" && <CheckCircle className="w-4 h-4 text-primary" />}
                  {item.iconType === "calendar" && <Calendar className="w-4 h-4 text-primary" />}
                  {item.iconType === "group" && <Users className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    {item.title && (
                      <p className="text-xs font-semibold text-primary truncate">{item.title}</p>
                    )}
                    {item.priorityLabel && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-amber-50 text-amber-700 shrink-0">
                        {item.priorityLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>Due: {formatDate(item.deadlineDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 mt-auto border-t border-border/60">
            {!isExpanded && news.length > 3 ? (
              <span className="text-xs text-muted-foreground">
                +{news.length - 3} more (click to expand)
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {news.length} upcoming
              </span>
            )}
            <Link
              href="/dashboard/notices"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors ml-auto"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
