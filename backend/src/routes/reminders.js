const express = require("express");
const { getClient } = require("../services/supabase");
const { getStudentTelegram } = require("../services/telegram");

const router = express.Router();

/**
 * Optional n8n secret verification
 */
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
 * Called by n8n workflow on schedule (e.g. every 1-5 minutes)
 * Returns all personal task reminders whose reminder_time has arrived and student has Telegram linked
 */
router.get("/tasks/due", n8nAuth, async (req, res) => {
  try {
    const supabase = getClient();
    const nowISO = new Date().toISOString();

    // Query pending tasks whose reminder_time has arrived and n8n hasn't triggered yet
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("id, student_id, title, subject, description, deadline, reminder_time, created_at")
      .eq("status", "pending")
      .eq("n8n_triggered", false)
      .not("reminder_time", "is", null)
      .lte("reminder_time", nowISO)
      .order("reminder_time", { ascending: true });

    if (error) throw error;

    const dueTaskReminders = [];

    for (const task of tasks || []) {
      const telegramInfo = await getStudentTelegram(task.student_id);

      // Only include if student has linked their Telegram
      if (telegramInfo.isVerified && telegramInfo.chatId) {
        const deadlineDate = new Date(task.deadline);
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
          title: task.title,
          subject: task.subject,
          description: task.description,
          deadline: task.deadline,
          deadline_formatted: deadlineFormatted,
          reminder_time: task.reminder_time,
          telegram_chat_id: telegramInfo.chatId,
          telegram_username: telegramInfo.username,
          student_id: task.student_id,
          message_text: `⏰ *UniKit Task Reminder*\n\n📌 *Task:* ${task.title}\n📚 *Subject:* ${task.subject}\n🗓️ *Deadline:* ${deadlineFormatted}${task.description ? `\n\n📝 ${task.description}` : ""}\n\nMake sure to complete and submit on time!`,
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
 * Called by n8n after delivering the Telegram reminder for a task
 */
router.patch("/tasks/:id/mark-sent", n8nAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getClient();

    const { data: task, error } = await supabase
      .from("tasks")
      .update({ n8n_triggered: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Record in automation_logs
    await supabase.from("automation_logs").insert({
      student_id: task.student_id,
      workflow_type: "deadline_reminder",
      status: "success",
      details: {
        task_id: task.id,
        title: task.title,
        reminder_time: task.reminder_time,
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
 * Original group reminders endpoint (also includes task reminders if requested)
 */
router.get("/due", n8nAuth, async (req, res) => {
  try {
    const supabase = getClient();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("sent", false)
      .order("event_date", { ascending: true });

    if (error) throw error;

    // Filter: reminder is due if (event_date - days_left) <= today
    const dueReminders = (reminders || []).filter((r) => {
      const eventDate = new Date(r.event_date);
      const reminderDate = new Date(eventDate);
      reminderDate.setDate(reminderDate.getDate() - r.days_left);
      const todayDate = new Date(today);
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
 * Marks group reminder as sent
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
