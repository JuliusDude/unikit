const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getClient } = require("../services/supabase");
const {
  generateLinkToken,
  resolveLinkToken,
  getStudentTelegram,
  linkStudentTelegram,
  unlinkStudentTelegram,
  sendDirectTelegramMessage,
} = require("../services/telegram");

const router = express.Router();

/**
 * Middleware to optionally check n8n secret header or pass through
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
 * GET /api/telegram/status
 * Returns current Telegram linking status for the logged-in student
 */
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const studentId = req.student.id;
    const { chatId, username, isVerified } = await getStudentTelegram(studentId);

    const tokenData = generateLinkToken(studentId);
    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "unialert0bot";

    res.json({
      connected: isVerified,
      chat_id: chatId,
      username: username,
      link_code: tokenData.code,
      deep_link: `https://t.me/${botUsername}?start=${tokenData.deepLinkPayload}`,
      bot_username: botUsername,
      expires_in_minutes: tokenData.expiresInMinutes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/telegram/verify-link
 * Called by n8n or direct webhook when a student sends /start or /link in Telegram
 * Body: { chat_id, username, code } or { chat_id, username, text }
 */
router.post("/verify-link", n8nAuth, async (req, res) => {
  try {
    const { chat_id, username, code, text } = req.body;

    if (!chat_id) {
      return res.status(400).json({ message: "chat_id is required" });
    }

    // Extract token from command text (e.g., "/start link_9482" or "/link UK-9482" or "UK-9482")
    let rawToken = code;
    if (!rawToken && text) {
      const match = text.match(/(?:link_|\/link\s+)([A-Za-z0-9_-]+)/i);
      if (match) {
        rawToken = match[1];
      } else if (text.trim().startsWith("UK-") || text.trim().length >= 4) {
        rawToken = text.trim();
      }
    }

    if (!rawToken) {
      return res.status(400).json({
        message: "No link code found. Send /link <CODE> or click the link from UniKit Settings.",
      });
    }

    const studentId = resolveLinkToken(rawToken);
    if (!studentId) {
      return res.status(404).json({
        message: "Invalid or expired link code. Please refresh your UniKit Settings page to get a new code.",
      });
    }

    // Fetch student info
    const supabase = getClient();
    const { data: student } = await supabase
      .from("students")
      .select("id, name, email")
      .eq("id", studentId)
      .single();

    if (!student) {
      return res.status(404).json({ message: "Student account not found." });
    }

    // Perform the database link
    await linkStudentTelegram(studentId, {
      chatId: chat_id,
      username: username || null,
    });

    const replyMessage = `🎉 *Connected to UniKit!*\n\nWelcome, *${student.name}*! Your Telegram account has been linked to UniKit.\n\nYou will now receive reminder notifications for your upcoming tasks and deadlines directly in this chat.`;

    res.json({
      success: true,
      student_id: studentId,
      student_name: student.name,
      chat_id: chat_id,
      message: replyMessage,
    });
  } catch (error) {
    console.error("Verify telegram link error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/telegram/unlink
 * Disconnects Telegram for the authenticated student
 */
router.post("/unlink", authMiddleware, async (req, res) => {
  try {
    await unlinkStudentTelegram(req.student.id);
    res.json({ success: true, message: "Telegram account unlinked successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/telegram/test-notification
 * Sends a test notification to verify the student's connected Telegram
 */
router.post("/test-notification", authMiddleware, async (req, res) => {
  try {
    const { chatId, isVerified } = await getStudentTelegram(req.student.id);

    if (!isVerified || !chatId) {
      return res.status(400).json({
        message: "Telegram is not yet linked. Please connect your Telegram first.",
      });
    }

    const studentName = req.student.name || "Student";
    const testText = `🔔 *UniKit Notification Test*\n\nHi *${studentName}*! Your Telegram connection is working perfectly.\n\nWhenever a task reminder is due, you'll receive real-time alerts right here! 🚀`;

    const sendRes = await sendDirectTelegramMessage(chatId, testText);

    res.json({
      success: true,
      chat_id: chatId,
      sent_via_bot: sendRes.success,
      message: "Test notification dispatched to your Telegram chat.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
