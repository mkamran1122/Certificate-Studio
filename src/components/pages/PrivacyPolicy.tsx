import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, CheckCircle } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Privacy Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">
          Last updated: November 2026 · 100% Client-Side Private Processing
        </p>
      </div>

      {/* Prominent Privacy Statement Box as requested in Master Prompt */}
      <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
        <div className="flex items-center gap-2.5 text-base font-bold text-emerald-900 dark:text-emerald-200">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Our Privacy Commitment to You</span>
        </div>
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed">
          &ldquo;{siteConfig.privacyNotice}&rdquo;
        </p>
        <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
          We designed Certificate Studio with privacy-first architecture. All graphic rendering, PDF conversions, CSV parsing, and signatures are processed inside your browser instance using client-side Web APIs and WebAssembly.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            1. Zero Data Collection on Certificates
          </h2>
          <p>
            When you create, customize, or bulk generate certificates on Certificate Studio:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <li>Recipient names, student details, course titles, and certificate numbers are never transmitted to our servers.</li>
            <li>Uploaded organization logos, seals, signatures, and background images remain solely in your device memory.</li>
            <li>CSV spreadsheets uploaded for bulk generation are parsed locally via HTML5 FileReader and PapaParse.</li>
            <li>PDF, PNG, JPEG, and bulk ZIP archives are packaged in client-side memory using jsPDF and JSZip.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            2. Local Browser Storage
          </h2>
          <p>
            If you choose to use the &ldquo;Save Design&rdquo; feature, your project data is saved exclusively inside your browser&rsquo;s LocalStorage or IndexedDB cache. This data never leaves your device. You can clear this anytime by deleting saved projects or clearing your browser site cache.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            3. Third-Party Services & Google AdSense Readiness
          </h2>
          <p>
            We may display advertisements provided by Google AdSense to sustain our free services. Google AdSense may use cookies to serve ads based on prior visits to our website or other sites. You can opt out of personalized advertising by visiting Google Ads Settings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            4. Contact
          </h2>
          <p>
            If you have questions about our privacy practices, contact us at <span className="font-mono text-blue-600">privacy@certificatestudio.app</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
