import React from 'react';

export const TermsOfUse: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Terms of Use
        </h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          1. Permitted Use & Free License
        </h2>
        <p>
          Certificate Studio grants you a perpetual, royalty-free license to use all templates, editor tools, and generated certificates for commercial, academic, non-profit, and personal purposes. You may print, distribute, and frame generated output without attribution.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          2. Prohibited Content
        </h2>
        <p>
          You agree not to use Certificate Studio to forge official government diplomas, licenses, or fraudulent credentials claiming false legal accreditations. Certificate Studio does not represent an official legal certification board.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          3. Disclaimer of Warranty
        </h2>
        <p>
          The application is provided &ldquo;as is&rdquo; without warranty of any kind. Since all processing is performed locally in your browser, you are responsible for maintaining backups of your CSV data and project files.
        </p>
      </section>
    </div>
  );
};
