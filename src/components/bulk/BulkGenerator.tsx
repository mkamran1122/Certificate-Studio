import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileArchive,
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  CertificateProject,
  STANDARD_PLACEHOLDERS,
  BulkCsvRow,
  BulkMapping,
  BulkGenerationStatus
} from '../../types/certificate';
import { CERTIFICATE_TEMPLATES } from '../../data/templates';
import QRCode from 'qrcode';
import { CertificateCanvas } from '../canvas/CertificateCanvas';
import {
  substituteElementsForBulk,
  generateBulkZip,
  generateBulkMultiPagePdf,
  exportElementAsPng
} from '../../utils/exporter';
import { AdBanner } from '../common/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface BulkGeneratorProps {
  currentProject: CertificateProject;
  onOpenInEditor: (project: CertificateProject) => void;
}

const SAMPLE_CSV = `Recipient Name,Course Name,Issue Date,Certificate ID,Organization Name
Muhammad Ali,Full Stack Web Development,2026-11-01,CERT-2026-001,Metropolitan Academy
Ahmed Khan,UI/UX Product Design Masterclass,2026-11-02,CERT-2026-002,Metropolitan Academy
Sara Ahmed,Data Science & AI Engineering,2026-11-03,CERT-2026-003,Metropolitan Academy
Emily Watson,Executive Leadership & Strategy,2026-11-04,CERT-2026-004,Metropolitan Academy
Carlos Mendez,Cybersecurity & Network Defense,2026-11-05,CERT-2026-005,Metropolitan Academy
Amina Yusuf,Cloud Infrastructure & DevOps,2026-11-06,CERT-2026-006,Metropolitan Academy`;

