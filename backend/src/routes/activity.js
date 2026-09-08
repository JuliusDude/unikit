const express = require("express");
const { getClient } = require("../services/supabase");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

// Helper function to get today's date as YYYY-MM-DD
const getLocalDateString = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

router.post("/ping", async (req, res) => {
  try {
    const supabase = getClient();
    const studentId = req.student.id;
    
    // Fetch preferences
    let { data: pref, error: fetchError } = await supabase
      .from("preferences")
      .select("settings")
      .eq("user_id", studentId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
      throw fetchError;
    }

    let settings = pref ? pref.settings : {};
    if (typeof settings !== 'object' || settings === null) {
      settings = {};
    }

    const todayStr = getLocalDateString();
    const lastActive = settings.last_active_date;
    let currentStreak = settings.current_streak || 0;

    if (lastActive !== todayStr) {
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      settings.last_active_date = todayStr;
      settings.current_streak = currentStreak;

      // Upsert preferences
      const { error: upsertError } = await supabase
        .from("preferences")
        .upsert(
          { user_id: studentId, settings },
          { onConflict: 'user_id' }
        );

      if (upsertError) throw upsertError;
    }

    res.json({ streak: currentStreak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/focus", async (req, res) => {
  try {
    const { minutes } = req.body;
    if (typeof minutes !== 'number' || minutes <= 0) {
      return res.status(400).json({ message: "Valid minutes are required" });
    }

    const supabase = getClient();
    const studentId = req.student.id;

    let { data: pref, error: fetchError } = await supabase
      .from("preferences")
      .select("settings")
      .eq("user_id", studentId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let settings = pref ? pref.settings : {};
    if (typeof settings !== 'object' || settings === null) {
      settings = {};
    }

    settings.total_focus_minutes = (settings.total_focus_minutes || 0) + minutes;

    const { error: upsertError } = await supabase
      .from("preferences")
      .upsert(
        { user_id: studentId, settings },
        { onConflict: 'user_id' }
      );

    if (upsertError) throw upsertError;

    res.json({ total_focus_minutes: settings.total_focus_minutes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const supabase = getClient();
    const studentId = req.student.id;

    const { data: pref, error } = await supabase
      .from("preferences")
      .select("settings")
      .eq("user_id", studentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const settings = (pref && pref.settings) || {};
    const currentStreak = settings.current_streak || 0;
    const totalFocusMinutes = settings.total_focus_minutes || 0;
    const totalHours = (totalFocusMinutes / 60).toFixed(1);

    res.json({ 
      streak: currentStreak, 
      totalHours: totalHours
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
