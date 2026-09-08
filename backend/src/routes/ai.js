const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const authMiddleware = require("../middleware/auth");
const {
  getStudyTip,
  attendanceAlert,
  chatResponse,
  generateFlashcards,
  generateQuiz,
  gradeShortAnswer,
  executeSmartTool
} = require("../services/groq");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.post("/parse-document", authMiddleware, upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No document provided" });
    }

    const file = req.file;
    const extension = file.originalname.split('.').pop().toLowerCase();
    
    let text = "";
    
    if (extension === 'pdf') {
      const pdfData = await pdfParse(file.buffer);
      text = pdfData.text;
    } else if (['txt', 'md', 'csv', 'json'].includes(extension)) {
      text = file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ message: "Unsupported file type. Please upload a PDF or text file." });
    }
    
    res.json({ text });
  } catch (error) {
    console.error("Document parse error:", error);
    res.status(500).json({ message: "Failed to parse document" });
  }
});


router.get("/tip", async (req, res) => {
  try {
    const tip = await getStudyTip();
    res.json({ tip });
  } catch (error) {
    res.json({ tip: "Take regular breaks while studying!" });
  }
});

router.post("/attendance-alert", authMiddleware, async (req, res) => {
  try {
    const { subject, total, attended, threshold } = req.body;

    if (!subject || total === undefined || attended === undefined) {
      return res.status(400).json({ message: "Subject, total, and attended are required" });
    }

    const result = await attendanceAlert(subject, total, attended, threshold);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array is required" });
    }
    const reply = await chatResponse(messages);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/flashcards", authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes) {
      return res.status(400).json({ message: "Notes content is required" });
    }
    const flashcards = await generateFlashcards(notes);
    res.json({ flashcards });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to generate flashcards" });
  }
});

router.post("/quiz", authMiddleware, async (req, res) => {
  try {
    const { notes, count, type } = req.body;
    if (!notes) {
      return res.status(400).json({ message: "Notes content is required" });
    }
    const questions = await generateQuiz(notes, count, type || "mcq");
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to generate quiz" });
  }
});

router.post("/grade-short-answer", authMiddleware, async (req, res) => {
  try {
    const { question, modelAnswer, userAnswer } = req.body;
    if (!question || !modelAnswer || userAnswer === undefined) {
      return res.status(400).json({ message: "Question, modelAnswer, and userAnswer are required" });
    }
    const result = await gradeShortAnswer(question, modelAnswer, userAnswer);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to grade short answer response" });
  }
});

router.post("/tool/:toolSlug", authMiddleware, async (req, res) => {
  try {
    const { toolSlug } = req.params;
    const { content, options } = req.body;
    if (!content && toolSlug !== 'study-schedule') {
      return res.status(400).json({ message: "Content input is required" });
    }
    const result = await executeSmartTool(toolSlug, content, options);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to execute smart tool" });
  }
});

module.exports = router;
