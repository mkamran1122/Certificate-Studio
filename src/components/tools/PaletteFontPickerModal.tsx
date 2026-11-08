import React from 'react';
import { Palette, X, Check, Type } from 'lucide-react';

interface PaletteFontPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: {
    fontDisplay: string;
    fontBody: string;
    borderColor: string;
    secondaryColor: string;
    textColor: string;
    accentColor: string;
    backgroundColor: string;
  }) => void;
}

export const THEME_PRESETS = [
  {
    name: 'Presidential Gold & Navy',
    desc: 'Timeless luxury and academic authority',
    fontDisplay: 'Cinzel',
    fontBody: 'Playfair Display',
    borderColor: '#C5A059',
    secondaryColor: '#1E293B',
    textColor: '#0F172A',
    accentColor: '#8C6D2D',
    backgroundColor: '#FCFBF7'
  },
  {
    name: 'Modern Slate & Electric Blue',
    desc: 'Crisp contemporary tech bootcamp & software distinction',
    fontDisplay: 'Plus Jakarta Sans',
    fontBody: 'Plus Jakarta Sans',
    borderColor: '#2563EB',
    secondaryColor: '#0F172A',
    textColor: '#0F172A',
    accentColor: '#2563EB',
    backgroundColor: '#FFFFFF'
  },
  {
    name: 'Emerald Heritage & Warm Beige',
    desc: 'Scholarly natural sciences and environmental awards',
    fontDisplay: 'Cinzel',
    fontBody: 'Cormorant Garamond',
    borderColor: '#065F46',
    secondaryColor: '#D97706',
    textColor: '#1E293B',
    accentColor: '#047857',
    backgroundColor: '#FAF9F6'
  },
  {
    name: 'Crimson Laurel & Dark Onyx',
    desc: 'Prestige athletic tournaments and high achievements',
    fontDisplay: 'Oswald',
    fontBody: 'Plus Jakarta Sans',
    borderColor: '#B91C1C',
    secondaryColor: '#0F172A',
    textColor: '#0F172A',
    accentColor: '#DC2626',
    backgroundColor: '#FFFFFF'
  },
  {
    name: 'Dark Mode Cyber Distinction',
    desc: 'High-contrast dark canvas with vibrant cyan & violet',
    fontDisplay: 'Plus Jakarta Sans',
    fontBody: 'JetBrains Mono',
    borderColor: '#38BDF8',
    secondaryColor: '#818CF8',
    textColor: '#F8FAFC',
    accentColor: '#38BDF8',
    backgroundColor: '#0F172A'
  },
  {
    name: 'Minimalist Editorial Warm Gray',
    desc: 'Quiet museum and architectural design certificates',
    fontDisplay: 'Cormorant Garamond',
    fontBody: 'Montserrat',
    borderColor: '#44403C',
    secondaryColor: '#D97706',
    textColor: '#1C1917',
    accentColor: '#B45309',
    backgroundColor: '#FAF9F6'
  }
];

export const PaletteFontPickerModal: React.FC<PaletteFontPickerModalProps> = ({
  isOpen,
  onClose,
  onApplyTheme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              Curated Color Palettes & Font Pairings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select professionally matched typography and harmonized diploma color schemes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {THEME_PRESETS.map((theme, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {theme.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{theme.desc}</p>

                  {/* Swatches */}
                  <div className="flex items-center gap-1.5 mb-3">
                    {[
                      theme.borderColor,
                      theme.secondaryColor,
                      theme.accentColor,
                      theme.textColor,
                      theme.backgroundColor
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>

                  {/* Font pairing text preview */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Type className="w-3.5 h-3.5" />
                      <span>{theme.fontDisplay} + {theme.fontBody}</span>
                    </div>
                    <div
                      className="font-bold text-sm truncate"
                      style={{ fontFamily: theme.fontDisplay, color: theme.accentColor }}
                    >
                      Certificate of Achievement
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onApplyTheme(theme);
                    onClose();
                  }}
                  className="mt-4 w-full py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply Theme
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
