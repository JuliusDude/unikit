const express = require("express");
const { getClient } = require("../services/supabase");
const { getStudentTelegram } = require("../services/telegram");

const router = express.Router();

function n8nAuth(req, res, next) {
  const secret = req.headers["x-n8n-secret"];
  const configuredSecret = process.env.N8N_WEBHOOK_SECRET;

  if (configuredSecret && secret && secret !== configuredSecret) {
    return res.status(401).json({ message: "Invalid n8n secret token" });
  }
  next();
}

/**
 * GET /api/reminders/tasks/due
 * Called by n8n workflow on schedule (e.g. every 5 minutes)
 */
router.get("/tasks/due", n8nAuth, async (req, res) => {
  try {
    const supabase = getClient();
    
    // We only fetch pending tasks. We no longer filter by reminder_time.
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("id, student_id, title, subject, description, deadline, reminders_sent, created_at")
      .eq("status", "pending")
      .order("deadline", { ascending: true });

    if (error) throw error;

    const dueTaskReminders = [];
    const now = new Date();
    const isPast5AM = now.getHours() >= 5;

    for (const task of tasks || []) {
      const deadlineDate = new Date(task.deadline);
      const msLeft = deadlineDate.getTime() - now.getTime();
      
      // If deadline already passed, skip (no more reminders)
      if (msLeft <= 0) continue;

      const hoursLeft = msLeft / (1000 * 60 * 60);
      const minutesLeft = msLeft / (1000 * 60);
      const sent = task.reminders_sent || {};

      let thresholdToTrigger = null;
      let alertPrefix = "";

      // 7 Days Before (Must be past 5 AM)
      if (hoursLeft <= (7 * 24) && hoursLeft > 24 && !sent["7d"] && isPast5AM) {
        thresholdToTrigger = "7d";
        alertPrefix = "📅 7 Days Left:";
      } 
      // 1 Day Before (Must be past 5 AM)
      else if (hoursLeft <= 24 && hoursLeft > 1 && !sent["1d"] && isPast5AM) {
        thresholdToTrigger = "1d";
        alertPrefix = "🕒 Tomorrow:";
      } 
      // 1 Hour Before
      else if (hoursLeft <= 1 && minutesLeft > 10 && !sent["1h"]) {
        thresholdToTrigger = "1h";
        alertPrefix = "⏳ 1 Hour Left:";
      } 
      // 10 Mins Before
      else if (minutesLeft <= 10 && !sent["10m"]) {
        thresholdToTrigger = "10m";
        alertPrefix = "🚨 FINAL WARNING (10 Mins):";
      }

      if (!thresholdToTrigger) continue;

      const telegramInfo = await getStudentTelegram(task.student_id);

      if (telegramInfo.isVerified && telegramInfo.chatId) {
        const deadlineFormatted = deadlineDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        dueTaskReminders.push({
          id: task.id,
          task_id: task.id,
          type: "task_reminder",
          threshold: thresholdToTrigger,
          title: task.title,
          telegram_chat_id: telegramInfo.chatId,
          message_text: `⏰ *UniKit Task Reminder*\n\n*${alertPrefix}*\n📌 *Task:* ${task.title}\n📚 *Subject:* ${task.subject}\n🗓️ *Deadline:* ${deadlineFormatted}${task.description ? `\n\n📝 ${task.description}` : ""}\n\nMake sure to complete and submit on time!`,
        });
      }
    }

    res.json(dueTaskReminders);
  } catch (error) {
    console.error("Fetch due task reminders error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * PATCH /api/reminders/tasks/:id/mark-sent
 */
router.patch("/tasks/:id/mark-sent", n8nAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { threshold } = req.body;
    const supabase = getClient();

    // Get current reminders_sent
    const { data: currentTask } = await supabase
      .from("tasks")
      .select("reminders_sent, student_id, title")
      .eq("id", id)
      .single();
      
    if (!currentTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const currentSent = currentTask.reminders_sent || {};
    if (threshold) {
      currentSent[threshold] = true;
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .update({ reminders_sent: currentSent })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Record in automation_logs
    await supabase.from("automation_logs").insert({
      student_id: currentTask.student_id,
      workflow_type: "deadline_reminder",
      status: "success",
      details: {
        task_id: id,
        title: currentTask.title,
        threshold_sent: threshold,
        delivered_at: new Date().toISOString(),
      },
    });

    res.json({ message: "Task reminder marked as sent", task });
  } catch (error) {
    console.error("Mark task reminder sent error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/reminders/due
 * Group reminders (Notices/Events) at 5:00 AM
 */
router.get("/due", n8nAuth, async (req, res) => {
  try {
    const supabase = getClient();
    const now = new Date();
    
    // Only dispatch group reminders if it's past 5:00 AM
    if (now.getHours() < 5) {
      return res.json([]);
    }

    const todayStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("sent", false)
      .order("event_date", { ascending: true });

    if (error) throw error;

    const dueReminders = (reminders || []).filter((r) => {
      const eventDate = new Date(r.event_date);
      const reminderDate = new Date(eventDate);
      reminderDate.setDate(reminderDate.getDate() - r.days_left);
      const todayDate = new Date(todayStr);
      return reminderDate <= todayDate;
    });

    res.json(dueReminders);
  } catch (error) {
    console.error("Fetch due reminders error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * PATCH /api/reminders/:id/mark-sent
 */
router.patch("/:id/mark-sent", n8nAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: reminder, error } = await getClient()
      .from("reminders")
      .update({ sent: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder marked as sent", reminder });
  } catch (error) {
    console.error("Mark reminder sent error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
