const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getClient } = require("../services/supabase");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const { data: existing } = await getClient()
      .from("students")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, branch, year, subjects } = req.body;

    if (!name || !email || !password || !branch || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { data: existing } = await getClient()
      .from("students")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data: student, error } = await getClient()
      .from("students")
      .insert({
        name,
        email,
        password_hash,
        branch,
        year,
        subjects: subjects || [],
      })
      .select("id, name, email, branch, year, telegram_username, subjects, created_at")
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, student });
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { data: student, error } = await getClient()
      .from("students")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, student.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password_hash, ...studentData } = student;
    res.json({ token, student: studentData });
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (req.student.id === "00000000-0000-0000-0000-000000000000") {
      return res.json({ student: req.student });
    }

    const { data: student, error } = await getClient()
      .from("students")
      .select("id, name, email, branch, year, telegram_username, subjects, created_at")
      .eq("id", req.student.id)
      .single();

    if (error || !student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch profile" });
  }
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, branch, year, subjects } = req.body;

    const { data: student, error } = await getClient()
      .from("students")
      .update({ name, branch, year, subjects })
      .eq("id", req.student.id)
      .select("id, name, email, branch, year, telegram_username, subjects, created_at")
      .single();

    if (error) throw error;
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
});

router.delete("/me", authMiddleware, async (req, res) => {
  try {
    const supabase = getClient();
    const studentId = req.student.id;

    // Delete student. Assuming ON DELETE CASCADE is set for tasks, preferences, enrollments.
    // If not, we manually delete dependencies first to be safe.
    await supabase.from("preferences").delete().eq("user_id", studentId);
    await supabase.from("tasks").delete().eq("student_id", studentId);
    await supabase.from("group_enrollments").delete().eq("student_id", studentId);
    await supabase.from("automation_logs").delete().eq("student_id", studentId);
    await supabase.from("flashcards_decks").delete().eq("student_id", studentId);
    await supabase.from("quizzes").delete().eq("student_id", studentId);
    
    // Finally, delete the student record
    const { error } = await supabase.from("students").delete().eq("id", studentId);
    
    if (error) throw error;

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error.message);
    res.status(500).json({ message: error.message || "Failed to delete account" });
  }
});

module.exports = router;
