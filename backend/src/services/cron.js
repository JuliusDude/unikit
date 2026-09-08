const cron = require("node-cron");
const axios = require("axios");
const { getClient } = require("./supabase");
const { sendDirectTelegramMessage } = require("./telegram");

/**
 * Initializes the background cron job for pushing reminders to Telegram directly.
 * Runs every 5 minutes.
 */
function initCronJobs() {
  console.log("🕒 Initializing background reminder cron job (Direct Telegram API)");

  cron.schedule("*/5 * * * *", async () => {
    // If we don't have a token, we shouldn't attempt to send messages
    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === "placeholder") {
      console.warn("⚠️ Cron: TELEGRAM_BOT_TOKEN is missing. Skipping reminder push.");
      return;
    }

    try {
      const port = process.env.PORT || 4000;
      const localApiUrl = `http://localhost:${port}/api/reminders`;

      // 1. Fetch Due Task Reminders (Personal)
      const tasksRes = await axios.get(`${localApiUrl}/tasks/due`);
      const dueTasks = tasksRes.data || [];

      for (const task of dueTasks) {
        // Send directly via Telegram Bot API
        const sendResult = await sendDirectTelegramMessage(
          task.telegram_chat_id,
          task.message_text
        );
        
        if (sendResult.success) {
          // Mark as sent in DB with the exact threshold (7d, 1d, 1h, 10m)
          await axios.patch(`${localApiUrl}/tasks/${task.id}/mark-sent`, { threshold: task.threshold });
          console.log(`✅ Sent ${task.threshold} Task Reminder to chat ${task.telegram_chat_id}`);
        } else {
          console.error(`❌ Failed to send Task Reminder:`, sendResult.error || sendResult.message);
        }
      }

      // 2. Fetch Due Group Reminders (Broadcasts)
      const groupsRes = await axios.get(`${localApiUrl}/due`);
      const dueGroupReminders = groupsRes.data || [];

      for (const reminder of dueGroupReminders) {
        const supabase = getClient();
        
        // Fetch group members directly using group_members table (as per notifyme-migration.sql)
        const { data: members } = await supabase
          .from("group_members")
          .select("student_id")
          .eq("group_id", reminder.group_id);

        let sentCount = 0;
        
        for (const member of members || []) {
          // Get the telegram status using the helper function
          const { getStudentTelegram } = require("./telegram");
          const telegramInfo = await getStudentTelegram(member.student_id);
            
          if (telegramInfo.isVerified && telegramInfo.chatId) {
            const message = `⚠️ *Upcoming Deadline!*\n\n📌 *${reminder.title}* is in *${reminder.days_left} day(s)* — ${reminder.event_date}\n\nCategory: ${reminder.category} | Priority: ${reminder.priority}`;
            
            await sendDirectTelegramMessage(telegramInfo.chatId, message);
            sentCount++;
          }
        }

        // Mark group reminder as sent
        await axios.patch(`${localApiUrl}/${reminder.id}/mark-sent`);
        console.log(`✅ Sent Group Reminder ${reminder.id} to ${sentCount} students`);
      }

    } catch (error) {
      console.error("❌ Cron Job Error:", error.message);
    }
  });
}

module.exports = { initCronJobs };
