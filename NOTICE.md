# Notice: Telegram Integration & n8n

As of the latest update, the Telegram notification system uses a hybrid architecture:

### 1. Direct Node.js Telegram API (Reminders)
The background cron job (`backend/src/services/cron.js`) completely **bypasses n8n**. It runs every 5 minutes and uses the `TELEGRAM_BOT_TOKEN` in your `.env` file to send multi-stage reminders directly to the Telegram API.
- **Tasks**: 7 Days, 1 Day, 1 Hour, 10 Minutes before deadline.
- **Group Notices/Events**: 7 Days, 1 Day before event (dispatched at 5:00 AM).

### 2. n8n Webhooks (Creation Receipts)
The following features still ping your n8n webhooks (`N8N_DEADLINE_WEBHOOK` and `N8N_NOTICE_WEBHOOK`) to send instant receipts/broadcasts when a new item is created on the frontend:
- **Instant Task Creation Receipt**: Triggered in `backend/src/routes/tasks.js` when a student creates a new task.
- **Notice Broadcasts**: Triggered in `backend/src/routes/notices.js` when a student clicks the "Broadcast" button for an uploaded notice.

If you ever wish to make the application 100% n8n-free, you will need to replace the `triggerN8nDeadline` and `triggerN8nNotice` functions in `backend/src/services/n8n.js` with direct Telegram API calls.
