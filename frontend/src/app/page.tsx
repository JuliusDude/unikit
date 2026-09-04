"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ReactLenis } from 'lenis/react';
import { AlertTriangle, ArrowRight, ArrowUpRight, BarChart01 as BarChart3, Bell01 as Bell, Calendar, CalendarCheck01 as CalendarClock, CheckCircle, CheckSquare, ChevronDown, FaceSmile as Bot, File04 as FileText, GraduationHat01 as GraduationCap, LayoutGrid01 as LayoutDashboard, Lightning01 as Zap, Menu01 as Menu, MessageSquare01 as MessageSquare, Minus, Plus, Send01 as Send, Shield01 as Shield, Stars01 as Sparkles, TrendUp01 as TrendingUp, XClose as X } from "@untitledui/icons";
import { useAuth } from "@/hooks/useAuth";
import { HandwritingText } from "@/components/ui/handwriting-text";

function Header() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 pointer-events-none">
      <div className="max-w-5xl mx-auto flex items-center justify-center">
        <div 
          className={`pointer-events-auto flex items-center justify-between w-full rounded-2xl border transition-all duration-300 ${
            scrolled 
              ? "bg-background/90 backdrop-blur-md border-border shadow-lg shadow-black/5 py-3 px-6" 
              : "bg-transparent border-transparent py-4 px-6"
          }`}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary shadow-sm flex items-center justify-center">
              <img src="/logo-ukit.png" alt="UniKit Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground tracking-tight">UniKit</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#modules" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#ai-features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">AI Tools</Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-[12px] hover:opacity-90 transition-opacity shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
