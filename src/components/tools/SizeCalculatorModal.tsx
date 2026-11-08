import React, { useState } from 'react';
import { Calculator, X, Copy, Check } from 'lucide-react';

interface SizeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySize?: (width: number, height: number, format: 'A4' | 'Letter' | 'Custom', orientation: 'landscape' | 'portrait') => void;
}

export const SizeCalculatorModal: React.FC<SizeCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplySize
}) => {
  const [unit, setUnit] = useState<'mm' | 'inches' | 'pixels'>('mm');
  const [dpi, setDpi] = useState<number>(300); // 300 DPI print quality vs 96 DPI screen
  const [customW, setCustomW] = useState<number>(297);
  const [customH, setCustomH] = useState<number>(210);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const mmToInches = 1 / 25.4;
  const inchesToMm = 25.4;

  const STANDARD_PRESETS = [
    {
      name: 'A4 Landscape',
      category: 'Print (ISO Standard)',
      mmW: 297,
      mmH: 210,
      format: 'A4' as const,
      orientation: 'landscape' as const,
      desc: 'Global standard for academic diplomas, training credentials, and corporate certificates.'
    },
    {
      name: 'A4 Portrait',
      category: 'Print (ISO Standard)',
      mmW: 210,
      mmH: 297,
      format: 'A4' as const,
      orientation: 'portrait' as const,
      desc: 'Vertical ISO standard for dean’s lists, scholarly honors, and plaques.'
    },
    {
      name: 'US Letter Landscape',
      category: 'Print (North America)',
      mmW: 279.4,
      mmH: 215.9,
      format: 'Letter' as const,
      orientation: 'landscape' as const,
      desc: 'Standard North American format (11 × 8.5 in) for office printers and frames.'
    },
    {
      name: 'US Letter Portrait',
      category: 'Print (North America)',
      mmW: 215.9,
      mmH: 279.4,
      format: 'Letter' as const,
      orientation: 'portrait' as const,
      desc: 'Standard vertical North American diploma format.'
    },
    {
      name: 'LinkedIn Digital Badge',
      category: 'Digital & Social',
      mmW: 200,
      mmH: 200,
      format: 'Custom' as const,
      orientation: 'landscape' as const,
      desc: 'Square 1:1 certificate thumbnail for social credential sharing (800 × 800 px).'
    },
    {
      name: 'HD Digital Display (16:9)',
      category: 'Digital Presentation',
      mmW: 338.7,
      mmH: 190.5,
      format: 'Custom' as const,
      orientation: 'landscape' as const,
      desc: 'Presentation widescreen resolution (1920 × 1080 px equivalent at 144 DPI).'
    }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const getCalculatedPixels = (mmW: number, mmH: number, targetDpi: number) => {
    const inchesW = mmW * mmToInches;
    const inchesH = mmH * mmToInches;
    return {
      pxW: Math.round(inchesW * targetDpi),
      pxH: Math.round(inchesH * targetDpi)
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              Certificate Size & DPI Calculator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurately convert between millimeters, inches, pixels, and print resolutions (300 DPI vs 96 DPI)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* DPI Mode selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Resolution Target (DPI)
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                300 DPI for commercial printing; 96 DPI for web preview
              </p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              {[
                { dpiVal: 96, label: '96 DPI (Web/Preview)' },
                { dpiVal: 150, label: '150 DPI (Balanced)' },
                { dpiVal: 300, label: '300 DPI (Print Ready)' }
              ].map(opt => (
                <button
                  key={opt.dpiVal}
                  onClick={() => setDpi(opt.dpiVal)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dpi === opt.dpiVal
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Standard Formats Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Standard Physical & Digital Dimensions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STANDARD_PRESETS.map((preset, idx) => {
                const px = getCalculatedPixels(preset.mmW, preset.mmH, dpi);
                const inchesW = (preset.mmW * mmToInches).toFixed(2);
                const inchesH = (preset.mmH * mmToInches).toFixed(2);

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-blue-400 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {preset.name}
                        </span>
                        <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{preset.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono">
                      <div className="text-slate-600 dark:text-slate-400">
                        <span>{preset.mmW} × {preset.mmH} mm</span>
                        <span className="text-slate-400 mx-1.5">/</span>
                        <span>{inchesW} × {inchesH} in</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-200 tabular-nums">
                          {px.pxW} × {px.pxH} px
                        </span>
                        {onApplySize && (
                          <button
                            onClick={() => {
                              onApplySize(preset.mmW > preset.mmH ? 1123 : 794, preset.mmW > preset.mmH ? 794 : 1123, preset.format, preset.orientation);
                              onClose();
                            }}
                            className="px-2 py-1 text-[11px] font-sans font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
