"use client";

import React from "react";
import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold transition-all cursor-pointer"
    >
      <Printer size={13} />
      Print
    </button>
  );
}
