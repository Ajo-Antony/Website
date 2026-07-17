"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Shield, 
  Cpu, 
  Layers, 
  MessageSquare, 
  ChevronDown, 
  Clock, 
  Lock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
  Sun,
  Moon
} from "lucide-react";
import { createBooking, getPublicBookedSlots } from "@/lib/actions/bookings";
import { ChapterScrubber } from "@/components/ui/chapter-scrubber";

const BOOKING_STEPS_CHAPTERS = [
  {
    id: "step-1",
    title: "Basic Info",
    description: "Enter your personal credentials and company details to get started.",
    meta: "Step 01",
  },
  {
    id: "step-2",
    title: "Requirements",
    description: "Describe the custom workflows, target solutions, and budget.",
    meta: "Step 02",
  },
  {
    id: "step-3",
    title: "Date & Time",
    description: "Choose a convenient slot on our live system architect calendar.",
    meta: "Step 03",
  },
];

const CAPABILITIES_CHAPTERS = [
  {
    id: "workflows",
    title: "Custom Multi-Agent Workflows",
    description: "Cognitive architectures, decision-tree networks, and autonomous agents engineered for high-accuracy operations.",
    meta: "Capabilities",
  },
  {
    id: "whatsapp",
    title: "Enterprise WhatsApp Ecosystems",
    description: "Headless WhatsApp systems synced with secure databases to automate checkout, queries, and ticketing at scale.",
    meta: "Capabilities",
  },
  {
    id: "databases",
    title: "Legacy Database Integrations",
    description: "Safely bridge legacy data tables (ERP, SAP, Postgres) with live LLM contexts with absolute row-level security.",
    meta: "Capabilities",
  },
  {
    id: "why-meet-1",
    title: "Zero Junior Sales Reps",
    description: "Speak directly with StrixMind core developers and architects who understand database schemas and cognitive chains.",
    meta: "Why Meet Us?",
  },
  {
    id: "why-meet-2",
    title: "Concrete Blueprint",
    description: "Leave the call with a technical layout of your custom automated pipeline and database integration map.",
    meta: "Why Meet Us?",
  },
  {
    id: "why-meet-3",
    title: "Compliant Architecture",
    description: "Fully private VPC, on-prem option, and zero data logging policies to satisfy strict financial audits.",
    meta: "Why Meet Us?",
  },
  {
    id: "ctos",
    title: "Enterprise CTOs",
    description: "Scale complex workflows, reduce server load, and integrate secure private models in your VPC.",
    meta: "Who It's For",
  },
  {
    id: "founders",
    title: "SaaS Founders",
    description: "Automate customer support loops, business events, onboarding steps, and scale unit margins.",
    meta: "Who It's For",
  },
];

// Custom type definitions for the form state
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companySize: string;
  customSolution: string;
  budget: string;
  projectDetails: string;
  selectedDate: string;
  selectedTime: string;
}

const COMPANY_SIZE_OPTIONS = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const SOLUTION_OPTIONS = [
  "Multi-Agent AI Workflows",
  "WhatsApp Automated Support",
  "Custom CRM & Lead Intelligence",
  "Enterprise LLM Fine-Tuning",
  "Legacy Database Integration",
  "Strategic AI Roadmap",
];

const BUDGET_OPTIONS = [
  "₹1,00,000 - ₹3,00,000",
  "₹3,00,000 - ₹10,00,000",
  "₹10,00,000 - ₹25,00,000",
  "₹25,00,000+",
];