function TelegramMockup() {
  const [messages, setMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      // Loop sequence
      while (isMounted) {
        setMessages(0);
        setIsTyping(false);
        
        await new Promise(r => setTimeout(r, 1000));
        if (!isMounted) break;
        setIsTyping(true);
        
        await new Promise(r => setTimeout(r, 1200));
        if (!isMounted) break;
        setIsTyping(false);
        setMessages(1); // Bot alert
        
        await new Promise(r => setTimeout(r, 2000));
        if (!isMounted) break;
        setMessages(2); // User: "Yes please"
        
        await new Promise(r => setTimeout(r, 800));
        if (!isMounted) break;
        setIsTyping(true);
        
        await new Promise(r => setTimeout(r, 2000));
        if (!isMounted) break;
        setIsTyping(false);
        setMessages(3); // Bot summary
        
        await new Promise(r => setTimeout(r, 6000)); // Wait before looping
      }
    };
    sequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-[300px] xl:w-[320px] rounded-[32px] border-[6px] border-border/40 bg-background/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] shadow-primary/5 flex flex-col overflow-hidden relative">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[22px] bg-border/40 rounded-b-2xl z-20"></div>
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-muted/20 pt-8 z-10 relative">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold text-sm text-foreground leading-tight">UniKit Bot</div>
          <div className="text-xs text-primary font-medium leading-tight">bot</div>
        </div>
      </div>
      
      {/* Chat Body */}
      <div className="p-4 flex flex-col gap-4 h-[420px] relative bg-muted/5 z-10">
        <AnimatePresence>
          {messages >= 1 && (
            <motion.div
              key="msg1"
              initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: 'top left' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="self-start bg-muted/80 text-foreground px-4 py-2.5 rounded-[18px] rounded-tl-sm text-sm max-w-[85%] leading-relaxed shadow-sm border border-border/30"
            >
              ⚠️ <b className="font-semibold">Heads up!</b> Database Assignment 3 is due in 3 hours. Do you want me to summarize the requirements?
            </motion.div>
          )}
          
          {messages >= 2 && (
            <motion.div
              key="msg2"
              initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: 'top right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="self-end bg-primary text-primary-foreground px-4 py-2.5 rounded-[18px] rounded-tr-sm text-sm shadow-sm"
            >
              Yes please
            </motion.div>
          )}
          
          {messages >= 3 && (
            <motion.div
              key="msg3"
              initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: 'top left' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="self-start bg-muted/80 text-foreground px-4 py-3 rounded-[18px] rounded-tl-sm text-sm max-w-[90%] leading-relaxed shadow-sm border border-border/30 space-y-2"
            >
              <p className="font-medium text-foreground">Here is the AI summary:</p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Use PostgreSQL</li>
                <li>Minimum 3 joins required</li>
                <li>Submit on Moodle by 11:59 PM</li>
              </ul>
            </motion.div>
          )}
          
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: 'top left' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="self-start bg-muted/80 px-4 py-3.5 rounded-[18px] rounded-tl-sm shadow-sm border border-border/30 flex items-center gap-1.5"
            >
              <motion.div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
              <motion.div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden min-h-[85vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        {/* Subtle glowing orbs */}
        <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-3xl" />
        
        {/* Watermelon-inspired linear gradient overlays */}
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background)/0.94)_0%,hsl(var(--background)/0.76)_34%,hsl(var(--background)/0.2)_66%,hsl(var(--background)/0.03)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.72)_0%,hsl(var(--background)/0.04)_42%,hsl(var(--background)/0.12)_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-8 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
          }}
          className="max-w-[640px] flex flex-col items-start text-left"
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', duration: 0.72, bounce: 0 } }
            }}
            className="text-[clamp(3.05rem,5.05vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.03em] text-foreground tracking-tight text-balance"
          >
            Your Smart Campus
            <br />
            <HandwritingText
              words={["Workflow Suite.", "Task Manager.", "Notice Board.", "Study Buddy."]}
              className="text-primary"
              height="1.15em"
            />
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', duration: 0.72, bounce: 0 } }
            }}
            className="mt-8 max-w-[480px] text-[clamp(1rem,1.2vw,1.18rem)] leading-[1.42] font-medium text-pretty text-muted-foreground backdrop-blur-[1px]"
          >
            UniKit unifies deadlines, attendance, notices, and AI tools so your academic life
            moves from chaos to clarity — automatically.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', duration: 0.72, bounce: 0 } }
            }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center gap-2 bg-primary px-7 text-base leading-none font-semibold text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.16)] transition-all duration-200 ease-out hover:opacity-90 hover:shadow-[0_2px_7px_rgba(0,0,0,0.18)] rounded-[10px]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#modules"
              className="inline-flex min-h-12 items-center gap-2 bg-secondary px-7 text-base leading-none font-semibold text-secondary-foreground transition-all duration-200 ease-out hover:opacity-80 rounded-[10px]"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: Telegram Mockup */}
        <div className="hidden lg:flex justify-end items-center relative w-full h-full perspective-[1000px]">
          <motion.div 
            animate={{ y: [-8, 8, -8] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotateX: 5, rotateY: -10, rotateZ: 2 }}
            className="relative drop-shadow-2xl origin-center"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full" />
            <TelegramMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const modules = [
  {
    id: "deadlines",
    icon: CalendarClock,
    label: "Deadlines",
    title: "Smart Deadlines",
    description: "Create tasks and get automatic Telegram reminders before your deadlines. Never miss an assignment again.",
    color: "bg-primary",
    iconBg: "bg-primary",
    items: [
      "Automatic Telegram reminders before deadlines",
      "Google Calendar sync for every task",
      "Recurring task support for weekly assignments",
      "Priority-based alerts for urgent deadlines",
    ],
  },
  {
    id: "attendance",
    icon: BarChart3,
    label: "Attendance",
    title: "Attendance Tracker",
    description: "Track attendance per subject and get risk alerts before it's too late. Stay above the threshold.",
    color: "bg-secondary",
    iconBg: "bg-green-500",
    items: [
      "Per-subject attendance tracking",
      "Risk alerts before threshold drops",
      "Visual progress charts and trends",
      "Semester-wide attendance overview",
    ],
  },
  {
    id: "notices",
    icon: FileText,
    label: "Notices",
    title: "AI Notice Summarizer",
    description: "Paste any college notice and get a 3-bullet AI summary in seconds. Save time reading long announcements.",
    color: "bg-blue-500",
    iconBg: "bg-blue-500",
    items: [
      "Instant AI-powered summaries",
      "Key deadline extraction from notices",
      "Action item detection and highlighting",
      "Searchable notice archive",
    ],
  },
  
];

