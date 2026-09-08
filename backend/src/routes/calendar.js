const express = require("express");
const { getClient } = require("../services/supabase");
const { getValidAccessToken, createCalendarEvent } = require("../services/google");

const router = express.Router();

// POST /api/calendar/fan-out — called by n8n ingestion workflow after event is saved
// Creates Google Calendar events for all group members who have calendar connected
router.post("/fan-out", async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ message: "event_id is required" });
    }

    const supabase = getClient();

    // Fetch the event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find all students in this group
    const { data: members, error: membersError } = await supabase
      .from("group_members")
      .select("student_id")
      .eq("group_id", event.group_id);

    if (membersError) throw membersError;

    if (!members || members.length === 0) {
      return res.json({
        message: "No group members found",
        synced: 0,
        failed: 0,
      });
    }

    let synced = 0;
    let failed = 0;

    // Create calendar event for each member with Google Calendar connected
    for (const member of members) {
      try {
        const accessToken = await getValidAccessToken(member.student_id);
        if (!accessToken) {
          // Student doesn't have Google Calendar connected — skip
          continue;
        }

        const eventDate = new Date(event.event_date);
        await createCalendarEvent(accessToken, {
          summary: `[${event.category || "Deadline"}] ${event.title}`,
          description: `Priority: ${event.priority || "Medium"}\nCategory: ${event.category || "Other"}\n\nOriginal message: ${event.raw_message || "N/A"}\n\nSynced via CampusFlow NotifyMe`,
          start: {
            date: event.event_date, // All-day event (event_date is DATE, not DATETIME)
          },
          end: {
            date: new Date(eventDate.getTime() + 86400000).toISOString().split("T")[0],
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "popup", minutes: 1440 }, // 1 day before
              { method: "popup", minutes: 60 },   // 1 hour before
            ],
          },
        });

        synced++;
      } catch (calErr) {
        console.error(`Calendar sync failed for student ${member.student_id}:`, calErr.message);
        failed++;
      }
    }

    // Log the fan-out result
    await supabase.from("automation_logs").insert({
      student_id: members[0].student_id, // Log under first member for visibility
      workflow_type: "deadline_reminder",
      status: failed === 0 ? "success" : "triggered",
      details: {
        event_id,
        event_title: event.title,
        total_members: members.length,
        synced,
        failed,
      },
    });

    res.json({
      message: "Calendar fan-out complete",
      synced,
      failed,
      total_members: members.length,
    });
  } catch (error) {
    console.error("Calendar fan-out error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

function formatIcsDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// GET /api/calendar/feed/:student_id
// Generates an iCal (.ics) feed that users can subscribe to in Google/Apple Calendar without OAuth
router.get("/feed/:student_id", async (req, res) => {
  try {
    const { student_id } = req.params;
    const supabase = getClient();

    // Fetch personal tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("student_id", student_id);
      
    if (tasksError) throw tasksError;

    // Fetch group events for this student
    const { data: members } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("student_id", student_id);

    let groupEvents = [];
    if (members && members.length > 0) {
      const groupIds = members.map((m) => m.group_id);
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .in("group_id", groupIds);
      if (events) groupEvents = events;
    }

    let icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//UniKit//CampusFlow//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:UniKit Deadlines",
      "X-WR-TIMEZONE:UTC",
    ];

    // Add Tasks
    (tasks || []).forEach((t) => {
      const dtStart = formatIcsDate(t.deadline);
      const dtEnd = formatIcsDate(new Date(new Date(t.deadline).getTime() + 3600000));
      icsLines.push(
        "BEGIN:VEVENT",
        `UID:task-${t.id}@unikit.app`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:[Task] ${t.title || "Untitled"}`,
        `DESCRIPTION:${t.subject || ""}\\n${t.description || ""}`,
        "END:VEVENT"
      );
    });

    // Add Group Events
    (groupEvents || []).forEach((e) => {
      // event_date is YYYY-MM-DD
      const start = e.event_date.replace(/-/g, "");
      // calculate next day for all day event
      const d = new Date(e.event_date);
      d.setDate(d.getDate() + 1);
      const end = d.toISOString().split("T")[0].replace(/-/g, "");
      
      icsLines.push(
        "BEGIN:VEVENT",
        `UID:event-${e.id}@unikit.app`,
        `DTSTAMP:${formatIcsDate(new Date())}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:[Notice] ${e.title || "Class Event"}`,
        `DESCRIPTION:Priority: ${e.priority || "Medium"}\\nCategory: ${e.category || "Other"}\\n\\n${e.raw_message || ""}`,
        "END:VEVENT"
      );
    });

    icsLines.push("END:VCALENDAR");

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="unikit-calendar.ics"`);
    res.send(icsLines.join("\r\n"));
  } catch (error) {
    console.error("Calendar feed error:", error.message);
    res.status(500).send("Error generating calendar feed");
  }
});

module.exports = router;
