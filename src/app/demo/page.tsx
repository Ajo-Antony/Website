"use client";

import React, { useState } from "react";
import { MeetingScheduler } from "@/components/ui/meeting-scheduler";
import { ChapterScrubber, type Chapter } from "@/components/ui/chapter-scrubber";
import { parse } from "date-fns";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Navigation, 
  Code, 
  Layout, 
  GitPullRequest,
  Check,
  Zap
} from "lucide-react";

// Chapters dataset from user prompt
const CHAPTERS: Chapter[] = [
  {
    id: "clone",
    title: "clone the repo and read the layout",
    description:
      "Pulled the branch and mapped the workspace — the scroll feature lives under registry/ruixenui.",
    meta: "00:00",
  },
  {
    id: "reproduce",
    title: "reproduce the reported bug",
    description:
      "Confirmed the rail flickers on fast pointer moves between adjacent lines. Traced it to state churn.",
    meta: "00:14",
  },
  {
    id: "grep",
    title: "grep for the hover handler",
    description:
      "Found two pointer listeners fighting over the same index every frame.",
    meta: "00:21",
  },
  {
    id: "read-test",
    title: "read the failing snapshot test",
    description:
      "The snapshot expected a clamped card position; the component placed it unclamped near the edges.",
    meta: "00:33",
  },
  {
    id: "hypothesis",
    title: "form a hypothesis",
    description:
      "The card top was never clamped to the rail bounds, so it overshot on the first and last chapters.",
    meta: "00:41",
  },
  {
    id: "magnify",
    title: "drive the rail off one pointer value",
    description:
      "Replaced per-line state with a single spring; each tick reads its rise from the cursor's distance.",
    meta: "00:52",
  },
  {
    id: "falloff",
    title: "shape the falloff",
    description:
      "Swapped the linear ramp for a raised-cosine bump so the wave has no seams at its edges.",
    meta: "01:07",
  },
  {
    id: "dedupe",
    title: "collapse hover and focus into one source",
    description:
      "Hover and keyboard now feed the same pointer value. No more dueling listeners, no more flicker.",
    meta: "01:19",
  },
  {
    id: "keyboard",
    title: "add roving tabindex + arrow keys",
    description:
      "Up/Down walk the rail, Home/End jump to the ends, Enter selects. Only one tick is tabbable at a time.",
    meta: "01:38",
  },
  {
    id: "reduced-motion",
    title: "honor prefers-reduced-motion",
    description:
      "Kept the spatial wave but dropped the springs, so the rise is instant instead of eased.",
    meta: "01:50",
  },
  {
    id: "flip",
    title: "auto-flip the card near the edge",
    description:
      "Compared room on each side against the card width and flipped toward the roomier one.",
    meta: "02:04",
  },
  {
    id: "run-tests",
    title: "run the test suite",
    description:
      "24 passed, 0 failed. The snapshot matches the clamped layout.",
    meta: "02:22",
  },
  {
    id: "lint",
    title: "lint and typecheck",
    description:
      "Clean. Tightened the ref callback and dropped an unused import.",
    meta: "02:30",
  },
  {
    id: "self-review",
    title: "re-read my own diff",
    description:
      "Skimmed the change end to end and trimmed a comment that no longer matched the code.",
    meta: "02:41",
  },
  {
    id: "commit",
    title: "commit the fix",
    description:
      "fix(scrubber): magnify the rail from a single pointer spring.",
    meta: "02:48",
  },
  {
    id: "push",
    title: "push and open the PR",
    description: "Opened PR #11148 against main and requested review.",
    meta: "02:55",
  },
  {
    id: "update-desc",
    title: "ok update pr desc with bullet points for what was done",
    description:
      "Updated PR #11148 with accurate implementation bullets, including its opt-in scope and browser fallback.",
    meta: "03:10",
  },
  {
    id: "respond",
    title: "respond to review comments",
    description:
      "Reviewer asked about touch devices — added a note that the rail falls back to focus + tap.",
    meta: "03:26",
  },
  {
    id: "green",
    title: "wait for CI to go green",
    description:
      "All checks passed on the second run after the flaky network mock settled.",
    meta: "03:44",
  },
  {
    id: "done",
    title: "hand off — ready to merge",
    description:
      "Left a summary comment and marked the PR ready. Waiting on the final approval.",
    meta: "03:51",
  },
];

