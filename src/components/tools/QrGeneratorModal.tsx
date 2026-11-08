import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode as QrIcon, X, Download, Plus, Copy, Check } from 'lucide-react';

interface QrGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertQr?: (qrValue: string, darkColor: string) => void;
}

export const QrGeneratorModal: React.FC<QrGeneratorModalProps> = ({
  isOpen,
  onClose,
  onInsertQr
}) => {
  const [qrType, setQrType] = useState<'url' | 'id' | 'custom'>('url');
  const [urlValue, setUrlValue] = useState('https://certificatestudio.app/verify/sample-cert');
  const [idValue, setIdValue] = useState('CERT-2026-98421');
  const [customText, setCustomText] = useState('Certificate of Achievement issued to Muhammad Ali');
  const [darkColor, setDarkColor] = useState('#0F172A');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const activeValue =
    qrType === 'url' ? urlValue : qrType === 'id' ? `https://certificatestudio.app/verify/${idValue}` : customText;

  useEffect(() => {
    if (!isOpen || !activeValue) return;

    QRCode.toDataURL(activeValue, {
      width: 320,
      margin: 2,
      color: {
        dark: darkColor,
        light: '#FFFFFF'
      }
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('Error generating QR', err));
  }, [isOpen, activeValue, darkColor]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `certificate_qr_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleInsert = () => {
    if (onInsertQr) {
      onInsertQr(activeValue, darkColor);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <QrIcon className="w-4 h-4 text-blue-600" />
              Certificate QR Verification Generator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Encode verification links, student IDs, or credential tokens into high-res scannable QR codes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Target Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setQrType('url')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                qrType === 'url' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Verification URL
            </button>
            <button
              onClick={() => setQrType('id')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                qrType === 'id' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Certificate ID
            </button>
            <button
              onClick={() => setQrType('custom')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                qrType === 'custom' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Custom Text
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Input fields */}
            <div className="space-y-4">
              {qrType === 'url' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Verification Endpoint / Target URL:
                  </label>
                  <input
                    type="url"
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Tip: Enter your organization’s verification or credential lookup web page.
                  </span>
                </div>
              )}

              {qrType === 'id' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Certificate Serial / ID:
                  </label>
                  <input
                    type="text"
                    value={idValue}
                    onChange={(e) => setIdValue(e.target.value)}
                    placeholder="CERT-2026-..."
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {qrType === 'custom' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Encoded Raw Text:
                  </label>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  QR Module Color:
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Deep Slate', hex: '#0F172A' },
                    { label: 'Navy', hex: '#1E3A8A' },
                    { label: 'Gold', hex: '#B45309' },
                    { label: 'Emerald', hex: '#065F46' },
                    { label: 'Black', hex: '#000000' }
                  ].map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setDarkColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        darkColor === c.hex ? 'scale-110 border-blue-500' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live QR Preview */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Generated QR Code"
                  className="w-44 h-44 rounded-md shadow-xs bg-white p-2"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center bg-white rounded-md text-xs text-slate-400">
                  Generating...
                </div>
              )}
              <span className="text-[11px] font-mono text-slate-500 mt-2 truncate max-w-[200px]">
                {activeValue}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Scans with any smartphone camera</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
            {onInsertQr && (
              <button
                onClick={handleInsert}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
