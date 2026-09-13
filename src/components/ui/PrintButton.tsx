'use client';

import React from 'react';
import { Download } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Download Intelligence Report</span>
    </button>
  );
}