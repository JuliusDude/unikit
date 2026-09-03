const express = require("express");
const { getClient } = require("../services/supabase");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Security middleware to ensure only our n8n instance can call the webhooks
const n8nAuth = (req, res, next) => {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) {
    // If not configured, allow bypass for backwards dev compatibility, but warn
    console.warn("N8N_WEBHOOK_SECRET is not set in environment variables!");
    return next();
  }
  
  const providedSecret = req.headers['x-n8n-secret'];
  if (providedSecret !== secret) {
    return res.status(403).json({ message: "Forbidden: Invalid webhook secret" });
  }
  
  next();
};

// POST /api/groups/register - called by n8n group-register workflow
// Registers a Telegram group and returns an invite link
router.post("/register", n8nAuth, async (req, res) => {
  try {
    const { telegram_chat_id, name, sender_id } = req.body;

    if (!telegram_chat_id || !name) {
      return res.status(400).json({ message: "telegram_chat_id and name are required" });
    }

    const supabase = getClient();

    // Check if group already exists
    const { data: existing } = await supabase
      .from("telegram_groups")
      .select("*")
      .eq("telegram_chat_id", telegram_chat_id)
      .single();

    if (existing) {
      return res.json({
        group_id: existing.id,
        invite_link: existing.invite_link,
        message: "Group already registered",
      });
    }

    // Generate invite link (students visit this URL to join)
    const invite_link = `${FRONTEND_URL}/join?chat_id=${telegram_chat_id}`;

    // Ensure sender_id is treated as a string for robust storage
    const senderIdStr = sender_id ? String(sender_id) : null;

    const { data: group, error } = await supabase
      .from("telegram_groups")
      .insert({
        telegram_chat_id,
        name,
        invite_link,
        authorized_user_ids: senderIdStr ? [senderIdStr] : [],
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      group_id: group.id,
      invite_link: group.invite_link,
      message: "Group registered successfully",
    });
  } catch (error) {
    console.error("Group registration error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/groups/authorize - called by n8n to authorize new teachers (/conf-teachers)
router.post("/authorize", n8nAuth, async (req, res) => {
  try {
    const { chat_id, requestor_id, target_id } = req.body;
    if (!chat_id || !requestor_id || !target_id) {
      return res.status(400).json({ message: "chat_id, requestor_id, and target_id are required" });
    }

    const supabase = getClient();
    const { data: group, error: groupError } = await supabase
      .from("telegram_groups")
      .select("id, authorized_user_ids")
      .eq("telegram_chat_id", chat_id)
      .single();

    if (groupError || !group) return res.status(404).json({ message: "Group not found" });

    const authUsers = group.authorized_user_ids || [];
    const reqIdStr = String(requestor_id);
    const targetIdStr = String(target_id);

    if (authUsers.length > 0 && !authUsers.includes(reqIdStr)) {
      return res.status(403).json({ message: "Requestor is not an authorized teacher for this group." });
    }

    // Add target if not already there
    if (!authUsers.includes(targetIdStr)) {
      authUsers.push(targetIdStr);
      await supabase.from("telegram_groups").update({ authorized_user_ids: authUsers }).eq("id", group.id);
    }

    res.json({ message: "Teacher authorized successfully", authorized_user_ids: authUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/groups/by-chat-id - called by n8n ingestion workflow
// Looks up group_id by telegram_chat_id
router.get("/by-chat-id", n8nAuth, async (req, res) => {
  try {
    const { chat_id } = req.query;

    if (!chat_id) {
      return res.status(400).json({ message: "chat_id query parameter is required" });
    }

    const { data: group, error } = await getClient()
      .from("telegram_groups")
      .select("id, name, telegram_chat_id")
      .eq("telegram_chat_id", chat_id)
      .single();

    if (error || !group) {
      return res.status(404).json({ message: "Group not found for this chat_id" });
    }

    res.json({ group_id: group.id, name: group.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/groups/join - called by authenticated students from the invite link
// Links a student to a group
router.post("/join", authMiddleware, async (req, res) => {
  try {
    const { chat_id } = req.body;

    if (!chat_id) {
      return res.status(400).json({ message: "chat_id is required" });
    }

    const supabase = getClient();

    // Find the group
    const { data: group, error: groupError } = await supabase
      .from("telegram_groups")
      .select("id, name")
      .eq("telegram_chat_id", chat_id)
      .single();

    if (groupError || !group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", group.id)
      .eq("student_id", req.student.id)
      .single();

    if (existing) {
      return res.json({ message: "Already a member of this group", group_name: group.name });
    }

    // Add membership
    const { error: insertError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        student_id: req.student.id,
      });

    if (insertError) throw insertError;

    res.json({ message: "Successfully joined group", group_name: group.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/groups/my-groups - lists groups the current student belongs to
router.get("/my-groups", authMiddleware, async (req, res) => {
  try {
    const { data: memberships, error } = await getClient()
      .from("group_members")
      .select("group_id, telegram_groups(id, name, telegram_chat_id, created_at)")
      .eq("student_id", req.student.id);

    if (error) throw error;

    const groups = (memberships || []).map((m) => m.telegram_groups);
    res.json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/groups/events - Get all events/announcements for a student's groups
router.get("/events", authMiddleware, async (req, res) => {
  try {
    const supabase = getClient();
    
    // First find which groups the student is in
    const { data: memberships, error: memError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("student_id", req.student.id);

    if (memError) throw memError;
    
    if (!memberships || memberships.length === 0) {
      return res.json({ events: [] });
    }

    const groupIds = memberships.map(m => m.group_id);

    // Fetch events for those groups
    const { data: events, error: eventError } = await supabase
      .from("events")
      .select("*, telegram_groups(name)")
      .in("group_id", groupIds)
      .order("created_at", { ascending: false });

    if (eventError) throw eventError;

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/groups/webhook/message - n8n Webhook for processing telegram messages
router.post("/webhook/message", n8nAuth, async (req, res) => {
  try {
    const { chat_id, text, sender_name, sender_id } = req.body;
    
    if (!chat_id || !text) {
      return res.status(400).json({ message: "chat_id and text are required" });
    }

    const supabase = getClient();

    // 1. Find group by chat_id
    const { data: group, error: groupError } = await supabase
      .from("telegram_groups")
      .select("id, authorized_user_ids")
      .eq("telegram_chat_id", chat_id)
      .single();

    if (groupError || !group) {
      return res.status(404).json({ message: "Group not found for chat_id" });
    }

    const authUsers = group.authorized_user_ids || [];
    const senderIdStr = sender_id ? String(sender_id) : '';
    if (authUsers.length > 0 && !authUsers.includes(senderIdStr)) {
      return res.status(403).json({ message: "Ignored: Sender is not an authorized teacher." });
    }

    // 2. Extract Event via AI
    const { extractGroupEvent } = require("../services/groq");
    const extractedData = await extractGroupEvent(text);
    
    if (!extractedData) {
      // Not an announcement, just normal chat
      return res.json({ message: "Ignored: No academic event extracted." });
    }

    // 3. Save to database
    const { data: event, error: insertError } = await supabase
      .from("events")
      .insert({
        group_id: group.id,
        title: extractedData.title,
        event_date: extractedData.event_date,
        priority: extractedData.priority || "Medium",
        category: extractedData.category || "Other",
        raw_message: text,
        source: "telegram"
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 4. Trigger Calendar Fan-out asynchronously
    // Using local fetch to hit our own calendar fan-out endpoint
    const PORT = process.env.PORT || 4000;
    fetch(`http://localhost:${PORT}/api/calendar/fan-out`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: event.id })
    }).catch(err => console.error("Fan-out trigger failed:", err));

    res.status(201).json({
      message: "Event extracted and saved successfully",
      event
    });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
