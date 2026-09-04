"use client";

import type { Task } from "@/features/types";
import { BarChart01 as BarChart } from "@untitledui/icons";

interface WeeklyProgressWidgetProps {
  tasks: Task[];
}

export function WeeklyProgressWidget({ tasks = [] }: WeeklyProgressWidgetProps) {

  const getWeekData = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((label, i) => {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayTasks = tasks.filter((t) => {
        const d = new Date(t.deadline);
        return d >= dayStart && d < dayEnd;
      });

      return {
        label,
        completed: dayTasks.filter((t) => t.status === "completed").length,
        pending: dayTasks.filter((t) => t.status !== "completed").length,
      };
    });
  };

  const weekData = getWeekData();
  const maxVal = Math.max(...weekData.map((d) => d.completed + d.pending), 1);
  const totalCompleted = weekData.reduce((s, d) => s + d.completed, 0);
  const totalPending = weekData.reduce((s, d) => s + d.pending, 0);
  const hasAnyTasks = totalCompleted > 0 || totalPending > 0;

  return (
    <div className="bg-white border border-border rounded-[10px] p-5 card-hover h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Weekly Progress</h3>
        <span className="text-xs text-muted-foreground">{totalCompleted} done this week</span>
      </div>

      {!hasAnyTasks ? (
        <div className="flex-1 flex flex-col items-center justify-center my-4 py-6">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
            <BarChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">No tasks scheduled for this week</p>
        </div>
      ) : (
        <div className="flex items-end gap-2 h-32 mb-4 flex-1">
          {weekData.map((day, i) => {
            const totalH = ((day.completed + day.pending) / maxVal) * 100;
            const completedH = (day.completed / (day.completed + day.pending || 1)) * totalH;
            return (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: "100%" }}>
                  <div
                    className={`w-full ${totalH - completedH === 0 ? 'rounded-t-[4px] rounded-b-[4px]' : 'rounded-b-[4px]'} bg-primary animate-progress-fill transition-all`}
                    style={{ height: `${completedH}%`, minHeight: completedH > 0 ? '4px' : '0', animationDelay: `${i * 0.08}s` }}
                  />
                  <div
                    className={`w-full ${completedH === 0 ? 'rounded-t-[4px] rounded-b-[4px]' : 'rounded-t-[4px]'} bg-muted transition-all`}
                    style={{ height: `${totalH - completedH}%`, minHeight: (totalH - completedH) > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{day.label}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs mt-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[4px] bg-primary" />
          <span className="text-muted-foreground">Completed ({totalCompleted})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[4px] bg-muted" />
          <span className="text-muted-foreground">Pending ({totalPending})</span>
        </div>
      </div>
    </div>
  );
}
