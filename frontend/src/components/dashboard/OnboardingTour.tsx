"use client";

import { useEffect, useState, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { HelpCircle } from "@untitledui/icons";

export function OnboardingTour() {
  const [mounted, setMounted] = useState(false);
  const tourStarted = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    // Auto-start on first visit
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour && !tourStarted.current) {
      tourStarted.current = true;
      const timer = setTimeout(() => {
        startTour();
      }, 1000); // Wait for animations to settle
      
      return () => clearTimeout(timer);
    }
  }, []);

  const driverRef = useRef<any>(null);

  const startTour = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      popoverClass: 'driverjs-theme', // We can style this globally
      steps: [
        { 
          element: '#tour-tasks', 
          popover: { 
            title: 'Stay on Track', 
            description: 'Manage your upcoming deadlines here. Click any task to expand it into a detailed view!', 
            side: "left", align: 'start' 
          }
        },
        { 
          element: '#tour-calendar', 
          popover: { 
            title: 'Your Academic Hub', 
            description: 'This interactive calendar syncs automatically with all your tasks and college notices.', 
            side: "right", align: 'start' 
          }
        },
        {
          element: '#tour-attendance',
          popover: {
            title: 'Track Attendance',
            description: 'Log your classes here to get real-time, AI-powered risk assessments on skipping.',
            side: "top", align: 'start'
          }
        },
        {
          element: '#tour-quick-actions',
          popover: {
            title: 'AI Magic',
            description: 'Instantly generate AI flashcards, practice quizzes, and study schedules right from here.',
            side: "top", align: 'start'
          }
        },
        { 
          element: '#tour-timer', 
          popover: { 
            title: 'Build Habits', 
            description: 'Use our Pomodoro timer to study. Completed sessions sync directly to your daily Study Streak!', 
            side: "top", align: 'start' 
          }
        },
        { 
          element: '#tour-achievements', 
          popover: { 
            title: 'Unlock Badges', 
            description: 'Earn XP, level up, and unlock beautiful badges as you complete tasks and ace exams.', 
            side: "left", align: 'start' 
          }
        },
      ],
      onDestroyStarted: () => {
        localStorage.setItem("hasSeenTour", "true");
        if (driverObj.hasNextStep() || !driverObj.hasNextStep()) {
            driverObj.destroy();
        }
        driverRef.current = null;
      }
    });

    driverRef.current = driverObj;
    driverObj.drive();
  };

  if (!mounted) return null;

  return (
    <button
      onClick={startTour}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      title="Take a Tour"
    >
      <HelpCircle className="w-6 h-6" />
    </button>
  );
}
