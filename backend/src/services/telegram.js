const axios = require("axios");
const { getClient } = require("./supabase");

// In-memory store for active verification tokens: code -> { studentId, expiresAt }
const linkTokens = new Map();

// Helper to clean expired tokens periodically
function cleanExpiredTokens() {
  const now = Date.now();
  for (const [code, data] of linkTokens.entries()) {
    if (data.expiresAt < now) {
      linkTokens.delete(code);
    }
  }
}
setInterval(cleanExpiredTokens, 5 * 60 * 1000);

/**
 * Generates a verification code & deep-link token for a student
 */
function generateLinkToken(studentId) {
  cleanExpiredTokens();

  // Check if student already has a pending code
  for (const [existingCode, data] of linkTokens.entries()) {
    if (data.studentId === studentId && data.expiresAt > Date.now()) {
      return {
        code: existingCode,
        deepLinkPayload: `link_${existingCode.replace("-", "")}`,
        expiresInMinutes: Math.round((data.expiresAt - Date.now()) / 60000),
      };
    }
  }

  // Generate 6-digit code
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const code = `UK-${randomDigits}`;
  const deepLinkPayload = `link_${randomDigits}`;

  linkTokens.set(code, {
    studentId,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 mins
  });
  linkTokens.set(deepLinkPayload, {
    studentId,
    expiresAt: Date.now() + 30 * 60 * 1000,
  });

  return {
    code,
    deepLinkPayload,
    expiresInMinutes: 30,
  };
}

/**
 * Resolves a verification code or payload to a studentId
 */
function resolveLinkToken(input) {
  if (!input) return null;
  const clean = String(input).trim();
  
  if (linkTokens.has(clean)) {
    const data = linkTokens.get(clean);
    if (data.expiresAt > Date.now()) return data.studentId;
  }

  // Try uppercase or formatted versions
  const upper = clean.toUpperCase();
  if (linkTokens.has(upper)) {
    const data = linkTokens.get(upper);
    if (data.expiresAt > Date.now()) return data.studentId;
  }

  return null;
}

/**
 * Fetches the Telegram linking status for a student from preferences or students table
 */
async function getStudentTelegram(studentId) {
  const supabase = getClient();

  // Check preferences table first (always available without schema conflicts)
  let chatId = null;
  let username = null;
  let isVerified = false;

  try {
    const { data: pref } = await supabase
      .from("preferences")
      .select("settings")
      .eq("user_id", studentId)
      .single();

    if (pref && pref.settings) {
      chatId = pref.settings.telegram_chat_id || null;
      username = pref.settings.telegram_username || null;
      isVerified = Boolean(pref.settings.telegram_verified && chatId);
    }
  } catch (err) {
    // Ignore error
  }

  // Also check students table
  try {
    const { data: student } = await supabase
      .from("students")
      .select("telegram_username, telegram_chat_id")
      .eq("id", studentId)
      .single();

    if (student) {
      if (!username) username = student.telegram_username || null;
      if (!chatId && student.telegram_chat_id) {
        chatId = student.telegram_chat_id;
        isVerified = true;
      }
    }
  } catch (err) {
    // Column might not exist yet; gracefully fallback
  }

  return {
    chatId,
    username,
    isVerified,
  };
}

/**
 * Links a student's Telegram chat_id and username in the database
 */
async function linkStudentTelegram(studentId, { chatId, username }) {
  const supabase = getClient();
  const numericChatId = String(chatId).trim();

  // 1. Store in preferences table (JSONB settings)
  try {
    const { data: currentPref } = await supabase
      .from("preferences")
      .select("settings")
      .eq("user_id", studentId)
      .single();

    const existingSettings = currentPref?.settings || {};
    const updatedSettings = {
      ...existingSettings,
      telegram_chat_id: numericChatId,
      telegram_username: username || existingSettings.telegram_username || null,
      telegram_verified: true,
      telegram_linked_at: new Date().toISOString(),
    };

    await supabase.from("preferences").upsert(
      {
        user_id: studentId,
        settings: updatedSettings,
      },
      { onConflict: "user_id" }
    );
  } catch (err) {
    console.error("Failed to save telegram to preferences:", err.message);
  }

  // 2. Also try updating students table directly if column exists
  try {
    const updatePayload = {
      telegram_chat_id: numericChatId,
    };
    if (username) updatePayload.telegram_username = username;

    await supabase.from("students").update(updatePayload).eq("id", studentId);
  } catch (err) {
    // If telegram_chat_id column does not exist yet, update username only
    if (username) {
      try {
        await supabase
          .from("students")
          .update({ telegram_username: username })
          .eq("id", studentId);
      } catch (innerErr) {
        // ignore
      }
    }
  }

  // 3. Log into automation_logs
  try {
    await supabase.from("automation_logs").insert({
      student_id: studentId,
      workflow_type: "notice_broadcast",
      status: "success",
      details: {
        action: "telegram_verified_and_linked",
        telegram_chat_id: numericChatId,
        telegram_username: username,
      },
    });
  } catch (err) {
    // ignore
  }

  return { success: true };
}

/**
 * Unlinks a student's Telegram connection
 */
async function unlinkStudentTelegram(studentId) {
  const supabase = getClient();

  try {
    const { data: currentPref } = await supabase
      .from("preferences")
      .select("settings")
      .eq("user_id", studentId)
      .single();

    if (currentPref && currentPref.settings) {
      const updatedSettings = { ...currentPref.settings };
      delete updatedSettings.telegram_chat_id;
      delete updatedSettings.telegram_username;
      delete updatedSettings.telegram_verified;
      delete updatedSettings.telegram_linked_at;

      await supabase
        .from("preferences")
        .update({ settings: updatedSettings })
        .eq("user_id", studentId);
    }
  } catch (err) {
    console.error("Error unlinking in preferences:", err.message);
  }

  try {
    await supabase
      .from("students")
      .update({ telegram_chat_id: null, telegram_username: null })
      .eq("id", studentId);
  } catch (err) {
    // ignore
  }

  return { success: true };
}

/**
 * Sends a Telegram message directly if bot token is provided
 */
async function sendDirectTelegramMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token === "placeholder") {
    return { success: false, message: "No active TELEGRAM_BOT_TOKEN configured" };
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      },
      { timeout: 8000 }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Telegram API sendMessage error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.description || error.message };
  }
}

module.exports = {
  generateLinkToken,
  resolveLinkToken,
  getStudentTelegram,
  linkStudentTelegram,
  unlinkStudentTelegram,
  sendDirectTelegramMessage,
};