const TIME_SLOTS = [
  "10:00 AM IST",
  "11:30 AM IST",
  "02:00 PM IST",
  "03:30 PM IST",
  "05:00 PM IST",
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BookMeetingPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    companySize: "",
    customSolution: "",
    budget: "",
    projectDetails: "",
    selectedDate: "",
    selectedTime: "",
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  
  // Accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Custom states for theme switching and capabilities flow
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeCapIndex, setActiveCapIndex] = useState<number>(0);

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1); // avoid rollover
    return d;
  });

  // Fetch already booked slots on mount
  useEffect(() => {
    async function loadBookedSlots() {
      try {
        const slots = await getPublicBookedSlots();
        setBookedSlots(slots);
      } catch (err) {
        console.error("Error loading booked slots:", err);
      }
    }
    loadBookedSlots();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectOption = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.companyName.trim() || !formData.companySize) {
        setErrorMsg("Please fill in all basic company and contact details.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrorMsg("Please enter a valid work email address.");
        return;
      }
    }

    if (activeStep === 2) {
      if (!formData.customSolution || !formData.budget || !formData.projectDetails.trim()) {
        setErrorMsg("Please share your solution requirements, budget, and project details.");
        return;
      }
    }

    setErrorMsg("");
    setActiveStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    setActiveStep((prev) => prev - 1);
  };

  const getFormattedDateStr = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayName = DAYS_OF_WEEK[dateObj.getDay()];
    const monthName = MONTHS_SHORT[dateObj.getMonth()];
    const dateNum = dateObj.getDate();
    return `${dayName}, ${monthName} ${dateNum}`;
  };

  const isSlotBooked = (dateStr: string, timeSlot: string) => {
    const dateFormatted = getFormattedDateStr(dateStr);
    const slotString = `${dateFormatted} @ ${timeSlot}`;
    return bookedSlots.includes(slotString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedDate || !formData.selectedTime) {
      setErrorMsg("Please pick a date and time slot for your call.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const chosenDateFormatted = getFormattedDateStr(formData.selectedDate);
    const slotString = `${chosenDateFormatted} @ ${formData.selectedTime}`;

    try {
      const result = await createBooking({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        slot: slotString,
        company: formData.companyName,
        size: formData.companySize,
        goal: `[Custom AI Solution Consultation]\nSolution Needed: ${formData.customSolution}\nBudget Range: ${formData.budget}\nProject Details: ${formData.projectDetails}`,
      });

      if (result.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(result.error || "Something went wrong while booking. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to submit request. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calendar grid math
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y: number, m: number) => new Date(y, m, 1).getDay(); // 0 = Sun, 1 = Mon, etc.

  const totalDays = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayIndex(year, month);
  
  const blankCells = Array(firstDayIdx).fill(null);
  const dayCells = Array.from({ length: totalDays }, (_, i) => i + 1);
  const allCells = [...blankCells, ...dayCells];

  const handlePrevMonth = () => {
    const today = new Date();
    // Don't allow navigating past current month
    if (year === today.getFullYear() && month <= today.getMonth()) return;
    
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const isDayDisabled = (dayNum: number | null) => {
    if (dayNum === null) return true;
    const dateObj = new Date(year, month, dayNum);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    
    // Disable past and today
    if (dateObj.getTime() <= today.getTime()) {
      return true;
    }
    // Disable Sunday (0)
    if (dateObj.getDay() === 0) {
      return true;
    }
    return false;
  };

  const handleDaySelect = (dayNum: number) => {
    if (isDayDisabled(dayNum)) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, selectedDate: dateStr, selectedTime: "" }));
  };

  const faqs = [
    {
      q: "What happens after I book?",
      a: "Our core engineering team and founders will immediately review your submission to understand your system requirements. You will receive a direct Google Meet calendar invite within 2 hours of booking, along with an initial agenda.",
    },
    {
      q: "Do you sign NDAs before the call?",
      a: "Absolutely. For enterprise projects and proprietary workflows, we can execute a mutual NDA prior to discussing sensitive architecture details. Simply specify this in your project details.",
    },
    {
      q: "What is your typical engagement model?",
      a: "We work on a custom milestones-based consulting agreement. We map the scope, design complete system specifications, deploy a secure sandbox environment on your cloud, and provide continuous SLA-backed engineering support.",
    },
    {
      q: "Do you support on-premise deployments?",
      a: "Yes. Many of our enterprise and fintech clients in India run our AI Agent systems and custom LLMs in virtual private clouds (AWS VPC, GCP, Azure) or completely on-premise due to strict local security mandates.",
    },
  ];

  return (
    <div 
      id="book-meeting-view" 
      className={`min-h-screen font-sans antialiased overflow-hidden relative pb-20 transition-colors duration-500 ${
        isDarkMode 
          ? "bg-[#0a0a0a] text-[#f5f5f5]" 
          : "bg-[#faf8f4] text-[#1e293b]"
      }`}
    >
      
      {/* Decorative Atmosphere Neon Radial Glows */}
      {isDarkMode ? (
        <>
          <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[800px] h-[800px] bg-[#5eead4]/10 rounded-full blur-[200px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-[#0d9488]/5 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[800px] h-[800px] bg-[#7c3aed]/5 rounded-full blur-[200px] pointer-events-none" />
        </>
      )}



      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        
        {/* Navigation Back Link */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors no-underline group ${
              isDarkMode ? "text-[#5eead4] hover:text-[#5eead4]/80" : "text-[#0d9488] hover:text-[#0d9488]/80"
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* 1. HERO HEADER SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase mb-6 shadow-sm backdrop-blur-sm ${
              isDarkMode 
                ? "bg-emerald-950/20 border-emerald-500/30 text-[#5eead4]" 
                : "bg-teal-50 border-teal-200 text-[#0d9488]"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 animate-pulse ${isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"}`} />
            StrixMind Consulting & Enterprise
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight font-sans ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Co-Engineer Your{" "}
            <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode 
                ? "from-[#5eead4] via-[#a78bfa] to-[#f59e6b]" 
                : "from-[#0d9488] via-[#7c3aed] to-[#f59e6b]"
            }`}>
              AI Future
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Book a dedicated strategic mapping call with our elite AI solution architects. No sales pitches — just deep system engineering, workflow audits, and custom scaling models built for your company.
          </motion.p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-8">
          
          {/* Left Column: Interactive Capabilities Flow Effect */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-1 ${
                isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"
              }`}>
                Our Enterprise Capabilities
              </h3>
              <h2 className={`text-2xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                StrixMind Core Architecture
              </h2>
              <p className={`text-xs mt-1 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                Hover, scrub, or tap the interactive vertical scrubber to trace our workflows, blueprints, and specific target solution blueprints.
              </p>
            </div>

            <div className="flex gap-6 items-start">
              {/* Interactive Scrubber Timeline */}
              <div className="shrink-0 pt-2">
                <ChapterScrubber
                  chapters={CAPABILITIES_CHAPTERS}
                  currentIndex={activeCapIndex}
                  side="right"
                  peakLength={48}
                  restLength={12}
                  rowHeight={18}
                  radius={3}
                  showCard={false}
                  onActiveChange={(chapter, index) => {
                    if (index >= 0) {
                      setActiveCapIndex(index);
                    }
                  }}
                  onSelect={(chapter, index) => {
                    setActiveCapIndex(index);
                  }}
                />
              </div>

              {/* Dynamic Interactive Detail Card (The Flow Effect) */}
              <div className="flex-1 min-h-[380px] sm:min-h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCapIndex}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25 }}
                    className={`p-6 rounded-2xl border flex flex-col gap-5 relative overflow-hidden transition-all ${
                      isDarkMode 
                        ? "bg-[#121212]/95 border-white/10 shadow-[0_0_24px_rgba(94,234,212,0.06)] text-white" 
                        : "bg-white border-slate-200/80 shadow-md shadow-slate-200/40 text-slate-900"
                    }`}
                  >
                    {/* Inner decorative light glow */}
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-colors ${
                      isDarkMode ? "bg-[#5eead4]/5" : "bg-[#0d9488]/5"
                    }`} />

                    <div className="flex items-center justify-between gap-4">
                      <span className={`text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase border ${
                        isDarkMode 
                          ? "bg-[#5eead4]/10 text-[#5eead4] border-[#5eead4]/20" 
                          : "bg-[#0d9488]/10 text-[#0d9488] border-[#0d9488]/20"
                      }`}>
                        {CAPABILITIES_CHAPTERS[activeCapIndex].meta}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${
                        isDarkMode ? "text-slate-500" : "text-slate-400"
                      }`}>
                        Stage 0{activeCapIndex + 1} / 0{CAPABILITIES_CHAPTERS.length}
                      </span>
                    </div>

                    <div>
                      <h4 className={`text-lg font-bold mb-2.5 leading-snug tracking-tight ${
                        isDarkMode ? "text-[#f5f5f5]" : "text-slate-900"
                      }`}>
                        {CAPABILITIES_CHAPTERS[activeCapIndex].title}
                      </h4>
                      <p className={`text-xs leading-relaxed ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                        {CAPABILITIES_CHAPTERS[activeCapIndex].description}
                      </p>
                    </div>

                    {/* Rich contextual insights per stage */}
                    <div className={`mt-auto pt-4 border-t flex flex-col gap-3 ${
                      isDarkMode ? "border-white/5 text-slate-400" : "border-slate-100 text-slate-500"
                    }`}>
                      {activeCapIndex < 3 ? (
                        <div className="flex items-start gap-2.5 text-[11px] leading-normal">
                          <Cpu className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"}`} />
                          <span>
                            Production-grade microservices integrated directly with low-latency LLMs, enterprise APIs, and webhooks.
                          </span>
                        </div>
                      ) : activeCapIndex >= 3 && activeCapIndex < 6 ? (
                        <div className="flex items-start gap-2.5 text-[11px] leading-normal">
                          <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? "text-[#a78bfa]" : "text-[#7c3aed]"}`} />
                          <span>
                            Enterprise protection layer, full row-level isolation, Mutual NDA execution, and secure transit algorithms.
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 text-[11px] leading-normal">
                          <Layers className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? "text-[#f59e6b]" : "text-[#7c3aed]"}`} />
                          <span>
                            Engineered for CTOs and SaaS founders seeking to minimize server load, drop support ticket density, and scale margins.
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* QUICK HIGHLIGHTS METRICS */}
            <div className={`p-5 rounded-2xl border ${
              isDarkMode ? "bg-indigo-950/10 border-indigo-500/10" : "bg-teal-50/50 border-teal-200/50"
            }`}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h5 className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>100%</h5>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Direct Engineers</p>
                </div>
                <div className="border-x border-slate-700/20">
                  <h5 className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>VPC</h5>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Secure Deploy</p>
                </div>
                <div>
                  <h5 className={`text-lg font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Zero</h5>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Data Logging</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form Scheduler with Interactive Step Scrubber */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-8 items-start w-full">
            
            {/* Interactive Step Scrubber for desktop navigation */}
            <div className={`hidden xl:flex flex-col items-center gap-4 sticky top-32 shrink-0 py-6 px-4 border rounded-3xl backdrop-blur-md shadow-lg min-w-[96px] ${
              isDarkMode 
                ? "bg-slate-900/30 border-white/5" 
                : "bg-white border-slate-200/80 shadow-md shadow-slate-100/50"
            }`}>
              <div className={`text-[10px] font-extrabold tracking-wider uppercase mb-2 ${
                isDarkMode ? "text-slate-500" : "text-slate-400"
              }`}>
                Flow
              </div>
              <ChapterScrubber
                chapters={BOOKING_STEPS_CHAPTERS}
                currentIndex={activeStep - 1}
                side="left"
                peakLength={60}
                restLength={18}
                rowHeight={20}
                radius={3}
                showCard={false}
                onSelect={(chapter, index) => {
                  const targetStep = index + 1;
                  if (targetStep < activeStep) {
                    setActiveStep(targetStep);
                  } else if (targetStep === activeStep) {
                    // Do nothing
                  } else {
                    // Moving forward: run basic step verification
                    if (activeStep === 1) {
                      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.companyName.trim() || !formData.companySize) {
                        setErrorMsg("Please fill in all basic company and contact details.");
                        return;
                      }
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                        setErrorMsg("Please enter a valid work email address.");
                        return;
                      }
                    }
                    if (activeStep === 2 && targetStep === 3) {
                      if (!formData.customSolution || !formData.budget || !formData.projectDetails.trim()) {
                        setErrorMsg("Please share your solution requirements, budget, and project details.");
                        return;
                      }
                    }
                    setErrorMsg("");
                    setActiveStep(targetStep);
                  }
                }}
              />
            </div>

            <div className={`flex-1 rounded-3xl border p-6 md:p-8 backdrop-blur-xl shadow-2xl relative w-full ${
              isDarkMode 
                ? "bg-slate-950/80 border-white/10" 
                : "bg-white border-slate-200/80 shadow-slate-200/80 shadow-xl"
            }`}>
              <div className={`absolute top-0 right-10 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${
                isDarkMode 
                  ? "bg-[#5eead4]/10 text-[#5eead4] border-[#5eead4]/30" 
                  : "bg-teal-50 text-[#0d9488] border-[#0d9488]/30"
              }`}>
                <Lock className={`w-3 h-3 ${isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"}`} /> SECURE END-TO-END
              </div>

              {/* Steps Progress Header */}
              <div className={`flex items-center justify-between mb-8 pb-6 border-b ${
                isDarkMode ? "border-white/5" : "border-slate-100"
              }`}>
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        activeStep === step 
                          ? isDarkMode
                            ? "bg-gradient-to-r from-[#5eead4] to-[#a78bfa] text-black ring-4 ring-[#5eead4]/20"
                            : "bg-gradient-to-r from-[#0d9488] to-[#7c3aed] text-white ring-4 ring-[#0d9488]/20" 
                          : activeStep > step 
                            ? isDarkMode
                              ? "bg-slate-900 text-[#5eead4] border border-[#5eead4]/20"
                              : "bg-slate-100 text-[#0d9488] border border-[#0d9488]/20" 
                            : isDarkMode
                              ? "bg-slate-900 text-slate-500 border border-white/5"
                              : "bg-slate-50 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {step}
                    </div>
                    <span 
                      className={`text-xs font-bold hidden sm:inline ${
                        activeStep === step 
                          ? isDarkMode ? "text-white" : "text-slate-900" 
                          : "text-slate-500"
                      }`}
                    >
                      {step === 1 ? "Basic Info" : step === 2 ? "Requirements" : "Date & Time"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Error Box */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex gap-2.5 items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-ping" />
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUCCESS STATE */}
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 flex flex-col items-center gap-6"
                >
                  <div className={`w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg mb-2 ${
                    isDarkMode 
                      ? "bg-gradient-to-br from-[#5eead4] to-[#a78bfa] text-slate-950 shadow-[#5eead4]/20" 
                      : "bg-gradient-to-br from-[#0d9488] to-[#7c3aed] shadow-[#0d9488]/20"
                  }`}>
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h3 className={`text-2xl font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Call Scheduled Successfully!</h3>
                  
                  <div className={`p-5 rounded-2xl border text-left max-w-md w-full text-xs flex flex-col gap-3.5 ${
                    isDarkMode ? "bg-white/5 border-white/5 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700"
                  }`}>
                    <div className={`flex justify-between border-b pb-2 ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
                      <span className="text-slate-500">Contact</span>
                      <strong className={isDarkMode ? "text-white" : "text-slate-900"}>{formData.firstName} {formData.lastName}</strong>
                    </div>
                    <div className={`flex justify-between border-b pb-2 ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
                      <span className="text-slate-500">Company</span>
                      <strong className={isDarkMode ? "text-white" : "text-slate-900"}>{formData.companyName}</strong>
                    </div>
                    <div className={`flex justify-between border-b pb-2 ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
                      <span className="text-slate-500">Scheduled For</span>
                      <strong className={`flex items-center gap-1 ${isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"}`}>
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {getFormattedDateStr(formData.selectedDate)} @ {formData.selectedTime}
                      </strong>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-500">Proposed Solution</span>
                      <strong className={`font-medium p-2.5 rounded border ${
                        isDarkMode 
                          ? "bg-slate-900/60 border-white/5 text-white" 
                          : "bg-white border-slate-200 text-slate-900"
                      }`}>{formData.customSolution}</strong>
                    </div>
                  </div>

                  <p className={`text-sm max-w-md leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Our founder and engineering team have been notified. A Google Meet calendar invite with secure join links will be in your inbox shortly.
                  </p>

                  <Link 
                    href="/" 
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-white transition-all no-underline mt-4 ${
                      isDarkMode 
                        ? "bg-gradient-to-r from-[#5eead4] via-[#a78bfa] to-[#f59e6b] text-black font-extrabold" 
                        : "bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#f59e6b]"
                    }`}
                  >
                    Return to Homepage
                  </Link>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* STEP 1: BASIC INFO */}
                  {activeStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <h4 className={`text-sm font-extrabold uppercase tracking-wider mb-1 ${
                        isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"
                      }`}>
                        Company & Personal Info
                      </h4>
                      <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Let's start with who you are and where you work so we can research your business model.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>First Name</label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border ${
                              isDarkMode 
                                ? "bg-slate-900/60 border-white/10 text-white placeholder-slate-500 focus:border-[#5eead4]" 
                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0d9488]"
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Last Name</label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border ${
                              isDarkMode 
                                ? "bg-slate-900/60 border-white/10 text-white placeholder-slate-500 focus:border-[#5eead4]" 
                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0d9488]"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Work Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border ${
                            isDarkMode 
                              ? "bg-slate-900/60 border-white/10 text-white placeholder-slate-500 focus:border-[#5eead4]" 
                              : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0d9488]"
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Company Name</label>
                          <input 
                            type="text" 
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Acme Corp"
                            className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border ${
                              isDarkMode 
                                ? "bg-slate-900/60 border-white/10 text-white placeholder-slate-500 focus:border-[#5eead4]" 
                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0d9488]"
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Company Size</label>
                          <select 
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleInputChange}
                            className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border appearance-none cursor-pointer ${
                              isDarkMode 
                                ? "bg-slate-900/60 border-white/10 text-white focus:border-[#5eead4]" 
                                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#0d9488]"
                            }`}
                          >
                            <option value="" className={isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}>Select Size</option>
                            {COMPANY_SIZE_OPTIONS.map(opt => (
                              <option key={opt} value={opt} className={isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-extrabold text-white transition-all cursor-pointer shadow-lg ${
                            isDarkMode 
                              ? "bg-gradient-to-r from-[#5eead4] via-[#a78bfa] to-[#f59e6b] text-slate-950 shadow-emerald-500/10" 
                              : "bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#f59e6b] shadow-teal-500/10"
                          }`}
                        >
                          Next: Describe Requirements
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: REQUIREMENTS */}
                  {activeStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <h4 className={`text-sm font-extrabold uppercase tracking-wider mb-1 ${
                        isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"
                      }`}>
                        Your Requirements
                      </h4>
                      <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Tell us what you are aiming to solve, your expected budget, and other relevant details.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Target Custom Solution</label>
                          <div className="flex flex-col gap-2">
                            {SOLUTION_OPTIONS.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelectOption("customSolution", opt)}
                                className={`text-left text-xs px-3.5 py-3 rounded-xl border transition-all ${
                                  formData.customSolution === opt 
                                    ? isDarkMode 
                                      ? "bg-[#5eead4]/10 border-[#5eead4] text-white font-bold shadow-inner"
                                      : "bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488] font-bold shadow-inner" 
                                    : isDarkMode 
                                      ? "bg-slate-900/40 border-white/5 hover:border-white/15 text-slate-400" 
                                      : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between gap-4">
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Estimated Project Budget</label>
                            <div className="grid grid-cols-1 gap-2">
                              {BUDGET_OPTIONS.map(opt => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleSelectOption("budget", opt)}
                                  className={`text-left text-xs px-3.5 py-3 rounded-xl border transition-all flex items-center justify-between ${
                                    formData.budget === opt 
                                      ? isDarkMode 
                                        ? "bg-[#5eead4]/10 border-[#5eead4] text-white font-bold shadow-inner"
                                        : "bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488] font-bold shadow-inner" 
                                      : isDarkMode 
                                        ? "bg-slate-900/40 border-white/5 hover:border-white/15 text-slate-400" 
                                        : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {formData.budget === opt && (
                                    <CheckCircle className={`w-3.5 h-3.5 ${isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"}`} />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Tell us about your project</label>
                        <textarea 
                          name="projectDetails"
                          value={formData.projectDetails}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Provide any context on legacy architectures, WhatsApp volumes, or key business outcomes you want automated."
                          className={`w-full rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors resize-none border ${
                            isDarkMode 
                              ? "bg-slate-900/60 border-white/10 text-white placeholder-slate-500 focus:border-[#5eead4]" 
                              : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#0d9488]"
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all cursor-pointer border ${
                            isDarkMode 
                              ? "text-slate-300 bg-white/5 border-white/10 hover:bg-white/10" 
                              : "text-slate-600 bg-slate-100 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-extrabold transition-all cursor-pointer text-white shadow-lg ${
                            isDarkMode 
                              ? "bg-gradient-to-r from-[#5eead4] via-[#a78bfa] to-[#f59e6b] text-slate-950 font-extrabold shadow-emerald-500/10" 
                              : "bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#f59e6b]"
                          }`}
                        >
                          Next: Pick Time
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: INTERACTIVE CALENDAR & TIME SELECTOR */}
                  {activeStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className={`text-sm font-extrabold uppercase tracking-wider mb-1 ${
                          isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"
                        }`}>
                          Pick meeting date & time
                        </h4>
                        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                          Select a date below to see available slots. Booked slots are blocked to prevent overlaps.
                        </p>
                      </div>

                      {/* Interactive Custom Calendar Grid */}
                      <div className={`p-4 rounded-2xl border backdrop-blur-md ${
                        isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-slate-50/50 border-slate-200"
                      }`}>
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h5 className={`text-sm font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {MONTHS_FULL[month]} {year}
                          </h5>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className={`p-1.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                isDarkMode 
                                  ? "border-white/10 hover:bg-white/5 text-slate-400 hover:text-white" 
                                  : "border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                              }`}
                              disabled={year === new Date().getFullYear() && month <= new Date().getMonth()}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className={`p-1.5 rounded-lg border transition-all ${
                                isDarkMode 
                                  ? "border-white/10 hover:bg-white/5 text-slate-400 hover:text-white" 
                                  : "border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Calendar Day Labels */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                          {DAYS_OF_WEEK.map(d => (
                            <span key={d} className={`text-[10px] font-bold uppercase py-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{d}</span>
                          ))}
                        </div>

                        {/* Calendar Cells */}
                        <div className="grid grid-cols-7 gap-1">
                          {allCells.map((dayNum, cellIdx) => {
                            const disabled = isDayDisabled(dayNum);
                            const cellDateStr = dayNum 
                              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` 
                              : "";
                            const isSelected = formData.selectedDate === cellDateStr;

                            return (
                              <div key={cellIdx} className="aspect-square flex items-center justify-center">
                                {dayNum !== null ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDaySelect(dayNum)}
                                    disabled={disabled}
                                    className={`w-full h-full rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                                      isSelected
                                        ? isDarkMode 
                                          ? "bg-gradient-to-r from-[#5eead4] to-[#a78bfa] text-black shadow-[0_0_12px_rgba(94,234,212,0.45)] scale-105 border border-[#5eead4]/30"
                                          : "bg-gradient-to-r from-[#0d9488] to-[#7c3aed] text-white shadow-[0_0_12px_rgba(13,148,136,0.35)] scale-105 border border-[#0d9488]/30"
                                        : disabled
                                          ? isDarkMode 
                                            ? "text-slate-700 cursor-not-allowed opacity-35" 
                                            : "text-slate-300 cursor-not-allowed opacity-40"
                                          : isDarkMode
                                            ? "bg-slate-900/40 border border-white/5 hover:border-[#5eead4]/30 text-slate-200 hover:text-[#5eead4]"
                                            : "bg-white border border-slate-200 hover:border-[#0d9488]/30 text-slate-700 hover:text-[#0d9488]"
                                    }`}
                                  >
                                    <span>{dayNum}</span>
                                    {/* Subtle indicator dot if the day has active slots */}
                                    {!disabled && !isSelected && (
                                      <span className={`w-1 h-1 rounded-full mt-0.5 ${isDarkMode ? "bg-[#5eead4]/50" : "bg-[#0d9488]/50"}`} />
                                    )}
                                  </button>
                                ) : (
                                  <div className="w-full h-full" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <AnimatePresence mode="wait">
                        {formData.selectedDate && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-3 pt-2"
                          >
                            <div className="flex items-center justify-between">
                              <label className={`block text-xs font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                Select an Available Time Slot for <span className={isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"}>{getFormattedDateStr(formData.selectedDate)}</span>
                              </label>
                              <span className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-md ${
                                isDarkMode ? "text-slate-500 bg-slate-900" : "text-slate-500 bg-slate-100"
                              }`}>
                                <Clock className="w-3 h-3" /> All times in IST
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {TIME_SLOTS.map(t => {
                                const booked = isSlotBooked(formData.selectedDate, t);
                                const isTimeSelected = formData.selectedTime === t;

                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => !booked && handleSelectOption("selectedTime", t)}
                                    disabled={booked}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-xs font-semibold ${
                                      isTimeSelected 
                                        ? isDarkMode 
                                          ? "bg-[#5eead4]/10 border-[#5eead4] text-[#5eead4] font-bold" 
                                          : "bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488] font-bold"
                                        : booked
                                          ? isDarkMode 
                                            ? "bg-slate-950/40 border-white/5 text-slate-700 line-through cursor-not-allowed opacity-50" 
                                            : "bg-slate-100 border-slate-200 text-slate-300 line-through cursor-not-allowed opacity-60"
                                          : isDarkMode 
                                            ? "bg-slate-900/60 border-white/5 hover:border-[#5eead4]/20 text-slate-300 hover:text-[#5eead4]" 
                                            : "bg-white border-slate-200 hover:border-[#0d9488]/20 text-slate-700 hover:text-[#0d9488]"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      <span>{t}</span>
                                    </div>
                                    {isTimeSelected ? (
                                      <CheckCircle className={`w-3.5 h-3.5 ${isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"}`} />
                                    ) : booked ? (
                                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                        isDarkMode 
                                          ? "text-red-400 bg-red-950/40 border-red-500/10" 
                                          : "text-red-600 bg-red-50 border-red-200"
                                      }`}>Booked</span>
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all cursor-pointer border ${
                            isDarkMode 
                              ? "text-slate-300 bg-white/5 border-white/10 hover:bg-white/10" 
                              : "text-slate-600 bg-slate-100 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !formData.selectedDate || !formData.selectedTime}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-extrabold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-white shadow-lg ${
                            isDarkMode 
                              ? "bg-gradient-to-r from-[#5eead4] via-[#a78bfa] to-[#f59e6b] text-slate-950 font-extrabold shadow-emerald-500/10" 
                              : "bg-gradient-to-r from-[#0d9488] via-[#7c3aed] to-[#f59e6b]"
                          }`}
                        >
                          {loading ? "Booking..." : "Schedule Strategic Call"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                </form>
              )}

            </div>

          </div>

        </div>

        {/* SECURE END-TO-END TRUST MODULE */}
        <div className={`mt-24 md:mt-32 max-w-4xl mx-auto py-12 px-8 rounded-3xl border flex flex-col md:flex-row items-center gap-8 backdrop-blur-md relative overflow-hidden shadow-2xl ${
          isDarkMode 
            ? "bg-[#121212]/90 border-white/5" 
            : "bg-white border-slate-200 shadow-lg shadow-slate-100/50"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className={`shrink-0 p-4 rounded-2xl shadow-inner border ${
            isDarkMode 
              ? "bg-indigo-950/40 border-indigo-500/20 text-[#5eead4]" 
              : "bg-teal-50 border-teal-100 text-[#0d9488]"
          }`}>
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h4 className={`text-base font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>Strict Privacy & Enterprise Security First</h4>
            <p className={`text-xs leading-relaxed mb-0 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              We sign strict NDAs prior to any technical assessment. StrixMind supports full-scope data sovereignty with modular deployments in local VPC environments across AWS and GCP, compliant with Indian banking standards (RBI guidelines).
            </p>
          </div>
        </div>

        {/* 2. FAQ ACCORDION SECTION */}
        <div className="mt-24 md:mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>Frequently Asked Questions</h3>
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Answers to key logistical questions before scheduling your call.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isDarkMode 
                      ? "border-white/5 bg-slate-900/20" 
                      : "border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className={`w-full flex items-center justify-between p-5 text-left text-sm font-bold transition-colors ${
                      isDarkMode ? "text-white hover:bg-white/5" : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${
                      isDarkMode ? "text-[#5eead4]" : "text-[#0d9488]"
                    }`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className={`px-5 pb-5 pt-1 text-xs leading-relaxed border-t ${
                          isDarkMode ? "text-slate-400 border-white/5" : "text-slate-600 border-slate-100"
                        }`}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>



      </div>
    </div>
  );
}