function Modules() {
  const [active, setActive] = useState("deadlines");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const activeModule = modules.find((m) => m.id === active)!;

  return (
    <section id="modules" ref={ref} className="bg-background w-full min-h-screen flex items-center py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[20%] -left-[5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:px-8 lg:grid-cols-2 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] tracking-tight leading-[1.1] font-medium tracking-tight text-foreground">
              Run your campus life, <br/>not just your tasks
            </h2>
            <p className="text-muted-foreground max-w-lg mt-4 text-lg">
              Coordinate deadlines, track attendance, and process notices without constant manual input or switching between tools.
            </p>
          </div>

          <div className="space-y-2">
            {modules.map((mod) => {
              const isActive = active === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActive(mod.id)}
                  onMouseEnter={() => setActive(mod.id)}
                  className={`w-full flex items-start gap-4 rounded-xl p-4 transition-all duration-200 text-left ${
                    isActive ? "bg-muted shadow-sm ring-1 ring-border" : "hover:bg-muted/50"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 text-primary"}`}>
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {mod.title}
                    </div>
                    <div className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      {mod.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-muted dark:bg-card/50 relative flex items-center justify-center rounded-[24px] p-8 shadow-[inset_0_0px_6px_rgba(0,0,0,0.08)] min-h-[500px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-sm"
            >
              <div className="bg-background/90 dark:bg-card/80 ring-1 ring-border/50 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${activeModule.iconBg} flex items-center justify-center shadow-inner`}>
                    <activeModule.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{activeModule.label}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium uppercase tracking-wider">Active</span>
                      <span className="bg-muted rounded-md px-2 py-0.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Synced</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">Execution Flow</div>
                  {activeModule.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-muted/40 p-3 rounded-lg border border-border/50">
                      <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm font-medium text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

const aiFeatures = [
  {
    icon: Bot,
    title: "AI Notice Summarizer",
    description: "Paste any college notice and get a 3-bullet AI summary in seconds. Never read a full notice again.",
    color: "bg-primary",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: AlertTriangle,
    title: "Attendance Risk Alerts",
    description: "AI predicts when you're at risk of falling below attendance threshold and alerts you proactively.",
    color: "bg-secondary",
    gradient: "from-secondary to-secondary/60",
  },
  {
    icon: Send,
    title: "Telegram Auto-Reminders",
    description: "Smart scheduling sends reminders at the perfect time before deadlines so you're never caught off guard.",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-blue-400",
  },
  {
    icon: TrendingUp,
    title: "Smart Priority Scoring",
    description: "AI ranks your tasks by urgency and importance automatically, so you always know what to tackle first.",
    color: "bg-amber-500",
    gradient: "from-amber-500 to-amber-400",
  },
];

function AIFeatureCard({ feature, index }: { feature: typeof aiFeatures[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group bg-white rounded-[10px] shadow-lg hover:shadow-xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out h-[280px] flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <feature.icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </h3>
        <div className="relative overflow-hidden flex-1">
          <div
            className={`transition-all duration-500 ease-in-out ${
              hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
              {feature.description}
            </p>
          </div>
          {!hovered && (
            <div className="h-5" />
          )}
        </div>
      </div>
    </div>
  );
}


function AIFeatureVisual({ title }: { title: string }) {
  if (title === "AI Notice Summarizer") {
    return (
      <div className="flex flex-col gap-3 w-full relative z-10 h-full">
        {/* Before (Messy Notice) */}
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: [1, 1, 0, 0, 1], y: [0, 0, -10, 10, 0], scale: [1, 1, 0.95, 0.95, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col justify-center gap-2.5"
        >
          <div className="h-1.5 bg-muted-foreground/30 rounded-full w-[95%]" />
          <div className="h-1.5 bg-muted-foreground/30 rounded-full w-[100%]" />
          <div className="h-1.5 bg-muted-foreground/30 rounded-full w-[80%]" />
          <div className="h-1.5 bg-muted-foreground/30 rounded-full w-[90%]" />
          <div className="h-1.5 bg-muted-foreground/30 rounded-full w-[85%]" />
        </motion.div>
        
        {/* After (Clean Summary) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -10], scale: [0.95, 0.95, 1, 1, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col justify-center gap-3.5 bg-background"
        >
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div className="h-2 bg-primary/70 rounded-full w-[80%] mt-1" />
          </div>
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div className="h-2 bg-primary/70 rounded-full w-[60%] mt-1" />
          </div>
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div className="h-2 bg-primary/70 rounded-full w-[75%] mt-1" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (title === "Attendance Risk Alerts") {
    return (
      <div className="relative flex items-center justify-center w-full h-full z-10">
        {/* Donut Chart */}
        <svg className="w-24 h-24 transform -rotate-90 drop-shadow-sm">
          <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/50" />
          <motion.circle 
            cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray="226" 
            strokeLinecap="round"
            animate={{ 
              strokeDashoffset: [226 - (226 * 0.85), 226 - (226 * 0.74), 226 - (226 * 0.85)], 
              stroke: ['#22c55e', '#ef4444', '#22c55e'] 
            }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            animate={{ color: ['#22c55e', '#ef4444', '#22c55e'] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-lg font-bold tracking-tight"
          >
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute">85%</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>74%</motion.span>
          </motion.span>
        </div>
        
        {/* Alert Badge */}
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8], y: [15, -5, 15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1 -right-4 bg-red-500 text-white text-xs tracking-wide font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1"
        >
          <AlertTriangle className="w-2.5 h-2.5" />
          RISK
        </motion.div>
      </div>
    );
  }

  if (title === "Telegram Auto-Reminders") {
    return (
      <div className="relative flex items-center justify-center w-full h-full z-10 perspective-[800px]">
        <motion.div 
          animate={{ y: [15, -5, 15], opacity: [0, 1, 0], rotateX: [10, 0, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[190px] bg-background border border-border/80 rounded-[14px] rounded-bl-sm p-3.5 shadow-xl shadow-blue-500/5 relative"
        >
          <div className="absolute -left-1.5 bottom-0 w-3 h-3 bg-background border-b border-l border-border/80 rounded-bl-sm" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}></div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Send className="w-3 h-3 text-blue-500 -ml-0.5" />
            </div>
            <span className="text-xs font-semibold text-foreground">UniKit Bot</span>
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            <strong className="text-foreground font-semibold">Reminder:</strong> DB Assignment is due in 2 hours!
          </p>
        </motion.div>
      </div>
    );
  }

  if (title === "Smart Priority Scoring") {
    return (
      <div className="relative flex flex-col gap-2 w-full h-full justify-center z-10 px-1">
        <motion.div 
          animate={{ y: [0, 42, 0], scale: [1, 0.98, 1], zIndex: [10, 20, 10], opacity: [1, 0.6, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-background border border-border p-3 rounded-[10px] flex items-center justify-between shadow-sm relative"
        >
          <span className="text-xs font-medium text-foreground">Math Homework</span>
          <span className="text-xs tracking-wide font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">LOW</span>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -42, 0], scale: [1, 1.05, 1], zIndex: [20, 10, 20], boxShadow: ["0px 2px 4px rgba(0,0,0,0.05)", "0px 10px 20px rgba(245, 158, 11, 0.15)", "0px 2px 4px rgba(0,0,0,0.05)"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-amber-500/5 border border-amber-500/30 p-3 rounded-[10px] flex items-center justify-between shadow-md relative bg-background"
        >
          <span className="text-xs font-medium text-foreground">DB Assignment</span>
          <span className="text-xs tracking-wide font-bold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" /> URGENT
          </span>
        </motion.div>
      </div>
    );
  }

  return null;
}

function AIFeatures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="ai-features" ref={ref} className="min-h-screen flex items-center py-24 bg-background relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          
          <h2 className="text-[clamp(2.2rem,3.5vw,3rem)] tracking-tight leading-[1.1] font-medium tracking-tight text-foreground text-balance mx-auto">
            Smart tools that amplify<br />your productivity
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-muted/30 flex h-full flex-col rounded-[24px] border border-border overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-4 p-6">
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-inner mb-2`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-foreground text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto p-4 pt-0">
                <div className="bg-background flex h-[160px] flex-col justify-center rounded-[20px] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-border/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
                  <AIFeatureVisual title={feature.title} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
const comparisons = [
  { feature: "Tool Management", traditional: "Multiple disconnected tools with separate logins", UniKit: "Single platform with integrated modules", icon: LayoutDashboard },
  { feature: "Context Switching", traditional: "Constant switching between apps disrupts focus", UniKit: "Seamless workflow with everything in one place", icon: Zap },
  { feature: "Reminders", traditional: "Manual calendar entries and phone alarms", UniKit: "Automatic Telegram alerts before deadlines", icon: Bell },
  { feature: "Notice Processing", traditional: "Read entire long documents manually", UniKit: "AI-powered 3-bullet summaries in seconds", icon: FileText },
  { feature: "Attendance Tracking", traditional: "Manual spreadsheet tracking and guesswork", UniKit: "Real-time per-subject risk alerts", icon: BarChart3 },
];

function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="why-us" ref={ref} className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] -right-[5%] w-[25%] h-[25%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[30%] -left-[5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-[10px] mb-4">
            <Shield className="w-3.5 h-3.5" />
            WHY UniKit?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Less Context Switching
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Stop juggling multiple apps. UniKit puts everything you need in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-[10px] border border-border p-6 shadow-sm mb-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[10px] bg-destructive/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-foreground">The Old Way</h3>
              </div>
              <div className="space-y-4">
                {comparisons.map((row, i) => (
                  <motion.div
                    key={row.feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-[10px] bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-white border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <row.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">{row.feature}</p>
                      <p className="text-sm text-muted-foreground">{row.traditional}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-[10px] border-2 border-primary/20 p-6 shadow-lg shadow-primary/5 mb-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">The UniKit Way</h3>
              </div>
              <div className="space-y-4">
                {comparisons.map((row, i) => (
                  <motion.div
                    key={row.feature}
                    initial={{ opacity: 0, x: 10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-[10px] bg-primary/5 border border-primary/10"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <row.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">{row.feature}</p>
                      <p className="text-sm text-primary font-medium">{row.UniKit}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-[10px] p-8 text-center border border-primary/10"
        >
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">5+</p>
              <p className="text-sm text-muted-foreground">Tools Replaced</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">1</p>
              <p className="text-sm text-muted-foreground">Platform</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Context Switches</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReplaceTools() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const tools = [
    { name: "Google Calendar", icon: Calendar },
    { name: "Excel Sheets", icon: FileText },
    { name: "Manual Reminders", icon: Bell },
    { name: "Notice Boards", icon: LayoutDashboard },
    { name: "WhatsApp Groups", icon: MessageSquare },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Replace Multiple Tools with{" "}
            <span className="text-primary">UniKit</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            One platform to rule them all. Stop paying for five different apps.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 w-full">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="bg-white border border-border rounded-[10px] p-4 flex items-center gap-3 opacity-50 hover:opacity-70 transition-opacity"
              >
                <div className="w-10 h-10 rounded-[10px] bg-muted flex items-center justify-center shrink-0">
                  <tool.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-muted-foreground line-through decoration-primary/40">{tool.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
            className="shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <ArrowRight className="w-7 h-7 text-white lg:rotate-0 rotate-90" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex-1 w-full"
          >
            <div className="bg-white border-2 border-primary/20 rounded-[10px] p-6 shadow-lg shadow-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                  <img src="/logo-ukit.png" alt="UniKit Logo" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">UniKit</h3>
                  <p className="text-sm text-primary font-medium">All-in-one student hub</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["Deadlines", "Attendance", "Notices", "AI Tools", "Telegram"].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


const faqs = [
  { question: "Is UniKit completely free?", answer: "Yes! UniKit is free for students during our public beta. We want to ensure every student has access to these tools without barriers." },
  { question: "How does the Telegram bot work?", answer: "We connect directly to your college notice groups. Our AI reads the incoming messages and sends you a 3-bullet summary instantly." },
  { question: "Can I manage multiple subjects?", answer: "Absolutely. You can track attendance, deadlines, and tasks for as many subjects as you need in one centralized dashboard." },
  { question: "Is my data secure?", answer: "Your data is encrypted and securely stored. We never share your personal information or academic data with third parties." }
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="faq" ref={ref} className="py-24 bg-background relative border-t border-border/40">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(2.2rem,3.5vw,3rem)] tracking-tight leading-[1.1] font-medium tracking-tight text-foreground text-balance mx-auto mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the platform.
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-border/60 rounded-2xl overflow-hidden bg-background/50 transition-colors hover:bg-muted/20"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-lg text-foreground pr-8">{faq.question}</span>
                <span className="text-muted-foreground shrink-0">
                  {openIdx === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary via-primary to-secondary rounded-[10px] p-10 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Start Building with UniKit Today
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
              Join students across India who never miss a deadline. Get started for free during our public beta and experience the full platform at no cost.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-primary bg-white rounded-full hover:bg-white/90 transition-standard shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-white border border-white/30 rounded-[10px] hover:bg-white/10 transition-standard"
              >
                Learn More
              </a>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/5 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary shadow-sm flex items-center justify-center">
                <img src="/logo-ukit.png" alt="UniKit Logo" className="w-6 h-6 object-contain drop-shadow-sm" />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">UniKit</span>
            </Link>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed mb-6">
              Your distraction-free campus productivity platform. Unifying deadlines, tasks, and AI tools into one seamless workflow.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/JuliusDude/unikit" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all duration-300 shadow-sm" aria-label="GitHub Repository">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="#modules" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Features</Link></li>
              <li><Link href="#ai-features" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Smart Tools</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Student Dashboard</Link></li>
              <li><Link href="/dashboard/whiteboard" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Whiteboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li><a href="https://github.com/JuliusDude/unikit" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors flex items-center gap-1.5">Source Code <ArrowUpRight className="w-3.5 h-3.5" /></a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Documentation</a></li>
              <li><Link href="#faq" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Help & FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors">Create Account</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} UniKit. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Modules />
          <AIFeatures />
          
          <ReplaceTools />
            <FAQ />
            <CTA />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}

