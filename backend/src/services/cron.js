const cron = require("node-cron");
const axios = require("axios");
const { getClient } = require("./supabase");

/**
 * Initializes the background cron job for pushing reminders to n8n.
 * Runs every 5 minutes.
 */
function initCronJobs() {
  console.log("🕒 Initializing background reminder cron job (Push Architecture)");

  cron.schedule("*/5 * * * *", async () => {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.warn("⚠️ Cron: N8N_WEBHOOK_URL is not set. Skipping reminder push.");
      return;
    }

    try {
      const port = process.env.PORT || 4000;
      const localApiUrl = `http://localhost:${port}/api/reminders`;

      // 1. Fetch Due Task Reminders (Personal)
      const tasksRes = await axios.get(`${localApiUrl}/tasks/due`);
      const dueTasks = tasksRes.data || [];

      for (const task of dueTasks) {
        // Push to n8n webhook
        await axios.post(n8nWebhookUrl, {
          type: "task_reminder",
          telegram_chat_id: task.telegram_chat_id,
          message_text: task.message_text
        });
        
        // Mark as sent
        await axios.patch(`${localApiUrl}/tasks/${task.id}/mark-sent`);
        console.log(`✅ Pushed Task Reminder for task ${task.id}`);
      }

      // 2. Fetch Due Group Reminders (Broadcasts)
      const groupsRes = await axios.get(`${localApiUrl}/due`);
      const dueGroupReminders = groupsRes.data || [];

      for (const reminder of dueGroupReminders) {
        // Fetch all students in this group who have telegram linked
        const supabase = getClient();
        
        const { data: enrollments } = await supabase
          .from("group_enrollments")
          .select("student_id")
          .eq("group_id", reminder.group_id);

        let sentCount = 0;
        
        for (const enroll of enrollments || []) {
          const { data: pref } = await supabase
            .from("preferences")
            .select("settings")
            .eq("user_id", enroll.student_id)
            .single();
            
          const chat_id = pref?.settings?.telegram_chat_id;
          if (chat_id) {
            const message = `⚠️ *Upcoming Deadline!*\n\n📌 *${reminder.title}* is in *${reminder.days_left} day(s)* — ${reminder.event_date}\n\nCategory: ${reminder.category} | Priority: ${reminder.priority}`;
            
            await axios.post(n8nWebhookUrl, {
              type: "group_reminder",
              telegram_chat_id: chat_id,
              message_text: message
            });
            sentCount++;
          }
        }

        // Mark as sent
        await axios.patch(`${localApiUrl}/${reminder.id}/mark-sent`);
        console.log(`✅ Pushed Group Reminder ${reminder.id} to ${sentCount} students`);
      }

    } catch (error) {
      console.error("❌ Cron Job Error:", error.message);
    }
  });
}

module.exports = { initCronJobs };
