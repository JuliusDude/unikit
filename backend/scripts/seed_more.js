require('dotenv').config({ path: __dirname + '/../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedMore() {
  const email = 'student@gmail.com';
  console.log(`Starting additional seed for ${email}...`);

  try {
    const { data: student } = await supabase.from('students').select('*').eq('email', email).single();
    
    if (!student) {
      console.log('Student not found. Please run seed.js first.');
      process.exit(1);
    }
    console.log(`Found student ID: ${student.id}`);

    // Clean old flashcards, quizzes, and notices to avoid duplicates
    console.log('Wiping old flashcards, quizzes, and notices...');
    await supabase.from('flashcard_decks').delete().eq('student_id', student.id);
    await supabase.from('quizzes').delete().eq('student_id', student.id);
    await supabase.from('notices').delete().eq('student_id', student.id);

    // Seed Notices
    const now = new Date();
    const notices = [
      {
        student_id: student.id,
        notice_text: "Final semester exams will commence from November 15th. Detailed timetable will be published shortly.",
        ai_summary: "Final exams start Nov 15. Timetable coming soon.",
        event_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_title: "Final Exams"
      },
      {
        student_id: student.id,
        notice_text: "The library will remain closed for maintenance on Friday. Please return all due books by Thursday evening.",
        ai_summary: "Library closed this Friday for maintenance.",
        event_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_title: "Library Maintenance"
      },
      {
        student_id: student.id,
        notice_text: "Attention all students: Registration for the annual cultural fest 'Zenith' is now open online.",
        ai_summary: "Registration for Zenith cultural fest is open.",
        event_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_title: "Zenith Registration"
      }
    ];
    await supabase.from('notices').insert(notices);
    console.log(`Seeded ${notices.length} notices.`);

    // Seed Flashcards
    const { data: deck, error: deckError } = await supabase
      .from('flashcard_decks')
      .insert({ student_id: student.id, title: "DBMS Normalization Concepts" })
      .select().single();
      
    if (deckError) throw deckError;

    const flashcards = [
      {
        deck_id: deck.id,
        front: "What is 1NF?",
        back: "First Normal Form ensures each table cell contains a single, indivisible value (atomicity) and each record is unique.",
        status: "unseen"
      },
      {
        deck_id: deck.id,
        front: "What is the requirement for 2NF?",
        back: "A table must be in 1NF and have no partial dependencies (no non-prime attribute depends on part of a candidate key).",
        status: "review"
      },
      {
        deck_id: deck.id,
        front: "What is Boyce-Codd Normal Form (BCNF)?",
        back: "A stricter version of 3NF where for every non-trivial functional dependency X → Y, X must be a superkey.",
        status: "mastered"
      }
    ];
    await supabase.from('flashcards').insert(flashcards);
    console.log(`Seeded 1 flashcard deck with ${flashcards.length} cards.`);

    // Seed MCQs (Quiz)
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        student_id: student.id,
        title: "Operating Systems Fundamentals",
        total_questions: 3,
        score: null // not yet attempted
      })
      .select().single();

    if (quizError) throw quizError;

    const quizQuestions = [
      {
        quiz_id: quiz.id,
        question: "Which of the following scheduling algorithms is non-preemptive?",
        options: JSON.stringify(["Round Robin", "Shortest Job First (Non-preemptive)", "Completely Fair Scheduler", "Shortest Remaining Time First"]),
        correct_index: 1,
        explanation: "In Non-preemptive SJF, once a process starts its execution, it cannot be interrupted until it completes."
      },
      {
        quiz_id: quiz.id,
        question: "What is a Translation Lookaside Buffer (TLB)?",
        options: JSON.stringify(["A cache for the page table", "A component of the ALU", "A type of hard drive memory", "A scheduling queue"]),
        correct_index: 0,
        explanation: "A TLB is a memory cache that stores recent translations of virtual memory to physical addresses to speed up retrieval."
      },
      {
        quiz_id: quiz.id,
        question: "Which concept refers to a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process?",
        options: JSON.stringify(["Starvation", "Deadlock", "Mutual Exclusion", "Synchronization"]),
        correct_index: 1,
        explanation: "This is the exact definition of a Deadlock in operating systems."
      }
    ];
    await supabase.from('quiz_questions').insert(quizQuestions);
    console.log(`Seeded 1 quiz with ${quizQuestions.length} questions.`);

    console.log('\n✅ Additional seeding complete! Flashcards, MCQs, and Notices are ready.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedMore();
