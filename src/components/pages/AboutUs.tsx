import React from 'react';
import { Award, Sparkles, HeartHandshake, ShieldCheck, Zap } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const AboutUs: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>About Certificate Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Create. Customize. Celebrate.
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Certificate Studio is a free, modern web application designed to empower educators, leaders, and communities to design and issue dignified recognition without fees, accounts, or privacy compromises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Privacy By Design
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All graphic composition, CSV spreadsheet processing, and PDF bundling happen entirely inside your browser. No recipient records are ever uploaded to cloud servers.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Massive Bulk Power
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generate 5 or 500 certificates at once with CSV mapping. Download individual high-res PDFs in a neatly labeled ZIP file or a single unified multi-page PDF.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <HeartHandshake className="w-6 h-6 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            100% Free Forever
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No trial periods, no watermarks on exported files, and no forced paywalls. Built for schools, open workshops, non-profits, and growing companies.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Our Philosophy
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Earning a certificate represents hours of study, sweat, resilience, and personal commitment. We believe the tool used to celebrate that accomplishment should reflect true craft and elegance — with refined serif headlines, crisp vector medals, balanced layouts, and print-ready fidelity.
        </p>
      </div>
    </div>
  );
};
