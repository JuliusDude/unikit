"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle, File01 as Newspaper, Plus, Users01 as Users } from "@untitledui/icons";
import { api } from "@/lib/api";
import type { Notice } from "@/features/types";

interface GroupEvent {
  id: string;
  title: string;
  raw_message: string;
  created_at: string;
  telegram_groups?: { name: string };
}

type UnifiedNews = {
  id: string;
  type: "notice" | "event";
  title: string | null;
  summary: string;
  date: string;
  iconType: "ai" | "calendar" | "group";
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function CampusNewsWidget() {
  const [news, setNews] = useState<UnifiedNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ notices: Notice[] }>("/api/notices").catch(() => ({ notices: [] })),
      api.get<{ events: GroupEvent[] }>("/api/groups/events").catch(() => ({ events: [] }))
    ]).then(([noticesRes, eventsRes]) => {
      
      const formattedNotices: UnifiedNews[] = (noticesRes.notices || []).map(n => ({
        id: n.id,
        type: "notice",
        title: n.event_title || "Personal Notice",
        summary: n.ai_summary || n.notice_text,
        date: n.created_at,
        iconType: n.ai_summary ? "ai" : "calendar"
      }));

      const formattedEvents: UnifiedNews[] = (eventsRes.events || []).map(e => ({
        id: e.id,
        type: "event",
        title: e.telegram_groups?.name ? `Group: ${e.telegram_groups.name}` : "Group Event",
        summary: e.title || e.raw_message,
        date: e.created_at,
        iconType: "group"
      }));

      const combined = [...formattedNotices, ...formattedEvents].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setNews(combined);
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

  return (
    <div className="bg-white border border-border rounded-[10px] p-5 card-hover h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Campus News</h3>
        </div>
        <Link
          href="/dashboard/notices"
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-[10px] hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add Notice
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 my-auto">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <Newspaper className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No news yet</p>
          <p className="text-xs text-muted-foreground mb-3 text-center px-4">Group announcements and personal notices will appear here</p>
          <Link
            href="/dashboard/notices"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-medium rounded-[10px] hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Go to Announcements
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
            {news.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-[10px] hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.iconType === "ai" && <CheckCircle className="w-4 h-4 text-primary" />}
                  {item.iconType === "calendar" && <Calendar className="w-4 h-4 text-primary" />}
                  {item.iconType === "group" && <Users className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  {item.title && (
                    <p className="text-xs font-medium text-primary mb-0.5">{item.title}</p>
                  )}
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                    {item.summary}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/notices"
            className="flex items-center justify-center gap-1 mt-3 py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All News <ArrowRight className="w-3 h-3" />
          </Link>
        </>
      )}
    </div>
  );
}
