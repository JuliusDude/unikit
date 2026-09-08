const express = require("express");
const { getClient } = require("../services/supabase");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const supabase = getClient();
    const studentId = req.student.id;

    // Fetch tasks
    const { data: tasks, error: taskError } = await supabase
      .from("tasks")
      .select("status, deadline")
      .eq("student_id", studentId);
    if (taskError) throw taskError;

    // Fetch attendance
    const { data: attendance, error: attError } = await supabase
      .from("attendance")
      .select("attended_classes, total_classes")
      .eq("student_id", studentId);
    if (attError) throw attError;

    // Fetch quizzes
    const { data: quizzes, error: quizError } = await supabase
      .from("quizzes")
      .select("id")
      .eq("student_id", studentId);
    if (quizError) throw quizError;

    // Fetch flashcards via decks
    const { data: decks, error: deckError } = await supabase
      .from("flashcard_decks")
      .select("id")
      .eq("student_id", studentId);
    if (deckError) throw deckError;

    let masteredFlashcardsCount = 0;
    if (decks && decks.length > 0) {
      const deckIds = decks.map(d => d.id);
      const { data: flashcards, error: fcError } = await supabase
        .from("flashcards")
        .select("id")
        .in("deck_id", deckIds)
        .eq("status", "mastered");
      if (fcError) throw fcError;
      masteredFlashcardsCount = flashcards ? flashcards.length : 0;
    }

    // Calculations
    const now = new Date();
    let completedTasks = 0;
    let earlyBirds = 0;
    tasks.forEach(t => {
      if (t.status === "completed") {
        completedTasks++;
        if (new Date(t.deadline) > now) {
          earlyBirds++;
        }
      }
    });

    let totalAttended = 0;
    let totalClasses = 0;
    attendance.forEach(a => {
      totalAttended += a.attended_classes || 0;
      totalClasses += a.total_classes || 0;
    });
    const attendancePct = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
    const quizzesCount = quizzes ? quizzes.length : 0;

    // Badges array
    const badges = [
      {
        id: "task_master",
        name: "Task Master",
        description: "Complete 10 tasks",
        target: 10,
        progress: Math.min(completedTasks, 10),
        earned: completedTasks >= 10
      },
      {
        id: "task_legend",
        name: "Task Legend",
        description: "Complete 50 tasks",
        target: 50,
        progress: Math.min(completedTasks, 50),
        earned: completedTasks >= 50
      },
      {
        id: "early_bird",
        name: "Early Bird",
        description: "Complete 3 tasks before deadline",
        target: 3,
        progress: Math.min(earlyBirds, 3),
        earned: earlyBirds >= 3
      },
      {
        id: "attendance_hero",
        name: "Attendance Hero",
        description: "Maintain 75% overall attendance",
        target: 75,
        progress: Math.min(Math.round(attendancePct), 75),
        earned: attendancePct >= 75 && totalClasses > 0
      },
      {
        id: "quiz_ace",
        name: "Quiz Ace",
        description: "Create 3 quizzes",
        target: 3,
        progress: Math.min(quizzesCount, 3),
        earned: quizzesCount >= 3
      },
      {
        id: "memory_master",
        name: "Memory Master",
        description: "Master 20 flashcards",
        target: 20,
        progress: Math.min(masteredFlashcardsCount, 20),
        earned: masteredFlashcardsCount >= 20
      },
      {
        id: "top_performer",
        name: "Top Performer",
        description: "Complete 20 tasks and maintain 80% attendance",
        target: 100,
        progress: Math.min(100, Math.round((Math.min(completedTasks, 20) / 20 * 50) + (Math.min(attendancePct, 80) / 80 * 50))),
        earned: completedTasks >= 20 && attendancePct >= 80
      }
    ];

    const earnedBadgesCount = badges.filter(b => b.earned).length;

    // XP Calc
    // 10 per completed task, 50 per mastered quiz, 5 per mastered flashcard, 200 per earned badge.
    // Wait, the prompt says "50 per mastered quiz". But since we only have created quizzes, let's use created quizzes for the XP calculation as specified by "Let's just count how many quizzes the user created, i.e., total quizzes" in the prompt.
    const xp = (completedTasks * 10) + (quizzesCount * 50) + (masteredFlashcardsCount * 5) + (earnedBadgesCount * 200);

    // Level Calc
    const level = Math.floor(xp / 1000) + 1;
    const currentLevelXp = xp % 1000;
    const maxXp = 1000;

    let title = "Freshman";
    if (level === 2) title = "Sophomore";
    else if (level === 3) title = "Scholar";
    else if (level === 4) title = "Dean's List";
    else if (level >= 5) title = "Academic Legend";

    res.json({
      xp,
      level,
      title,
      currentLevelXp,
      maxXp,
      stats: {
        completedTasks,
        earlyBirds,
        attendancePct: Math.round(attendancePct),
        quizzesCreated: quizzesCount,
        flashcardsMastered: masteredFlashcardsCount
      },
      badges
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
