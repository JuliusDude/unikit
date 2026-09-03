"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ReactLenis } from 'lenis/react';
import { 
  CalendarClock,
  Sparkles,
  BarChart3,
  ArrowRight,
  ChevronDown,
  Zap,
  CheckCircle,
  Bell,
  GraduationCap,
  Menu,
  X,
  FileText,
  AlertTriangle,
  Send,
  Bot,
  TrendingUp,
  Shield,
  MessageSquare,
  CheckSquare,
  Calendar,
  LayoutDashboard,
Plus, Minus } from "lucide-react";
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
              : "bg-transparent border-transparent py-4 px-2"
          }`}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <img src="/logo-ukit.png" alt="UniKit Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-xl font-bold font-serif text-foreground tracking-tight">UniKit</span>
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

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
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
            className="text-[clamp(3.05rem,5.05vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.03em] text-foreground font-serif text-balance"
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
              className="inline-flex min-h-12 items-center gap-2 bg-primary px-7 text-[15px] leading-none font-semibold text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.16)] transition-all duration-200 ease-out hover:opacity-90 hover:shadow-[0_2px_7px_rgba(0,0,0,0.18)] rounded-[10px]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#modules"
              className="inline-flex min-h-12 items-center gap-2 bg-secondary px-7 text-[15px] leading-none font-semibold text-secondary-foreground transition-all duration-200 ease-out hover:opacity-80 rounded-[10px]"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
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
            <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-serif leading-[1.1] font-medium tracking-tight text-foreground">
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
                      <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">Active</span>
                      <span className="bg-muted rounded-md px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Synced</span>
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
          
          <h2 className="text-[clamp(2.2rem,3.5vw,3rem)] font-serif leading-[1.1] font-medium tracking-tight text-foreground text-balance mx-auto">
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
                <div className="bg-background flex min-h-[160px] flex-col justify-center rounded-[20px] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-border/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
                  <div className="flex items-start gap-3 relative z-10">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-2 w-full">
                      <div className="h-2.5 bg-muted rounded-full w-[85%]" />
                      <div className="h-2.5 bg-muted rounded-full w-[60%]" />
                      <div className="h-2.5 bg-muted rounded-full w-[75%]" />
                    </div>
                  </div>
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
          <h2 className="text-[clamp(2.2rem,3.5vw,3rem)] font-serif leading-[1.1] font-medium tracking-tight text-foreground text-balance mx-auto mb-4">
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
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo-ukit.png" alt="UniKit Logo" className="w-6 h-6 object-contain" />
              <span className="text-lg font-bold text-foreground">UniKit</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered student hub for deadline management
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#modules" className="text-sm text-muted-foreground hover:text-foreground transition-standard">Features</Link></li>
              <li><Link href="#ai-features" className="text-sm text-muted-foreground hover:text-foreground transition-standard">AI Tools</Link></li>
              <li><Link href="#why-us" className="text-sm text-muted-foreground hover:text-foreground transition-standard">Why Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com/ArrinPaul/Hackathon" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-standard">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-standard">Sign In</Link></li>
              <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-standard">Get Started</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2025 UniKit. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-standard">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-standard">Terms</a>
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
