import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'Is Certificate Studio completely free to use?',
    a: 'Yes, 100% free. There are no paid tiers, subscription paywalls, watermarks, or account registration gates. You can customize templates and export high-resolution PDFs and PNGs without cost.'
  },
  {
    q: 'Are certificates stored or viewed on your servers?',
    a: 'No. Certificate Studio runs strictly client-side inside your browser. Your recipient names, uploaded company logos, signatures, and CSV spreadsheets are never transmitted to or stored on external servers.'
  },
  {
    q: 'How does the Bulk Certificate Generator work?',
    a: 'Upload any standard CSV file containing columns like Recipient Name, Course Name, Date, and ID. Map these columns to placeholders in the design, and our client-side engine will generate and package all certificates into a single ZIP file or combined multi-page PDF.'
  },
  {
    q: 'What paper stock is best for printing certificates?',
    a: 'For an authentic diploma feel, we recommend 250 to 320 GSM heavyweight cardstock, natural parchment finish, or linen-textured paper stock. Matte or satin finishes prevent glare under glass frames.'
  },
  {
    q: 'Can I add our company or university logo and signature?',
    a: 'Yes. In the Certificate Editor, use the Uploads tab to import any PNG, SVG, or JPG logo. You can also draw custom digital signatures directly using the built-in Signature Pad tool.'
  },
  {
    q: 'How do I add a scannable QR verification code?',
    a: 'Click on the QR Code tab in the editor or the QR Generator tool to enter a verification URL or certificate ID. A crisp vector QR code will be generated and positioned onto your certificate design.'
  },
  {
    q: 'Can I save my projects and continue editing later?',
    a: 'Yes. Click &ldquo;Save Design&rdquo; in the editor top bar to store your project in your browser&rsquo;s local storage. You can also export your project as a JSON backup file and import it anytime on any computer.'
  }
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Help & Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500">
          Everything you need to know about designing, customizing, and bulk generating certificates.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-slate-100"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
