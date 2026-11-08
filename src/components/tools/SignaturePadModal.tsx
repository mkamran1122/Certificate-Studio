import React, { useRef, useState, useEffect } from 'react';
import { Pen, Trash2, Download, Check, Upload, X } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSignature: (dataUrl: string) => void;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onInsertSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inkColor, setInkColor] = useState('#0F172A');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = strokeWidth;
  }, [isOpen, inkColor, strokeWidth]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = 'clientY' in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = 'clientY' in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setUploadedPreview(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedPreview(result);
      setHasDrawn(true);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw centered and scaled
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAndInsert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onInsertSignature(dataUrl);
    onClose();
  };

  const handleDownloadTransparent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'signature_transparent.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Pen className="w-4 h-4 text-blue-600" />
              Digital Signature Tool
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Draw a custom signature or upload an authorized signatory image
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Ink Color:</span>
              {[
                { label: 'Navy', hex: '#0F172A' },
                { label: 'Blue', hex: '#1E40AF' },
                { label: 'Gold', hex: '#B45309' },
                { label: 'Black', hex: '#000000' }
              ].map(c => (
                <button
                  key={c.hex}
                  onClick={() => setInkColor(c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    inkColor === c.hex ? 'scale-110 border-blue-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Stroke:</span>
              <input
                type="range"
                min="1"
                max="6"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-20 accent-blue-600"
              />
              <span className="font-mono text-slate-600 dark:text-slate-400">{strokeWidth}px</span>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 cursor-pointer font-medium text-slate-700 dark:text-slate-200 transition-colors">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload Signature Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Canvas area */}
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/70 dark:bg-slate-950/50 p-2 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={220}
              className="bg-transparent cursor-crosshair rounded touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />

            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
                <Pen className="w-8 h-8 opacity-40 mb-1" />
                <span className="text-sm">Sign here with mouse, trackpad, or finger</span>
                <span className="text-xs text-slate-400/80">Creates a high-resolution transparent vector image</span>
              </div>
            )}

            {/* Baseline guideline */}
            <div className="absolute bottom-12 left-12 right-12 border-b border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Signature processes locally in your browser.</span>
            {hasDrawn && (
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          {hasDrawn && (
            <button
              onClick={handleDownloadTransparent}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
          )}
          <button
            onClick={handleSaveAndInsert}
            disabled={!hasDrawn}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            Insert Signature into Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
