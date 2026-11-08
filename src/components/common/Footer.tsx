import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { AdBanner } from './AdBanner';

interface FooterProps {
  onNavigate: (view: string) => void;
  onNavigateToHub: (slug: string) => void;
  onOpenTool: (toolName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onNavigateToHub,
  onOpenTool
}) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-16 no-print">
      {/* Footer Ad Placement */}
      <AdBanner slot={siteConfig.adsense.slots.footerTop} format="horizontal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Brand & Privacy */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Private Browser-First Generation</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Categories
            </h4>
            <div className="flex flex-col space-y-1.5 text-slate-500">
              <button
                onClick={() => onNavigateToHub('academic-certificates')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Academic Diplomas
              </button>
              <button
                onClick={() => onNavigateToHub('course-completion')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Course Completion
              </button>
              <button
                onClick={() => onNavigateToHub('employee-appreciation')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Employee Recognition
              </button>
              <button
                onClick={() => onNavigateToHub('training-certificates')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Training & Compliance
              </button>
              <button
                onClick={() => onNavigateToHub('internship-certificates')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Internship Fellowships
              </button>
              <button
                onClick={() => onNavigateToHub('volunteer-certificates')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Volunteer Awards
              </button>
            </div>
          </div>

          {/* Generator Tools */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Free Tools
            </h4>
            <div className="flex flex-col space-y-1.5 text-slate-500">
              <button
                onClick={() => onNavigate('bulk')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Bulk CSV Generator
              </button>
              <button
                onClick={() => onOpenTool('size-calculator')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Size & DPI Calculator
              </button>
              <button
                onClick={() => onOpenTool('signature-pad')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Digital Signature Pad
              </button>
              <button
                onClick={() => onOpenTool('qr-generator')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                QR Code Generator
              </button>
              <button
                onClick={() => onOpenTool('id-generator')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Certificate ID Generator
              </button>
            </div>
          </div>

          {/* Company & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              Information
            </h4>
            <div className="flex flex-col space-y-1.5 text-slate-500">
              <button
                onClick={() => onNavigate('about')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => onNavigate('faq')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Terms of Use
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="text-left hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Built for free certificate creation.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:underline">
              Privacy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('terms')} className="hover:underline">
              Terms
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('contact')} className="hover:underline">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
