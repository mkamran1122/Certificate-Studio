import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Award,
  Layers,
  Printer,
  CheckCircle,
  FileText,
  SlidersHorizontal,
  PenTool,
  QrCode
} from 'lucide-react';
import { CertificateTemplate } from '../../types/certificate';
import { CERTIFICATE_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/templates';
import { CertificateCanvas } from '../canvas/CertificateCanvas';
import { AdBanner } from '../common/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface HomePageProps {
  onOpenEditor: (template?: CertificateTemplate) => void;
  onNavigateToTemplates: () => void;
  onNavigateToBulk: () => void;
  onNavigateToHub: (slug: string) => void;
  onOpenTool: (toolName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenEditor,
  onNavigateToTemplates,
  onNavigateToBulk,
  onNavigateToHub,
  onOpenTool
}) => {
  // Select 6 showcase templates across categories
  const featuredTemplates = CERTIFICATE_TEMPLATES.slice(0, 6);

  return (
    <div className="w-full space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>100% Free · No Watermarks · No Sign-Up</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1] text-balance">
              Create Beautiful Certificates in Minutes
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Design professional certificates for students, employees, events, achievements, and more. Customize, download, and share — completely free.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => onOpenEditor()}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Certificate</span>
              </button>

              <button
                onClick={onNavigateToTemplates}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>Explore Templates</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy callout */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Private browser processing
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                Bulk CSV generator
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-500" />
                300 DPI vector PDF
              </span>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-lg aspect-4/3 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 flex items-center justify-center overflow-hidden group cursor-pointer"
              onClick={() => onOpenEditor(CERTIFICATE_TEMPLATES[0])}
            >
              <div
                className="relative shadow-xl transition-transform duration-300 group-hover:scale-102"
                style={{ transform: 'scale(0.38)', transformOrigin: 'center center' }}
              >
                <CertificateCanvas
                  width={CERTIFICATE_TEMPLATES[0].width}
                  height={CERTIFICATE_TEMPLATES[0].height}
                  background={CERTIFICATE_TEMPLATES[0].background}
                  border={CERTIFICATE_TEMPLATES[0].border}
                  elements={CERTIFICATE_TEMPLATES[0].elements}
                  selectedElementId={null}
                  onSelectElement={() => {}}
                  onUpdateElement={() => {}}
                  readOnly={true}
                />
              </div>

              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                <span className="px-4 py-2 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Click to Customize This Design
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense readiness banner */}
      <AdBanner slot={siteConfig.adsense.slots.homeHeroBottom} format="responsive" />

      {/* Popular Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Popular Certificate Categories
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Find the perfect aesthetic for your educational institution, company, or community
            </p>
          </div>
          <button
            onClick={onNavigateToTemplates}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
          >
            View All 20 Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Academic & School', slug: 'academic-certificates', count: '100+ Styles' },
            { label: 'Course Completion', slug: 'course-completion', count: '100+ Bootcamps' },
            { label: 'Employee Recognition', slug: 'employee-appreciation', count: '70+ Honors' },
            { label: 'Professional Training', slug: 'training-certificates', count: '70+ CPD Specs' },
            { label: 'University Graduation', slug: 'academic-certificates', count: '65+ Diplomas' },
            { label: 'Sports & Athletics', slug: 'sports-certificates', count: '60+ Tournaments' }
          ].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateToHub(cat.slug)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:shadow-sm text-left transition-all flex flex-col justify-between"
            >
              <Award className="w-5 h-5 text-blue-600 mb-2" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{cat.count}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Templates Gallery Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Certificate Designs
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Handcrafted vector diploma layouts ready to personalize and print
            </p>
          </div>
          <button
            onClick={onNavigateToTemplates}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
          >
            Explore All 1,000+ Templates →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemplates.map(tmpl => {
            const isLandscape = tmpl.orientation === 'landscape';
            const scale = isLandscape ? 0.31 : 0.31;
            const containerHeight = isLandscape ? 'h-64' : 'h-88';

            return (
              <div
                key={tmpl.id}
                onClick={() => onOpenEditor(tmpl)}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-900 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div
                  className={`w-full ${containerHeight} bg-slate-100 dark:bg-slate-950 p-4 flex items-center justify-center overflow-hidden relative`}
                >
                  <div
                    className="relative shadow-md group-hover:scale-102 transition-transform duration-200"
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <CertificateCanvas
                      width={tmpl.width}
                      height={tmpl.height}
                      background={tmpl.background}
                      border={tmpl.border}
                      elements={tmpl.elements}
                      selectedElementId={null}
                      onSelectElement={() => {}}
                      onUpdateElement={() => {}}
                      readOnly={true}
                    />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] text-blue-600 font-medium">
                      {tmpl.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
                      {tmpl.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Customize in Editor →</span>
                    <span className="font-mono text-slate-400 text-[10px] capitalize">
                      {tmpl.orientation}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AdSense readiness banner */}
      <AdBanner slot={siteConfig.adsense.slots.templateGalleryMiddle} format="responsive" />

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How Certificate Studio Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Four simple steps to design, bulk-produce, and distribute professional credentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Choose Design',
              desc: 'Select from 30+ classical, modern, and minimalist templates or start with custom canvas dimensions.'
            },
            {
              step: '02',
              title: 'Customize Typography',
              desc: 'Edit names, courses, dates, colors, and insert digital signatures or your university logo.'
            },
            {
              step: '03',
              title: 'Bulk Generate (CSV)',
              desc: 'Upload a spreadsheet of 10 or 1,000 recipients to produce certificates simultaneously.'
            },
            {
              step: '04',
              title: 'Instant Download',
              desc: 'Export 300 DPI vector PDFs, high-resolution PNGs, or a complete ZIP package with zero server delays.'
            }
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
            >
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {s.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {s.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mini-Tools Showcase Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Essential Tools for Certificate Creators
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Included free inside Certificate Studio to make your certificate operations seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <button
              onClick={() => onOpenTool('size-calculator')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div>
                <SlidersHorizontal className="w-5 h-5 text-blue-400 mb-2" />
                <div className="font-bold text-sm">Size & DPI Calculator</div>
                <div className="text-slate-400 mt-1">Convert mm, inches & 300 DPI print resolutions</div>
              </div>
              <span className="text-blue-400 font-semibold mt-3">Open Calculator →</span>
            </button>

            <button
              onClick={() => onOpenTool('signature-pad')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div>
                <PenTool className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="font-bold text-sm">Digital Signature Pad</div>
                <div className="text-slate-400 mt-1">Draw or upload transparent PNG signatures</div>
              </div>
              <span className="text-emerald-400 font-semibold mt-3">Draw Signature →</span>
            </button>

            <button
              onClick={() => onOpenTool('qr-generator')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div>
                <QrCode className="w-5 h-5 text-indigo-400 mb-2" />
                <div className="font-bold text-sm">QR Code Generator</div>
                <div className="text-slate-400 mt-1">Encode verification links and student tokens</div>
              </div>
              <span className="text-indigo-400 font-semibold mt-3">Generate QR →</span>
            </button>

            <button
              onClick={() => onOpenTool('id-generator')}
              className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors flex flex-col justify-between"
            >
              <div>
                <Award className="w-5 h-5 text-amber-400 mb-2" />
                <div className="font-bold text-sm">Certificate ID Generator</div>
                <div className="text-slate-400 mt-1">Generate batches of unique anti-collision serial codes</div>
              </div>
              <span className="text-amber-400 font-semibold mt-3">Generate IDs →</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-blue-600 text-white text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Design Your First Certificate?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100">
              No sign-up required. Start in our drag-and-drop studio right now.
            </p>
          </div>
          <button
            onClick={() => onOpenEditor()}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-blue-600 bg-white hover:bg-slate-50 rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Launch Certificate Studio</span>
          </button>
        </div>
      </section>
    </div>
  );
};
