require('dotenv').config({ path: __dirname + '/../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seedEvenMore() {
  const email = 'student@gmail.com';
  console.log(`Starting even more seed for ${email}...`);

  try {
    const { data: student } = await supabase.from('students').select('*').eq('email', email).single();
    
    if (!student) {
      console.log('Student not found.');
      process.exit(1);
    }

    // --- DECK 2 ---
    const { data: deck2 } = await supabase
      .from('flashcard_decks')
      .insert({ student_id: student.id, title: "Computer Networks: Transport Layer" })
      .select().single();

    const flashcards2 = [
      { deck_id: deck2.id, front: "What is the main difference between TCP and UDP?", back: "TCP is connection-oriented and reliable, while UDP is connectionless and does not guarantee delivery.", status: "unseen" },
      { deck_id: deck2.id, front: "What is a Three-way Handshake?", back: "The process used by TCP to set up a logical connection. SYN -> SYN-ACK -> ACK.", status: "review" },
      { deck_id: deck2.id, front: "What is the function of port numbers?", back: "Port numbers identify specific processes or services running on a host machine.", status: "mastered" },
      { deck_id: deck2.id, front: "Explain Flow Control in TCP.", back: "It prevents a fast sender from overwhelming a slow receiver, typically using a sliding window protocol.", status: "unseen" }
    ];
    await supabase.from('flashcards').insert(flashcards2);
    
    // --- DECK 3 ---
    const { data: deck3 } = await supabase
      .from('flashcard_decks')
      .insert({ student_id: student.id, title: "Software Engineering Models" })
      .select().single();

    const flashcards3 = [
      { deck_id: deck3.id, front: "What is the Waterfall Model?", back: "A linear sequential design approach where progress flows downwards through phases like requirements, design, implementation, testing, and deployment.", status: "unseen" },
      { deck_id: deck3.id, front: "Define Agile Methodology.", back: "An iterative approach to software delivery that builds software incrementally instead of trying to deliver it all at once near the end.", status: "unseen" },
      { deck_id: deck3.id, front: "What is a Scrum Sprint?", back: "A short, time-boxed period when a scrum team works to complete a set amount of work, usually 1-4 weeks.", status: "unseen" }
    ];
    await supabase.from('flashcards').insert(flashcards3);

    console.log("Seeded 2 more flashcard decks.");

    // --- QUIZ 2 ---
    const { data: quiz2 } = await supabase
      .from('quizzes')
      .insert({
        student_id: student.id,
        title: "DBMS SQL Queries & Joins",
        total_questions: 3,
        score: null
      })
      .select().single();

    const quizQuestions2 = [
      {
        quiz_id: quiz2.id,
        question: "Which JOIN returns all rows from the left table, and the matched rows from the right table?",
        options: JSON.stringify(["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"]),
        correct_index: 1,
        explanation: "A LEFT JOIN returns all records from the left table and matched records from the right. If there is no match, the result is NULL on the right side."
      },
      {
        quiz_id: quiz2.id,
        question: "Which SQL statement is used to remove a table's data but keep its structure?",
        options: JSON.stringify(["DROP TABLE", "DELETE TABLE", "TRUNCATE TABLE", "REMOVE TABLE"]),
        correct_index: 2,
        explanation: "TRUNCATE TABLE deletes all rows from a table and frees the space, but keeps the table structure intact."
      },
      {
        quiz_id: quiz2.id,
        question: "What does the GROUP BY statement do?",
        options: JSON.stringify(["Sorts the result set in ascending order", "Groups rows that have the same values into summary rows", "Filters records based on a condition", "Joins two tables together"]),
        correct_index: 1,
        explanation: "GROUP BY is often used with aggregate functions (COUNT, MAX, MIN, SUM, AVG) to group the result set by one or more columns."
      }
    ];
    await supabase.from('quiz_questions').insert(quizQuestions2);

    // --- QUIZ 3 ---
    const { data: quiz3 } = await supabase
      .from('quizzes')
      .insert({
        student_id: student.id,
        title: "Web Architecture Basics",
        total_questions: 2,
        score: null
      })
      .select().single();

    const quizQuestions3 = [
      {
        quiz_id: quiz3.id,
        question: "What is the primary role of a Load Balancer?",
        options: JSON.stringify(["To store relational data", "To distribute incoming network traffic across multiple servers", "To encrypt data in transit", "To serve static files like CSS and Images"]),
        correct_index: 1,
        explanation: "Load balancers distribute traffic across multiple servers to ensure no single server becomes overwhelmed, improving responsiveness and availability."
      },
      {
        quiz_id: quiz3.id,
        question: "In the context of APIs, what does REST stand for?",
        options: JSON.stringify(["Representational State Transfer", "Remote Execution System Technology", "Reactive State Transport", "Robust Entity Stateful Transfer"]),
        correct_index: 0,
        explanation: "REST stands for Representational State Transfer, which is a software architectural style for web services."
      }
    ];
    await supabase.from('quiz_questions').insert(quizQuestions3);

    console.log("Seeded 2 more quizzes.");

    // --- MORE NOTICES ---
    const now = new Date();
    const notices = [
      {
        student_id: student.id,
        notice_text: "Hostel fee payment window is now open. Last date to pay without late fee is the end of this month.",
        ai_summary: "Hostel fees due by the end of the month.",
        event_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_title: "Hostel Fee Deadline"
      },
      {
        student_id: student.id,
        notice_text: "Campus placement drive by Google will be held on campus next week. All eligible final and pre-final year students must carry 2 copies of their resume.",
        ai_summary: "Google placement drive next week. Bring 2 resumes.",
        event_date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_title: "Google Placement Drive"
      }
    ];
    await supabase.from('notices').insert(notices);
    console.log("Seeded 2 more notices.");

    console.log('\n✅ 2-3 extra sets generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedEvenMore();