export const BulkGenerator: React.FC<BulkGeneratorProps> = ({
  currentProject,
  onOpenInEditor
}) => {
  const [activeProject, setActiveProject] = useState<CertificateProject>(currentProject);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<BulkCsvRow[]>([]);
  const [mapping, setMapping] = useState<BulkMapping>({
    RECIPIENT_NAME: '',
    COURSE_NAME: '',
    ISSUE_DATE: '',
    CERTIFICATE_ID: '',
    ORGANIZATION_NAME: '',
    DESCRIPTION: '',
    INSTRUCTOR_NAME: '',
    SIGNATURE: ''
  });
  const [previewRowIndex, setPreviewRowIndex] = useState<number>(0);
  const [status, setStatus] = useState<BulkGenerationStatus>({
    total: 0,
    current: 0,
    status: 'idle',
    successCount: 0,
    errorCount: 0,
    errors: []
  });
  const [exportType, setExportType] = useState<'zip-pdf' | 'multipage-pdf'>('zip-pdf');
  const cancelFlagRef = useRef<boolean>(false);
  const previewCanvasRef = useRef<HTMLDivElement | null>(null);

  // Auto-detect matching CSV headers to placeholders
  const autoDetectMapping = (columns: string[], mapState: BulkMapping): BulkMapping => {
    const updated = { ...mapState };
    columns.forEach(col => {
      const lower = col.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (lower.includes('recipient') || lower.includes('student') || lower.includes('fullname') || lower === 'name') {
        if (!updated.RECIPIENT_NAME) updated.RECIPIENT_NAME = col;
      } else if (lower.includes('course') || lower.includes('program') || lower.includes('event') || lower.includes('topic')) {
        if (!updated.COURSE_NAME) updated.COURSE_NAME = col;
      } else if (lower.includes('date') || lower.includes('issued')) {
        if (!updated.ISSUE_DATE) updated.ISSUE_DATE = col;
      } else if (lower.includes('id') || lower.includes('serial') || lower.includes('credential')) {
        if (!updated.CERTIFICATE_ID) updated.CERTIFICATE_ID = col;
      } else if (lower.includes('org') || lower.includes('school') || lower.includes('company') || lower.includes('issuer')) {
        if (!updated.ORGANIZATION_NAME) updated.ORGANIZATION_NAME = col;
      } else if (lower.includes('instructor') || lower.includes('teacher') || lower.includes('mentor')) {
        if (!updated.INSTRUCTOR_NAME) updated.INSTRUCTOR_NAME = col;
      }
    });
    return updated;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<BulkCsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields && results.data.length > 0) {
          const cols = results.meta.fields;
          setCsvColumns(cols);
          setCsvData(results.data);
          setMapping(prev => autoDetectMapping(cols, prev));
          setPreviewRowIndex(0);
        }
      },
      error: (err) => {
        alert('Failed to parse CSV file: ' + err.message);
      }
    });
  };

  const handleLoadSampleCsv = () => {
    Papa.parse<BulkCsvRow>(SAMPLE_CSV, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields && results.data.length > 0) {
          const cols = results.meta.fields;
          setCsvColumns(cols);
          setCsvData(results.data);
          setMapping(prev => autoDetectMapping(cols, prev));
          setPreviewRowIndex(0);
        }
      }
    });
  };

  const handleDownloadSampleCsvTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'certificate_bulk_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Validation checks
  const getValidationWarnings = () => {
    const warnings: string[] = [];
    if (!mapping.RECIPIENT_NAME) {
      warnings.push('Recipient Name column is not mapped. Generated certificates will show the placeholder text.');
    }

    if (csvData.length > 0 && mapping.CERTIFICATE_ID) {
      const idCol = mapping.CERTIFICATE_ID;
      const seen = new Set<string>();
      let hasDuplicates = false;
      for (const row of csvData) {
        const val = row[idCol];
        if (val) {
          if (seen.has(val)) {
            hasDuplicates = true;
            break;
          }
          seen.add(val);
        }
      }
      if (hasDuplicates) {
        warnings.push('Duplicate Certificate IDs detected in your CSV data.');
      }
    }

    return warnings;
  };

  // Live preview element substitutions for currently selected preview row
  const currentPreviewElements =
    csvData.length > 0 && csvData[previewRowIndex]
      ? substituteElementsForBulk(activeProject.elements, csvData[previewRowIndex], mapping)
      : activeProject.elements;

  // Run Bulk Generation
  const handleStartGeneration = async () => {
    if (csvData.length === 0) return;

    cancelFlagRef.current = false;
    setStatus({
      total: csvData.length,
      current: 0,
      status: 'generating',
      successCount: 0,
      errorCount: 0,
      errors: []
    });

    try {
      // Dynamic rendering callback function
      const renderRowToImage = async (rowData: Record<string, string>): Promise<string> => {
        // Temporarily set preview row and capture rendered DOM
        const targetElements = substituteElementsForBulk(activeProject.elements, rowData, mapping);

        // Create temporary offscreen container
        const offscreenContainer = document.createElement('div');
        offscreenContainer.style.position = 'fixed';
        offscreenContainer.style.top = '-9999px';
        offscreenContainer.style.left = '-9999px';
        offscreenContainer.style.width = `${activeProject.width}px`;
        offscreenContainer.style.height = `${activeProject.height}px`;
        offscreenContainer.style.backgroundColor = activeProject.background.color || '#FFFFFF';
        document.body.appendChild(offscreenContainer);

        // Clone current preview DOM with updated texts
        if (previewCanvasRef.current) {
          const clone = previewCanvasRef.current.cloneNode(true) as HTMLElement;
          clone.style.transform = 'none';
          clone.style.width = `${activeProject.width}px`;
          clone.style.height = `${activeProject.height}px`;

          // Replace text and QR code elements inside clone
          for (const el of targetElements) {
            if (el.type === 'text') {
              const domEl = clone.querySelector(`[data-element-id="${el.id}"]`);
              if (domEl) {
                const textContainer = domEl.firstElementChild;
                if (textContainer) {
                  textContainer.textContent = el.content || '';
                }
              }
            } else if (el.type === 'qr' && el.qrValue) {
              const domEl = clone.querySelector(`[data-element-id="${el.id}"]`);
              if (domEl) {
                const qrImg = domEl.querySelector('img');
                if (qrImg) {
                  try {
                    const qrUrl = await QRCode.toDataURL(el.qrValue, {
                      color: {
                        dark: el.qrColor || '#000000',
                        light: el.qrBgColor || '#00000000'
                      },
                      margin: 1,
                      width: Math.max(128, el.width * 2)
                    });
                    qrImg.src = qrUrl;
                  } catch (err) {
                    console.error('QR code generation failed in bulk', err);
                  }
                }
              }
            }
          }

          offscreenContainer.appendChild(clone);
          const dataUrl = await exportElementAsPng(clone, { pixelRatio: 2.2 });
          document.body.removeChild(offscreenContainer);
          return dataUrl;
        }

        throw new Error('Preview canvas not ready');
      };

      const nameCol = mapping.RECIPIENT_NAME || 'Recipient Name';
      const idCol = mapping.CERTIFICATE_ID || 'Certificate ID';

      if (exportType === 'zip-pdf') {
        const zipBlob = await generateBulkZip(
          renderRowToImage,
          csvData,
          activeProject,
          nameCol,
          idCol,
          (curr, tot) => {
            setStatus(prev => ({
              ...prev,
              current: curr,
              successCount: curr
            }));
          },
          () => cancelFlagRef.current
        );

        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Bulk_Certificates_${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const pdfBlob = await generateBulkMultiPagePdf(
          renderRowToImage,
          csvData,
          activeProject,
          (curr, tot) => {
            setStatus(prev => ({
              ...prev,
              current: curr,
              successCount: curr
            }));
          },
          () => cancelFlagRef.current
        );

        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `All_Certificates_Combined_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setStatus(prev => ({ ...prev, status: 'completed' }));
    } catch (e: any) {
      if (cancelFlagRef.current) {
        setStatus(prev => ({ ...prev, status: 'cancelled' }));
      } else {
        console.error('Bulk generation error', e);
        setStatus(prev => ({
          ...prev,
          status: 'error',
          errors: [e.message || 'Generation failed']
        }));
      }
    }
  };

  const handleCancelGeneration = () => {
    cancelFlagRef.current = true;
  };

  const warnings = getValidationWarnings();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Bulk Certificate Generator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Upload student or attendee records via CSV, map placeholders, and instantly generate hundreds of print-ready certificates in a single ZIP or combined PDF.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenInEditor(activeProject)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Edit Certificate Design
          </button>
        </div>
      </div>

      {/* Main Grid: Upload & Mapping (Left) + Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Upload CSV */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Step 1: Upload Recipient CSV
              </h3>
              <button
                onClick={handleDownloadSampleCsvTemplate}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Sample CSV Template
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-950/40">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <label className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                  Click to select CSV file
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>{' '}
                or drag and drop here
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports UTF-8 CSV with column headers (Name, Course, Date, ID)
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3">
                <span className="text-[11px] text-slate-500">Need test data?</span>
                <button
                  onClick={handleLoadSampleCsv}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-md transition-colors"
                >
                  Load 6 Sample Recipients
                </button>
              </div>
            </div>

            {csvData.length > 0 && (
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Loaded {csvData.length} recipients across {csvColumns.length} columns
                </span>
                <button
                  onClick={() => {
                    setCsvData([]);
                    setCsvColumns([]);
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Map Placeholders */}
          {csvColumns.length > 0 && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Step 2: Map Certificate Placeholders to CSV Columns
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                {STANDARD_PLACEHOLDERS.map(ph => (
                  <div
                    key={ph.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {ph.label}
                      </span>
                      <span className="text-slate-400 font-mono ml-2">[{ph.key}]</span>
                    </div>

                    <select
                      value={mapping[ph.key] || ''}
                      onChange={(e) =>
                        setMapping(prev => ({ ...prev, [ph.key]: e.target.value }))
                      }
                      className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 max-w-[200px]"
                    >
                      <option value="">-- Do Not Replace --</option>
                      {csvColumns.map(col => (
                        <option key={col} value={col}>
                          Column: {col}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Validation Warnings */}
              {warnings.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Validation Notice
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                    {warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Generation Action */}
          {csvData.length > 0 && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileArchive className="w-4 h-4 text-blue-600" />
                Step 3: Export & Download
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => setExportType('zip-pdf')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    exportType === 'zip-pdf'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <FileArchive className="w-4 h-4 text-blue-600" />
                    Bulk ZIP of PDFs
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Individual print-ready PDF for every recipient named properly
                  </p>
                </button>

                <button
                  onClick={() => setExportType('multipage-pdf')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    exportType === 'multipage-pdf'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Single Multi-Page PDF
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    All certificates bound in one continuous multi-page PDF document
                  </p>
                </button>
              </div>

              {/* Progress bar if generating */}
              {status.status === 'generating' && (
                <div className="space-y-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-blue-600">
                      Generating certificates... ({status.current} of {status.total})
                    </span>
                    <span className="font-mono tabular-nums">
                      {Math.round((status.current / status.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-150"
                      style={{
                        width: `${Math.round((status.current / status.total) * 100)}%`
                      }}
                    />
                  </div>
                  <button
                    onClick={handleCancelGeneration}
                    className="text-xs text-red-600 hover:text-red-700 font-medium underline"
                  >
                    Cancel Generation
                  </button>
                </div>
              )}

              {status.status === 'completed' && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Successfully generated and downloaded all {csvData.length} certificates!
                </div>
              )}

              {status.status !== 'generating' && (
                <button
                  onClick={handleStartGeneration}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Generate All {csvData.length} Certificates Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right column (6 cols): Live Preview with slider */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Live Output Preview
            </h3>

            {csvData.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">
                  Recipient {previewRowIndex + 1} of {csvData.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={previewRowIndex === 0}
                    onClick={() => setPreviewRowIndex(prev => Math.max(0, prev - 1))}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={previewRowIndex >= csvData.length - 1}
                    onClick={() =>
                      setPreviewRowIndex(prev => Math.min(csvData.length - 1, prev + 1))
                    }
                    className="p-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full overflow-hidden p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[420px]">
            <div className="relative origin-top" style={{ transform: 'scale(0.48)' }}>
              <CertificateCanvas
                domRef={previewCanvasRef}
                width={activeProject.width}
                height={activeProject.height}
                background={activeProject.background}
                border={activeProject.border}
                elements={currentPreviewElements}
                selectedElementId={null}
                onSelectElement={() => {}}
                onUpdateElement={() => {}}
                readOnly={true}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Template:{' '}
              <strong className="text-slate-700 dark:text-slate-300">
                {activeProject.name}
              </strong>{' '}
              ({activeProject.orientation})
            </span>
            <span>All rendering occurs securely in your browser</span>
          </div>
        </div>
      </div>

      {/* AdSense readiness banner */}
      <AdBanner slot={siteConfig.adsense.slots.homeHeroBottom} format="responsive" />
    </div>
  );
};
