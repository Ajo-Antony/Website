"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold tracking-widest text-[#5eead4]">404</h1>
        <div className="bg-[#a78bfa] px-2 text-sm rounded rotate-12 inline-block font-mono text-slate-950 font-bold">
          Page Not Found
        </div>
        <p className="text-slate-400 text-sm mt-4">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-slate-950 bg-[#5eead4] hover:bg-[#4adcd0] transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
