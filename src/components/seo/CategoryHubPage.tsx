import React from 'react';
import { Award, CheckCircle, Printer, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { CERTIFICATE_TEMPLATES } from '../../data/templates';
import { CertificateTemplate } from '../../types/certificate';
import { CertificateCanvas } from '../canvas/CertificateCanvas';
import { AdBanner } from '../common/AdBanner';
import { siteConfig } from '../../config/siteConfig';

export interface CategoryHubData {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  categoryFilter: string;
  overview: string;
  keyFeatures: string[];
  paperAndPrintTips: {
    recommendedStock: string;
    finish: string;
    framingAdvice: string;
  };
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_HUBS: Record<string, CategoryHubData> = {
  'free-certificate-maker': {
    slug: 'free-certificate-maker',
    title: 'Free Online Certificate Maker – No Sign-Up, No Watermarks',
    headline: 'Create Beautiful Certificates 100% Free in Your Browser',
    subheadline: 'Professional diploma and award maker with instant PDF/PNG export, batch CSV generation, and zero account requirement.',
    categoryFilter: 'All',
    overview: 'Certificate Studio provides institutions, educators, managers, and event organizers with a completely client-side suite to design, customize, and issue high-resolution certificates. Every element, font, badge, and border is editable in real-time with pixel-accurate 300 DPI vector printing.',
    keyFeatures: [
      'Client-side private processing — your recipient names and logos never touch external servers',
      'Batch CSV bulk generator with automated field substitution and ZIP download',
      'Over 1,000 ready-to-use templates spanning academic, university, corporate, sports, and workshop awards',
      'Built-in digital signature drawing pad and scannable QR verification code generator'
    ],
    paperAndPrintTips: {
      recommendedStock: '280 – 320 GSM Heavyweight Cardstock or Linen Textured Paper',
      finish: 'Matte or Satin Eggshell to avoid glare under glass framing',
      framingAdvice: 'Use standard A4 or US Letter 8.5 × 11 in certificate frames with acid-free matting.'
    },
    faqs: [
      {
        question: 'Is Certificate Studio truly free with no watermarks?',
        answer: 'Yes. All certificate templates, customization controls, and high-resolution PDF/PNG exports are completely free with zero watermarks and no mandatory account sign-up.'
      },
      {
        question: 'How does bulk generation work?',
        answer: 'Upload a standard CSV file with student or employee names, course titles, dates, and IDs. Map the columns to certificate placeholders and download all certificates in a single ZIP or combined multi-page PDF.'
      }
    ]
  },
  'academic-certificates': {
    slug: 'academic-certificates',
    title: 'Academic Certificate Templates – Diplomas & Honor Awards',
    headline: 'Distinguished Academic Diplomas & University Honors',
    subheadline: 'Honor scholarly diligence, dean’s lists, valedictorians, and graduation milestones with regal serif typography.',
    categoryFilter: 'Academic Certificates',
    overview: 'Academic certificates symbolize years of intellectual dedication and discipline. Our academic templates incorporate classical double-line borders, gold leaf seals, laurel wreaths, and prestigious serif typography paired with calligraphic signatory lines.',
    keyFeatures: [
      'Authentic classical diploma aesthetics with Latin and English honorary styles',
      'Accredited degree placeholders: Summa Cum Laude, Dean’s Honor List, Valedictorian',
      'Dual signatory fields for Chancellor, Dean, and Registrar signatures',
      'Optional QR code verification pointing to your university credential database'
    ],
    paperAndPrintTips: {
      recommendedStock: '65–80 lb Cover Weight Parchment Tone (Off-White or Cream)',
      finish: 'Natural Parchment or Vellum Texture',
      framingAdvice: 'Hardwood mahogany or walnut frame with gold-accented inner filigree.'
    },
    faqs: [
      {
        question: 'Can I add our university crest or school seal?',
        answer: 'Yes, click the Uploads tab in the Certificate Editor to insert your university crest, emblem, or high-res institutional logo.'
      },
      {
        question: 'What fonts are recommended for academic diplomas?',
        answer: 'Classical serif fonts like Cinzel, Playfair Display, and Cormorant Garamond convey academic authority and solemnity.'
      }
    ]
  },
  'course-completion': {
    slug: 'course-completion',
    title: 'Course Completion Certificates – Bootcamps & Online Courses',
    headline: 'Modern Course Completion & Skill Accreditation',
    subheadline: 'Award certified graduation credentials for coding bootcamps, masterclasses, online academies, and professional courses.',
    categoryFilter: 'Course Completion',
    overview: 'Deliver verified, shareable proof of knowledge for modern tech bootcamps, design academies, and skill courses. Students can upload their high-res certificates directly to LinkedIn or print them for client portfolios.',
    keyFeatures: [
      'Optimized for developer bootcamps, UX design courses, and AI seminars',
      'Modular layouts with verification serial numbers and credential tracking links',
      'Clean contemporary sans-serif and neo-grotesque typography',
      'One-click multi-recipient bulk generation from course rosters'
    ],
    paperAndPrintTips: {
      recommendedStock: '250 GSM Premium Bright White Cardstock',
      finish: 'Smooth Silk or Velvet Matte',
      framingAdvice: 'Sleek black aluminum floating frame or magnetic desk mount.'
    },
    faqs: [
      {
        question: 'Can graduates share their certificates on LinkedIn?',
        answer: 'Yes, download certificates in high-resolution PNG or PDF to post directly on LinkedIn or attach as credential media.'
      },
      {
        question: 'Can I include a verification QR code for recruiters?',
        answer: 'Yes, encode your course verification URL or certificate serial number into the QR code element.'
      }
    ]
  },
  'employee-appreciation': {
    slug: 'employee-appreciation',
    title: 'Employee Recognition & Appreciation Certificates',
    headline: 'Celebrate Workplace Excellence & Enduring Service',
    subheadline: 'Boost team morale with Employee of the Month, Leadership Breakthrough, and Long Service milestone awards.',
    categoryFilter: 'Employee Recognition',
    overview: 'Meaningful workplace recognition drives engagement, retention, and team camaraderie. Our corporate employee templates are engineered for executive presentations, quarterly town halls, and annual tenure celebrations.',
    keyFeatures: [
      'Tailored layouts for Employee of the Month, Peer Impact, and 5/10/20 Years of Service',
      'Executive navy, slate, and metallic gold corporate color palettes',
      'Digital signature pad for VP of People and CEO authorizations',
      'Batch generation for annual company-wide reward ceremonies'
    ],
    paperAndPrintTips: {
      recommendedStock: '300 GSM Heavyweight White or Pearl Shimmer Cardstock',
      finish: 'Satin Luster',
      framingAdvice: 'Glass-front brushed metal frame suitable for office wall display.'
    },
    faqs: [
      {
        question: 'How do I generate certificates for all team members at once?',
        answer: 'Upload your staff roster CSV in the Bulk Generator, map the Recipient Name and Award Category columns, and download all certificates in seconds.'
      }
    ]
  },
  'training-certificates': {
    slug: 'training-certificates',
    title: 'Professional Training & Compliance Certificates',
    headline: 'Accredited Compliance & Corporate Training Credentials',
    subheadline: 'Issue verifiable documentation for cybersecurity training, agile certifications, safety drills, and HR seminars.',
    categoryFilter: 'Training Certificates',
    overview: 'Corporate compliance and professional continuing education require rigorous documentation. Our training templates provide clean serial tracking, audit verification fields, and regulatory authority headers.',
    keyFeatures: [
      'Compliance-ready formats with audit serial IDs and issuance timestamps',
      'Accreditation seals for Agile, Scrum, Six Sigma, and Cybersecurity modules',
      'Print-ready high-resolution output for employee personnel records',
      'Zero server retention for sensitive employee and enterprise records'
    ],
    paperAndPrintTips: {
      recommendedStock: '200 – 240 GSM Business Bond or Heavyweight Document Stock',
      finish: 'Matte Uncoated for crisp black text readability',
      framingAdvice: 'Standard personnel binder archiving or desktop acrylic blocks.'
    },
    faqs: [
      {
        question: 'Is employee personal information protected?',
        answer: 'Yes. All certificate processing takes place strictly in your browser. No employee records, names, or corporate logos are uploaded to servers.'
      }
    ]
  },
  'internship-certificates': {
    slug: 'internship-certificates',
    title: 'Internship Completion Certificates & Fellowships',
    headline: 'Professional Internship & Research Fellowship Credentials',
    subheadline: 'Celebrate the successful conclusion of summer internships, clinical rotations, and engineering fellowships.',
    categoryFilter: 'Internship Certificates',
    overview: 'Conclude your internship and fellowship cohorts on an empowering note. Award professional credentials summarizing practical engineering contributions, laboratory research, and mentorship achievements.',
    keyFeatures: [
      'Professional enterprise and university lab fellowship layouts',
      'Comprehensive mentorship commendation and capstone project body copy',
      'Dual signature blocks for Lead Mentor and Director of Talent',
      'Instant PDF export ready for student graduate school and job applications'
    ],
    paperAndPrintTips: {
      recommendedStock: '250 – 300 GSM Archival White Cardstock',
      finish: 'Matte Smooth',
      framingAdvice: 'Standard portfolio sleeve or tabletop easel frame.'
    },
    faqs: [
      {
        question: 'Can I customize the body text for specific intern projects?',
        answer: 'Yes, every text block is fully editable. You can mention specific capstone projects or research deliverables.'
      }
    ]
  },
  'volunteer-certificates': {
    slug: 'volunteer-certificates',
    title: 'Volunteer Appreciation Certificates & Community Service',
    headline: 'Honor Selfless Civic Dedication & Community Outreach',
    subheadline: 'Applaud volunteers, disaster relief teams, charity fundraisers, and youth mentors with warm heartfelt designs.',
    categoryFilter: 'Volunteer Certificates',
    overview: 'Volunteers power community progress. Express authentic organizational gratitude with colorful, warm certificates celebrating service hours, civic initiatives, and environmental stewardship.',
    keyFeatures: [
      'Warm community color palettes with emerald, orange, and sunburst accents',
      'Dedicated hour count and mission impact placeholders',
      'Friendly civic typography and laurel appreciation badges',
      'Bulk generator for rapid distribution to large volunteer squads'
    ],
    paperAndPrintTips: {
      recommendedStock: '100% Recycled Kraft or Eco-Fibers Cardstock (220–280 GSM)',
      finish: 'Organic Textured Matte',
      framingAdvice: 'Eco-friendly bamboo or reclaimed pine wooden frames.'
    },
    faqs: [
      {
        question: 'Can I print volunteer certificates on recycled paper?',
        answer: 'Yes! Our high-contrast vector outputs look phenomenal on recycled Kraft and textured eco-paper stocks.'
      }
    ]
  }
};

interface CategoryHubPageProps {
  hubKey: string;
  onSelectTemplate: (template: CertificateTemplate) => void;
  onOpenEditor: () => void;
}

export const CategoryHubPage: React.FC<CategoryHubPageProps> = ({
  hubKey,
  onSelectTemplate,
  onOpenEditor
}) => {
  const hubData = CATEGORY_HUBS[hubKey] || CATEGORY_HUBS['free-certificate-maker'];

  const relatedTemplates = CERTIFICATE_TEMPLATES.filter(tmpl => {
    if (hubData.categoryFilter === 'All') return true;
    if (tmpl.category === hubData.categoryFilter) return true;
    const catWords = hubData.categoryFilter.toLowerCase().split(/[ &]+/);
    return catWords.some(w => w.length > 3 && tmpl.category.toLowerCase().includes(w));
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero Header */}
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Certificate Studio Category Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {hubData.headline}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          {hubData.subheadline}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenEditor}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Certificate Now (Free)</span>
          </button>
        </div>
      </div>

      {/* AdSense readiness banner */}
      <AdBanner slot={siteConfig.adsense.slots.homeHeroBottom} format="responsive" />

      {/* Overview & Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            About {hubData.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {hubData.overview}
          </p>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Why Certificate Studio:
            </h3>
            <div className="space-y-2">
              {hubData.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paper & Print Guide Box */}
        <div className="md:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Professional Printing Recommendations</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Recommended Paper Stock:
              </span>
              <p className="text-slate-500 mt-0.5">{hubData.paperAndPrintTips.recommendedStock}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Surface Texture & Finish:
              </span>
              <p className="text-slate-500 mt-0.5">{hubData.paperAndPrintTips.finish}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Display & Framing Tip:
              </span>
              <p className="text-slate-500 mt-0.5">{hubData.paperAndPrintTips.framingAdvice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Templates Grid for this Category */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Featured Designs for this Category ({relatedTemplates.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedTemplates.slice(0, 6).map(tmpl => {
            const isLandscape = tmpl.orientation === 'landscape';
            const scale = isLandscape ? 0.31 : 0.31;
            const containerHeight = isLandscape ? 'h-64' : 'h-88';

            return (
              <div
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl)}
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
                  <button
                    onClick={() => onSelectTemplate(tmpl)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Use This Template →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hubData.faqs.map((faq, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {faq.question}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
