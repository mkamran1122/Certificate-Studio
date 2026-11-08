import React, { useState } from 'react';
import { Hash, X, RefreshCw, Copy, Check, Download } from 'lucide-react';

interface IdGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyId?: (id: string) => void;
}

export const IdGeneratorModal: React.FC<IdGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyId
}) => {
  const [prefix, setPrefix] = useState('CERT-2026-');
  const [format, setFormat] = useState<'numeric' | 'alphanumeric' | 'uuid'>('numeric');
  const [digits, setDigits] = useState<number>(6);
  const [batchCount, setBatchCount] = useState<number>(10);
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateSingleId = (): string => {
    if (format === 'numeric') {
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      const num = Math.floor(min + Math.random() * (max - min + 1));
      return `${prefix}${num}`;
    }
    if (format === 'alphanumeric') {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < digits; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${prefix}${result}`;
    }
    // UUID-like short
    return `${prefix}${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  const handleGenerateBatch = () => {
    const list: string[] = [];
    const count = Math.min(100, Math.max(1, batchCount));
    for (let i = 0; i < count; i++) {
      list.push(generateSingleId());
    }
    setGeneratedIds(list);
  };

  React.useEffect(() => {
    if (isOpen) {
      handleGenerateBatch();
    }
  }, [isOpen, prefix, format, digits]);

  if (!isOpen) return null;

  const handleCopySingle = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownloadCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Certificate ID\n' + generatedIds.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `generated_certificate_ids_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-600" />
              Certificate ID & Serial Number Generator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate unique, anti-collision certificate serial codes for individual or bulk issuance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Prefix:</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Format:</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="numeric">Numbers Only (e.g. 984210)</option>
                <option value="alphanumeric">Alphanumeric (e.g. 7X8K2M)</option>
                <option value="uuid">Dual Block (e.g. A9F2-C84E)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Batch Count:</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleGenerateBatch}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Generated ID list */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Generated Serial Numbers ({generatedIds.length})</span>
              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono text-xs">
              {generatedIds.map((id, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 hover:border-blue-300 transition-colors"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{id}</span>
                  <div className="flex items-center gap-1.5">
                    {onApplyId && (
                      <button
                        onClick={() => {
                          onApplyId(id);
                          onClose();
                        }}
                        className="px-2 py-0.5 text-[11px] font-sans font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                      >
                        Apply to Design
                      </button>
                    )}
                    <button
                      onClick={() => handleCopySingle(id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                      title="Copy ID"
                    >
                      {copiedId === id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
