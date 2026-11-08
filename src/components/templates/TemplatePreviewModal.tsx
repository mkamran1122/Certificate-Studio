import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Heart,
  Share2,
  Calendar,
  Tag,
  CheckCircle2,
  Maximize2,
  FileSpreadsheet
} from 'lucide-react';
import { CertificateTemplate, CertificateElement } from '../../types/certificate';
import { CertificateCanvas } from '../canvas/CertificateCanvas';

interface TemplatePreviewModalProps {
  template: CertificateTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomize: (template: CertificateTemplate) => void;
  onUseForBulk: (template: CertificateTemplate) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onCustomize,
  onUseForBulk,
  isFavorite,
  onToggleFavorite
}) => {
  const [testRecipient, setTestRecipient] = useState('Alexander J. Sterling');
  const [testOrg, setTestOrg] = useState('Metropolitan Academy of Sciences');

  if (!isOpen || !template) return null;

  // Substitute test recipient and org into preview elements
  const previewElements: CertificateElement[] = template.elements.map(el => {
    if (el.type !== 'text') return el;
    let content = el.content || '';
    if (testRecipient && (el.placeholderKey === 'RECIPIENT_NAME' || content.includes('[RECIPIENT_NAME]'))) {
      content = content.replace(/\[RECIPIENT_NAME\]/g, testRecipient);
    }
    if (testOrg && (el.placeholderKey === 'ORGANIZATION_NAME' || content.includes('[ORGANIZATION_NAME]'))) {
      content = content.replace(/\[ORGANIZATION_NAME\]/g, testOrg);
    }
    return { ...el, content };
  });

  const isLandscape = template.orientation === 'landscape';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 capitalize">
              {template.category}
            </span>
            <span className="text-xs font-mono text-slate-500 uppercase">
              {template.orientation} • {template.format}
            </span>
            {template.monthName && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-medium border border-amber-200 dark:border-amber-900">
                <Calendar className="w-3 h-3" />
                {template.monthName} Collection
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(template.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 text-rose-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Preview, Right Specs & Actions */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Certificate Viewport (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bg-slate-100 dark:bg-slate-950/80 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden min-h-[360px]">
              <div
                className="relative origin-center shadow-xl transition-transform"
                style={{
                  transform: isLandscape ? 'scale(0.48)' : 'scale(0.45)',
                  transformOrigin: 'center center'
                }}
              >
                <CertificateCanvas
                  width={template.width}
                  height={template.height}
                  background={template.background}
                  border={template.border}
                  elements={previewElements}
                  selectedElementId={null}
                  onSelectElement={() => {}}
                  onUpdateElement={() => {}}
                  readOnly={true}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full vector fidelity: exports in 300 DPI print-ready PDF</span>
            </div>
          </div>

          {/* Details & Live Test Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {template.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Live Name Test Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Live Preview Customizer
              </span>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Recipient Name:
                </label>
                <input
                  type="text"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="Type any test name..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Awarding Institution:
                </label>
                <input
                  type="text"
                  value={testOrg}
                  onChange={(e) => setTestOrg(e.target.value)}
                  placeholder="Organization name..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tags & Attributes */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Design Style:</span>
                <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                  {template.style}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Page Dimensions:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {template.width} × {template.height} px
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Orientation:</span>
                <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                  {template.orientation}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Template ID:</span>
                <span className="font-mono text-[11px] text-slate-500">
                  {template.id}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onCustomize(template);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Customize in Certificate Editor
              </button>

              <button
                onClick={() => {
                  onClose();
                  onUseForBulk(template);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Generate in Bulk from CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