export default function MeetingSchedulerDemo() {
  const [activeTab, setActiveTab] = useState<"scrubber" | "scheduler">("scrubber");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Scheduler handlers
  const handleSchedule = (details: { startDate: Date | null; endDate: Date | null; aiNotes: boolean }) => {
    const { startDate, endDate, aiNotes } = details;
    alert(`Meeting Scheduled!\nStart: ${startDate?.toDateString()}\nEnd: ${endDate?.toDateString()}\nAI Notes: ${aiNotes ? 'Enabled' : 'Disabled'}`);
  };

  const handleCancel = () => {
    alert("Scheduling cancelled.");
  };

  const initialStartDate = parse("2025-07-14 09:00", "yyyy-MM-dd HH:mm", new Date());
  const initialEndDate = parse("2025-07-20 10:00", "yyyy-MM-dd HH:mm", new Date());

  return (
    <div id="demo-view" className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased relative pb-24">
      {/* Premium Glow Accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:45px_45px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 relative z-10">
        
        {/* Navigation / Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors no-underline group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 tracking-wider uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> Component Engineering Lab
          </div>
        </div>

        {/* Intro Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Advanced Component Integration
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Discover our high-fidelity, polished React components designed with <strong>Shadcn UI</strong> foundations, <strong>Framer Motion</strong> micro-interactions, and pristine typography.
          </p>

          {/* Interactive Tabs */}
          <div className="flex justify-center mt-10">
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-white/5 shadow-inner">
              <button
                onClick={() => setActiveTab("scrubber")}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "scrubber"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Chapter Scrubber
              </button>
              <button
                onClick={() => setActiveTab("scheduler")}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "scheduler"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                Meeting Scheduler
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[500px]">
          {activeTab === "scrubber" ? (
            <div className="space-y-12">
              
              {/* Interactive Demo Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/60 border border-white/5 rounded-3xl p-8 backdrop-blur-md max-w-4xl mx-auto">
                
                {/* Left side: Guide description */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase">
                    <GitPullRequest className="w-3 h-3 text-emerald-400" /> Pull Request #11148
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Engineering Walkthrough Scrubber
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hover, glide, or use your keyboard arrow keys to scrub through the chronological milestones of resolving the magnification wave flicker bug.
                  </p>

                  {selectedChapter ? (
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/15 text-xs">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{selectedChapter.meta}</span>
                      <h4 className="font-bold text-white mt-1 mb-1.5">{selectedChapter.title}</h4>
                      <p className="text-slate-400 leading-relaxed m-0 text-[11px]">{selectedChapter.description}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-500 italic">
                      Glide your cursor over the vertical timeline to active logs...
                    </div>
                  )}
                </div>

                {/* Right side: Scrubber element centered */}
                <div className="lg:col-span-5 flex justify-center items-center py-8 relative min-h-[360px]">
                  <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none" />
                  
                  <ChapterScrubber
                    chapters={CHAPTERS}
                    side="left"
                    peakLength={64}
                    restLength={16}
                    rowHeight={12}
                    radius={4}
                    onActiveChange={(chapter) => {
                      setSelectedChapter(chapter);
                    }}
                    onSelect={(chapter) => {
                      setSelectedChapter(chapter);
                    }}
                  />
                </div>

              </div>

              {/* Scrubber Technical details cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Cosine Magnification
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Utilizes a raised-cosine mathematically smooth fall-off bump, creating a buttery wave magnification effect as the user drags.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-indigo-400" />
                    Auto-Flipping Card
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Detects real-time browser bounds and shifts card orientation automatically (left/right) if screen viewport is narrow.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Accessibility First
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Supports roving tabindexes and robust keyboard arrow actions. Smoothly complies with <code>prefers-reduced-motion</code>.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-8 flex justify-center items-center py-6">
              <MeetingScheduler
                initialStartDate={initialStartDate}
                initialEndDate={initialEndDate}
                onSchedule={handleSchedule}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
