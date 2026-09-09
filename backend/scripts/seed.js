require('dotenv').config({ path: __dirname + '/../.env' });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  const email = 'student@gmail.com';
  console.log(`Starting seed for ${email}...`);

  try {
    let { data: student } = await supabase.from('students').select('*').eq('email', email).single();
    
    if (!student) {
      console.log('Student not found, creating one...');
      const password_hash = await bcrypt.hash('password123', 10);
      const { data, error } = await supabase.from('students').insert({
        name: 'Alex Mercer',
        email: email,
        password_hash,
        branch: 'Computer Science',
        year: 3,
        subjects: ['DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering'],
        telegram_username: '@alex_m'
      }).select().single();
      
      if (error) throw error;
      student = data;
    } else {
      console.log('Student already exists. Wiping old data to provide a clean showcase...');
      await supabase.from('tasks').delete().eq('student_id', student.id);
      await supabase.from('notices').delete().eq('student_id', student.id);
      await supabase.from('attendance').delete().eq('student_id', student.id);
      await supabase.from('group_members').delete().eq('student_id', student.id);
    }

    console.log(`Student ID: ${student.id}`);

    const { data: groups } = await supabase.from('telegram_groups').select('*').limit(1);
    let groupId = null;
    if (groups && groups.length > 0) {
      groupId = groups[0].id;
      console.log(`Found group: ${groups[0].name}. Joining...`);
      await supabase.from('group_members').insert({
        group_id: groupId,
        student_id: student.id
      });
      
      await supabase.from('events').delete().eq('group_id', groupId);
      
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const events = [
        {
          group_id: groupId,
          title: "Hackathon Registration Deadline",
          event_date: tomorrow.toISOString(),
          priority: "High",
          category: "Extracurricular",
          raw_message: "Reminder: Registration for the upcoming WebDev Hackathon closes tomorrow!",
          source: "telegram"
        },
        {
          group_id: groupId,
          title: "Guest Lecture: AI in Healthcare",
          event_date: nextWeek.toISOString(),
          priority: "Medium",
          category: "Seminar",
          raw_message: "Join us next week for a seminar on AI in Healthcare by Dr. Smith.",
          source: "telegram"
        }
      ];
      await supabase.from('events').insert(events);
      console.log(`Seeded ${events.length} group events.`);
    }

    const now = new Date();
    const todayTask = new Date(now);
    todayTask.setHours(now.getHours() + 4);
    
    const tomorrowTask = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeekTask = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const completedTask = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const tasks = [
      {
        student_id: student.id,
        title: "DBMS Assignment 2",
        subject: "DBMS",
        description: "Complete ER diagrams and normalization queries for the library management system.",
        deadline: todayTask.toISOString(),
        status: "pending"
      },
      {
        student_id: student.id,
        title: "Operating Systems Lab Record",
        subject: "Operating Systems",
        description: "Submit the physical record book with printouts for scheduling algorithms.",
        deadline: tomorrowTask.toISOString(),
        status: "pending"
      },
      {
        student_id: student.id,
        title: "Software Engineering Proposal",
        subject: "Software Engineering",
        description: "Draft the initial SRS document for the final year project.",
        deadline: nextWeekTask.toISOString(),
        status: "pending"
      },
      {
        student_id: student.id,
        title: "Computer Networks Quiz",
        subject: "Computer Networks",
        description: "Cover chapters 3 and 4 (Transport layer).",
        deadline: completedTask.toISOString(),
        status: "completed"
      }
    ];

    await supabase.from('tasks').insert(tasks);
    console.log(`Seeded ${tasks.length} tasks.`);

    const notices = [
      {
        student_id: student.id,
        notice_text: "Please note that the deadline for submitting original certificates for scholarship verification is exactly 5 days from today. Late submissions will absolutely not be entertained under any circumstances.",
        ai_summary: "Submit original certificates for scholarship within 5 days.",
        event_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        event_title: "Scholarship Verification"
      },
      {
        student_id: student.id,
        notice_text: "Due to heavy rainfall forecast, all physical classes are suspended for tomorrow. Online classes will proceed as per schedule.",
        ai_summary: "Physical classes suspended tomorrow due to rain. Online classes continue.",
        event_date: tomorrowTask.toISOString().split('T')[0],
        event_title: "Weather Alert: Classes Suspended"
      }
    ];

    await supabase.from('notices').insert(notices);
    console.log(`Seeded ${notices.length} notices.`);

    const attendance = [
      { student_id: student.id, subject: "DBMS", total_classes: 24, attended_classes: 19 },
      { student_id: student.id, subject: "Operating Systems", total_classes: 22, attended_classes: 20 },
      { student_id: student.id, subject: "Computer Networks", total_classes: 20, attended_classes: 14 },
      { student_id: student.id, subject: "Software Engineering", total_classes: 25, attended_classes: 23 }
    ];

    await supabase.from('attendance').insert(attendance);
    console.log(`Seeded ${attendance.length} attendance records.`);

    console.log('\n✅ Seeding complete! student@gmail.com is ready for showcase.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
