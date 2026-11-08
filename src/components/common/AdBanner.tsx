import React from 'react';
import { siteConfig } from '../../config/siteConfig';

interface AdBannerProps {
  slot: string;
  className?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  className = '',
  format = 'horizontal'
}) => {
  if (!siteConfig.adsense.enabled) {
    return null;
  }

  const heightClass =
    format === 'rectangle' ? 'h-64' : format === 'responsive' ? 'h-24 sm:h-28' : 'h-24';

  return (
    <div
      className={`w-full max-w-5xl mx-auto my-6 px-4 no-print ${className}`}
      aria-label="Advertisement container"
    >
      <div
        className={`w-full ${heightClass} rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/40 flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 overflow-hidden relative`}
      >
        {siteConfig.adsense.showPlaceholderInDev ? (
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-[11px] tracking-wider uppercase text-slate-400 dark:text-slate-500">
              Advertisement Placeholder
            </span>
            <span className="text-[10px] text-slate-400/80">
              Slot ID: {slot} · Reserved space
            </span>
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={siteConfig.adsense.client}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
};
