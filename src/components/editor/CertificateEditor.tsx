import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LayoutTemplate,
  Type,
  Award,
  Frame,
  Upload,
  QrCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Download,
  Save,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PenTool,
  Share2,
  FileText,
  FileImage,
  FileCheck
} from 'lucide-react';
import {
  CertificateElement,
  CertificateProject,
  PageOrientation,
  PageFormat,
  PAGE_SIZES,
  STANDARD_PLACEHOLDERS,
  CertificateTemplate
} from '../../types/certificate';
import { CERTIFICATE_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/templates';
import { CertificateCanvas } from '../canvas/CertificateCanvas';
import { downloadPdf, downloadPng, downloadJpeg } from '../../utils/exporter';
import { storage } from '../../utils/storage';
import { SignaturePadModal } from '../tools/SignaturePadModal';
import { QrGeneratorModal } from '../tools/QrGeneratorModal';
import { PaletteFontPickerModal } from '../tools/PaletteFontPickerModal';
import { SizeCalculatorModal } from '../tools/SizeCalculatorModal';
import { AdBanner } from '../common/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface CertificateEditorProps {
  initialProject?: CertificateProject | null;
  onNavigateToBulk?: (project: CertificateProject) => void;
  onNavigateToProjects?: () => void;
}

export const CertificateEditor: React.FC<CertificateEditorProps> = ({
  initialProject,
  onNavigateToBulk,
  onNavigateToProjects
}) => {
  // Use first template as fallback if no project provided
  const fallbackTemplate = CERTIFICATE_TEMPLATES[0];

  const createInitialProject = (): CertificateProject => {
    if (initialProject) return initialProject;
    return {
      id: 'proj_' + Date.now(),
      name: fallbackTemplate.name,
      templateId: fallbackTemplate.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      width: fallbackTemplate.width,
      height: fallbackTemplate.height,
      orientation: fallbackTemplate.orientation,
      format: fallbackTemplate.format,
      background: { ...fallbackTemplate.background },
      border: { ...fallbackTemplate.border },
      elements: fallbackTemplate.elements.map(el => ({ ...el }))
    };
  };

  const [project, setProject] = useState<CertificateProject>(createInitialProject);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState<'templates' | 'text' | 'elements' | 'border' | 'uploads' | 'qr'>('templates');
  const [scale, setScale] = useState<number>(0.68);
  const [history, setHistory] = useState<CertificateProject[]>([createInitialProject()]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showLeftSubPanel, setShowLeftSubPanel] = useState<boolean>(true);
  const [showInspector, setShowInspector] = useState<boolean>(true);
  const [editorTmplSearch, setEditorTmplSearch] = useState<string>('');
  const [editorTmplCategory, setEditorTmplCategory] = useState<string>('All');
  const [editorTmplLimit, setEditorTmplLimit] = useState<number>(25);

  // Modals
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
  const [isSizeCalcOpen, setIsSizeCalcOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasDomRef = useRef<HTMLDivElement | null>(null);
  const clipboardRef = useRef<CertificateElement | null>(null);
  const projectRef = useRef<CertificateProject>(project);
  projectRef.current = project;

  // Fit to screen calculation
  const fitToScreen = useCallback(() => {
    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const padding = 64;
    const availW = container.clientWidth - padding;
    const availH = container.clientHeight - padding;
    const scaleW = availW / project.width;
    const scaleH = availH / project.height;
    const optimalScale = Math.min(1.2, Math.max(0.3, Math.min(scaleW, scaleH)));
    setScale(Number(optimalScale.toFixed(2)));
  }, [project.width, project.height]);

  useEffect(() => {
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, [fitToScreen]);

  // History push on state change
  const pushHistory = (newProject: CertificateProject) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newProject);
    // Keep max 30 history states
    if (updatedHistory.length > 30) updatedHistory.shift();
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setProject(newProject);
    storage.saveActiveDraft(newProject);
  };

  const handleDragEnd = () => {
    pushHistory(projectRef.current);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prev);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(next);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        // Copy selected element
        if (selectedElementId) {
          const el = project.elements.find(item => item.id === selectedElementId);
          if (el) clipboardRef.current = el;
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        // Paste copied element
        if (clipboardRef.current) {
          e.preventDefault();
          const clone: CertificateElement = {
            ...clipboardRef.current,
            id: 'el_' + Date.now(),
            x: clipboardRef.current.x + 20,
            y: clipboardRef.current.y + 20
          };
          const updated = {
            ...project,
            elements: [...project.elements, clone]
          };
          pushHistory(updated);
          setSelectedElementId(clone.id);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          deleteSelectedElement();
        }
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedElementId) {
          e.preventDefault();
          const delta = e.shiftKey ? 10 : 1;
          const el = project.elements.find(item => item.id === selectedElementId);
          if (el && !el.locked) {
            let dx = 0;
            let dy = 0;
            if (e.key === 'ArrowUp') dy = -delta;
            if (e.key === 'ArrowDown') dy = delta;
            if (e.key === 'ArrowLeft') dx = -delta;
            if (e.key === 'ArrowRight') dx = delta;
            updateElement(selectedElementId, { x: el.x + dx, y: el.y + dy });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex, selectedElementId, project]);

  // Element actions
  const updateElement = (id: string, updates: Partial<CertificateElement>) => {
    const updatedElements = project.elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    const updated = { ...project, elements: updatedElements };
    setProject(updated);
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    const updated = {
      ...project,
      elements: project.elements.filter(el => el.id !== selectedElementId)
    };
    setSelectedElementId(null);
    pushHistory(updated);
  };

  const duplicateSelectedElement = () => {
    if (!selectedElementId) return;
    const el = project.elements.find(item => item.id === selectedElementId);
    if (!el) return;
    const clone: CertificateElement = {
      ...el,
      id: 'el_' + Date.now(),
      x: el.x + 20,
      y: el.y + 20
    };
    const updated = {
      ...project,
      elements: [...project.elements, clone]
    };
    pushHistory(updated);
    setSelectedElementId(clone.id);
  };

  const changeLayerOrder = (direction: 'front' | 'back' | 'forward' | 'backward') => {
    if (!selectedElementId) return;
    const elements = [...project.elements];
    const index = elements.findIndex(el => el.id === selectedElementId);
    if (index === -1) return;

    const el = elements[index];
    elements.splice(index, 1);

    if (direction === 'front') {
      elements.push(el);
    } else if (direction === 'back') {
      elements.unshift(el);
    } else if (direction === 'forward') {
      elements.splice(Math.min(elements.length, index + 1), 0, el);
    } else if (direction === 'backward') {
      elements.splice(Math.max(0, index - 1), 0, el);
    }

    const updated = { ...project, elements };
    pushHistory(updated);
  };

  // Add text element
  const addTextElement = (type: 'title' | 'sub' | 'recipient' | 'desc' | 'date' | 'id') => {
    const cx = project.width / 2;
    let newEl: CertificateElement;

    if (type === 'title') {
      newEl = {
        id: 'el_' + Date.now(),
        type: 'text',
        x: cx - 350,
        y: 180,
        width: 700,
        height: 50,
        content: 'CERTIFICATE OF ACHIEVEMENT',
        fontFamily: 'Cinzel',
        fontSize: 32,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        letterSpacing: 2
      };
    } else if (type === 'recipient') {
      newEl = {
        id: 'el_' + Date.now(),
        type: 'text',
        x: cx - 350,
        y: 280,
        width: 700,
        height: 60,
        content: '[RECIPIENT_NAME]',
        fontFamily: 'Playfair Display',
        fontSize: 42,
        fontWeight: '700',
        color: '#2563EB',
        textAlign: 'center',
        placeholderKey: 'RECIPIENT_NAME'
      };
    } else if (type === 'desc') {
      newEl = {
        id: 'el_' + Date.now(),
        type: 'text',
        x: cx - 350,
        y: 360,
        width: 700,
        height: 70,
        content: 'In recognition of outstanding dedication, sustained diligence, and commendable personal contributions in [COURSE_NAME].',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: '400',
        color: '#334155',
        textAlign: 'center',
        lineHeight: 1.5,
        placeholderKey: 'DESCRIPTION'
      };
    } else if (type === 'date') {
      newEl = {
        id: 'el_' + Date.now(),
        type: 'text',
        x: 160,
        y: 580,
        width: 240,
        height: 25,
        content: '[ISSUE_DATE]',
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        textAlign: 'center',
        placeholderKey: 'ISSUE_DATE'
      };
    } else if (type === 'id') {
      newEl = {
        id: 'el_' + Date.now(),
        type: 'text',
        x: cx - 250,
        y: project.height - 70,
        width: 500,
        height: 20,
        content: 'CERTIFICATE ID: [CERTIFICATE_ID]',
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        color: '#94A3B8',
        textAlign: 'center',
        letterSpacing: 1.5,
        placeholderKey: 'CERTIFICATE_ID'
      };
    } else {
      newEl = {
        id: 'el_' + Date.now(),
        type: 'text',
        x: cx - 300,
        y: 240,
        width: 600,
        height: 25,
        content: 'PROUDLY CONFERRED WITH APPRECIATION TO',
        fontFamily: 'Montserrat',
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
        letterSpacing: 3
      };
    }

    const updated = { ...project, elements: [...project.elements, newEl] };
    pushHistory(updated);
    setSelectedElementId(newEl.id);
  };

  // Add badge
  const addBadgeElement = (badgeType: 'gold-seal' | 'laurel-wreath' | 'ribbon-star' | 'modern-shield') => {
    const cx = project.width / 2;
    const newBadge: CertificateElement = {
      id: 'el_' + Date.now(),
      type: 'badge',
      badgeType,
      x: cx - 45,
      y: project.height / 2 + 50,
      width: 90,
      height: 90,
      fill: badgeType === 'modern-shield' ? '#2563EB' : '#C5A059',
      stroke: badgeType === 'modern-shield' ? '#1D4ED8' : '#8C6D2D'
    };
    const updated = { ...project, elements: [...project.elements, newBadge] };
    pushHistory(updated);
    setSelectedElementId(newBadge.id);
  };

  // Add divider line
  const addDividerLine = () => {
    const cx = project.width / 2;
    const newLine: CertificateElement = {
      id: 'el_' + Date.now(),
      type: 'line',
      x: cx - 200,
      y: 400,
      width: 400,
      height: 2,
      stroke: '#C5A059',
      strokeWidth: 2
    };
    const updated = { ...project, elements: [...project.elements, newLine] };
    pushHistory(updated);
    setSelectedElementId(newLine.id);
  };

  // Add QR element
  const addQrCode = (qrValue: string, darkColor: string = '#0F172A') => {
    const newQr: CertificateElement = {
      id: 'el_' + Date.now(),
      type: 'qr',
      x: project.width - 150,
      y: project.height - 150,
      width: 80,
      height: 80,
      qrValue,
      qrColor: darkColor
    };
    const updated = { ...project, elements: [...project.elements, newQr] };
    pushHistory(updated);
    setSelectedElementId(newQr.id);
  };

  // Add custom image/signature
  const handleInsertImage = (dataUrl: string) => {
    const newImg: CertificateElement = {
      id: 'el_' + Date.now(),
      type: 'image',
      x: project.width / 2 - 100,
      y: project.height / 2,
      width: 200,
      height: 80,
      src: dataUrl
    };
    const updated = { ...project, elements: [...project.elements, newImg] };
    pushHistory(updated);
    setSelectedElementId(newImg.id);
  };

  // Image file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleInsertImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Switch template
  const loadTemplate = (tmpl: CertificateTemplate) => {
    const updated: CertificateProject = {
      ...project,
      templateId: tmpl.id,
      name: tmpl.name,
      width: tmpl.width,
      height: tmpl.height,
      orientation: tmpl.orientation,
      format: tmpl.format,
      background: { ...tmpl.background },
      border: { ...tmpl.border },
      elements: tmpl.elements.map(el => ({ ...el, id: 'el_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6) }))
    };
    setSelectedElementId(null);
    pushHistory(updated);
    setTimeout(fitToScreen, 100);
  };

  // Save Project
  const handleSaveProject = () => {
    storage.saveProject(project);
    setSaveSuccessMsg('Project saved to browser storage!');
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // Export handlers
  const handleExportPdf = async () => {
    if (!canvasDomRef.current) return;
    setIsExportMenuOpen(false);
    await downloadPdf(
      canvasDomRef.current,
      project.orientation,
      project.format,
      `${project.name}.pdf`,
      project.width,
      project.height
    );
  };

  const handleExportPng = async () => {
    if (!canvasDomRef.current) return;
    setIsExportMenuOpen(false);
    await downloadPng(canvasDomRef.current, `${project.name}.png`);
  };

  const handleExportJpeg = async () => {
    if (!canvasDomRef.current) return;
    setIsExportMenuOpen(false);
    await downloadJpeg(canvasDomRef.current, `${project.name}.jpg`);
  };

  // Currently selected element object
  const selectedElem = project.elements.find(el => el.id === selectedElementId);

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Top Editor Toolbar */}
      <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-4 shrink-0 z-20">
        {/* Left: Project title & Undo/Redo */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={project.name}
            onChange={(e) => {
              const updated = { ...project, name: e.target.value };
              setProject(updated);
            }}
            className="text-sm font-bold text-slate-900 dark:text-slate-100 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 px-2 py-1 rounded-md border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 max-w-[220px] sm:max-w-xs truncate"
          />

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Canvas Zoom Controls */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setScale(prev => Math.max(0.25, Number((prev - 0.1).toFixed(2))))}
            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums px-1">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))))}
            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={fitToScreen}
            className="ml-1 px-2 py-0.5 text-[11px] font-medium rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            Fit
          </button>
        </div>

        {/* Right: Save, Bulk Gen, Export */}
        <div className="flex items-center gap-2">
          {saveSuccessMsg && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in hidden sm:inline">
              {saveSuccessMsg}
            </span>
          )}

          <button
            onClick={handleSaveProject}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Save Design</span>
          </button>

          {onNavigateToBulk && (
            <button
              onClick={() => onNavigateToBulk(project)}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Bulk Generate</span>
            </button>
          )}

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={handleExportPdf}
                  className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-500" />
                  <div>
                    <div className="font-semibold">Print-Ready PDF</div>
                    <div className="text-[10px] text-slate-400">High-res vector output ({project.orientation})</div>
                  </div>
                </button>

                <button
                  onClick={handleExportPng}
                  className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <FileImage className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-semibold">High-Res PNG</div>
                    <div className="text-[10px] text-slate-400">2.5× crisp image for web & social</div>
                  </div>
                </button>

                <button
                  onClick={handleExportJpeg}
                  className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-semibold">Standard JPEG</div>
                    <div className="text-[10px] text-slate-400">Compressed file for email & sharing</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar Tabs (Icons Column) */}
        <div className="w-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 gap-2 shrink-0 z-10">
          {[
            { id: 'templates', label: 'Templates', icon: LayoutTemplate },
            { id: 'text', label: 'Text', icon: Type },
            { id: 'elements', label: 'Badges', icon: Award },
            { id: 'border', label: 'Borders', icon: Frame },
            { id: 'uploads', label: 'Uploads', icon: Upload },
            { id: 'qr', label: 'QR Code', icon: QrCode }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeLeftTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id as any)}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                title={tab.label}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => setIsPaletteModalOpen(true)}
              className="w-12 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Curated Palettes & Font Pairings"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSizeCalcOpen(true)}
              className="w-12 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Size & DPI Calculator"
            >
              <Frame className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Left Sub-Panel (Expanded Content for Tab) */}
        <div className="w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 shrink-0 z-10 space-y-4">
          {/* TAB 1: TEMPLATES */}
          {activeLeftTab === 'templates' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Certificate Templates
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse 1,000+ professional designs
                </p>
              </div>

              {/* Template Search & Category Filter */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search 1,000+ templates..."
                  value={editorTmplSearch}
                  onChange={(e) => {
                    setEditorTmplSearch(e.target.value);
                    setEditorTmplLimit(25);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <select
                  value={editorTmplCategory}
                  onChange={(e) => {
                    setEditorTmplCategory(e.target.value);
                    setEditorTmplLimit(25);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {TEMPLATE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtered Templates List */}
              <div className="space-y-2.5">
                {CERTIFICATE_TEMPLATES.filter(tmpl => {
                  if (editorTmplCategory !== 'All' && tmpl.category !== editorTmplCategory) return false;
                  if (editorTmplSearch.trim()) {
                    const q = editorTmplSearch.toLowerCase().trim();
                    return (
                      tmpl.name.toLowerCase().includes(q) ||
                      tmpl.description.toLowerCase().includes(q) ||
                      tmpl.tags.some(t => t.toLowerCase().includes(q))
                    );
                  }
                  return true;
                })
                  .slice(0, editorTmplLimit)
                  .map(tmpl => (
                    <div
                      key={tmpl.id}
                      onClick={() => loadTemplate(tmpl)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        project.templateId === tmpl.id
                          ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 ring-1 ring-blue-600'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100">
                        <span className="truncate max-w-[170px]">{tmpl.name}</span>
                        <span className="text-[10px] text-blue-600 uppercase font-mono">
                          {tmpl.orientation}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {tmpl.description}
                      </p>
                    </div>
                  ))}

                {CERTIFICATE_TEMPLATES.filter(tmpl => {
                  if (editorTmplCategory !== 'All' && tmpl.category !== editorTmplCategory) return false;
                  if (editorTmplSearch.trim()) {
                    const q = editorTmplSearch.toLowerCase().trim();
                    return (
                      tmpl.name.toLowerCase().includes(q) ||
                      tmpl.description.toLowerCase().includes(q) ||
                      tmpl.tags.some(t => t.toLowerCase().includes(q))
                    );
                  }
                  return true;
                }).length > editorTmplLimit && (
                  <button
                    onClick={() => setEditorTmplLimit(prev => prev + 25)}
                    className="w-full py-2 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    + Load More Templates
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TEXT */}
          {activeLeftTab === 'text' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Add Certificate Text
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Insert dynamic placeholders or custom labels
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => addTextElement('title')}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-left transition-colors font-bold text-sm"
                >
                  + Add Heading (Title)
                </button>
                <button
                  onClick={() => addTextElement('sub')}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-left transition-colors font-medium text-xs text-slate-600 dark:text-slate-300"
                >
                  + Add Subtitle / Commendation Line
                </button>
                <button
                  onClick={() => addTextElement('recipient')}
                  className="w-full p-2.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 hover:border-blue-500 text-left transition-colors font-serif font-bold text-base text-blue-700 dark:text-blue-300"
                >
                  + Add [RECIPIENT_NAME]
                </button>
                <button
                  onClick={() => addTextElement('desc')}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-left transition-colors text-xs text-slate-600 dark:text-slate-300"
                >
                  + Add Body Description Paragraph
                </button>
                <button
                  onClick={() => addTextElement('date')}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-left transition-colors text-xs font-mono"
                >
                  + Add [ISSUE_DATE]
                </button>
                <button
                  onClick={() => addTextElement('id')}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-left transition-colors text-xs font-mono"
                >
                  + Add [CERTIFICATE_ID]
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ELEMENTS & BADGES */}
          {activeLeftTab === 'elements' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Decorative Badges & Seals
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add metallic seals, crests, and dividers
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => addBadgeElement('gold-seal')}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 flex flex-col items-center gap-2 transition-colors"
                >
                  <Award className="w-6 h-6 text-amber-500" />
                  <span className="font-medium">Gold Seal</span>
                </button>
                <button
                  onClick={() => addBadgeElement('laurel-wreath')}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 flex flex-col items-center gap-2 transition-colors"
                >
                  <Award className="w-6 h-6 text-emerald-600" />
                  <span className="font-medium">Laurel Wreath</span>
                </button>
                <button
                  onClick={() => addBadgeElement('ribbon-star')}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 flex flex-col items-center gap-2 transition-colors"
                >
                  <Award className="w-6 h-6 text-indigo-500" />
                  <span className="font-medium">Ribbon Star</span>
                </button>
                <button
                  onClick={() => addBadgeElement('modern-shield')}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 flex flex-col items-center gap-2 transition-colors"
                >
                  <Award className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Modern Shield</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={addDividerLine}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  + Add Horizontal Line Divider
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: BORDERS & BACKGROUND */}
          {activeLeftTab === 'border' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Borders & Background
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure perimeter styling and canvas fill
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Border Frame Style:
                  </label>
                  <select
                    value={project.border.style}
                    onChange={(e) => {
                      const updated = {
                        ...project,
                        border: { ...project.border, style: e.target.value as any }
                      };
                      pushHistory(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="classic-double">Classic Double Frame</option>
                    <option value="gold-embossed">Gold Embossed Multi-Line</option>
                    <option value="modern-accent">Modern Geometric Accents</option>
                    <option value="minimal">Minimalist Hairline</option>
                    <option value="none">No Border</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Primary Border Color:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={project.border.color}
                      onChange={(e) => {
                        const updated = {
                          ...project,
                          border: { ...project.border, color: e.target.value }
                        };
                        setProject(updated);
                      }}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {project.border.color}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Background Color:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={project.background.color}
                      onChange={(e) => {
                        const updated = {
                          ...project,
                          background: { ...project.background, color: e.target.value }
                        };
                        setProject(updated);
                      }}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {project.background.color}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Page Format & Standard:
                  </label>
                  <select
                    value={project.format}
                    onChange={(e) => {
                      const newFormat = e.target.value as PageFormat;
                      if (newFormat !== 'Custom') {
                        const dims = PAGE_SIZES[newFormat][project.orientation];
                        const updated = {
                          ...project,
                          format: newFormat,
                          width: dims.width,
                          height: dims.height
                        };
                        pushHistory(updated);
                        setTimeout(fitToScreen, 100);
                      } else {
                        const updated = {
                          ...project,
                          format: 'Custom' as PageFormat
                        };
                        pushHistory(updated);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="A4">A4 (297 × 210 mm) - International Standard</option>
                    <option value="Letter">US Letter (11 × 8.5 in) - North America</option>
                    <option value="Custom">Custom Dimensions (Custom px)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Page Orientation:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (project.orientation !== 'landscape') {
                          const w = Math.max(project.width, project.height);
                          const h = Math.min(project.width, project.height);
                          const updated = {
                            ...project,
                            orientation: 'landscape' as PageOrientation,
                            width: w,
                            height: h
                          };
                          pushHistory(updated);
                          setTimeout(fitToScreen, 100);
                        }
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        project.orientation === 'landscape'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Landscape
                    </button>
                    <button
                      onClick={() => {
                        if (project.orientation !== 'portrait') {
                          const w = Math.min(project.width, project.height);
                          const h = Math.max(project.width, project.height);
                          const updated = {
                            ...project,
                            orientation: 'portrait' as PageOrientation,
                            width: w,
                            height: h
                          };
                          pushHistory(updated);
                          setTimeout(fitToScreen, 100);
                        }
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        project.orientation === 'portrait'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Portrait
                    </button>
                  </div>
                </div>

                {project.format === 'Custom' && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Custom Dimensions (px):
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {project.width} × {project.height}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400">Width:</span>
                        <input
                          type="number"
                          min="300"
                          max="4000"
                          value={project.width}
                          onChange={(e) => {
                            const val = Math.max(200, Number(e.target.value));
                            const updated = { ...project, width: val };
                            setProject(updated);
                          }}
                          onBlur={() => {
                            pushHistory(project);
                            setTimeout(fitToScreen, 100);
                          }}
                          className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Height:</span>
                        <input
                          type="number"
                          min="300"
                          max="4000"
                          value={project.height}
                          onChange={(e) => {
                            const val = Math.max(200, Number(e.target.value));
                            const updated = { ...project, height: val };
                            setProject(updated);
                          }}
                          onBlur={() => {
                            pushHistory(project);
                            setTimeout(fitToScreen, 100);
                          }}
                          className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div className="pt-1 flex flex-wrap gap-1">
                      <button
                        onClick={() => {
                          const updated = { ...project, width: 1920, height: 1080, orientation: 'landscape' as PageOrientation };
                          pushHistory(updated);
                          setTimeout(fitToScreen, 100);
                        }}
                        className="px-2 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200"
                      >
                        1080p FHD
                      </button>
                      <button
                        onClick={() => {
                          const updated = { ...project, width: 1200, height: 800, orientation: 'landscape' as PageOrientation };
                          pushHistory(updated);
                          setTimeout(fitToScreen, 100);
                        }}
                        className="px-2 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200"
                      >
                        1200×800
                      </button>
                      <button
                        onClick={() => {
                          const updated = { ...project, width: 1000, height: 1000 };
                          pushHistory(updated);
                          setTimeout(fitToScreen, 100);
                        }}
                        className="px-2 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200"
                      >
                        1:1 Square
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: UPLOADS & SIGNATURE */}
          {activeLeftTab === 'uploads' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Logos & Signatures
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Files process locally and never leave your browser
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsSigModalOpen(true)}
                  className="w-full p-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 hover:border-blue-500 text-blue-700 dark:text-blue-300 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <PenTool className="w-4 h-4" />
                  Open Signature Pad Tool
                </button>

                <label className="w-full p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Upload Organization Logo
                  </span>
                  <span className="text-[10px] text-slate-400">PNG, SVG, or JPG</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: QR CODE */}
          {activeLeftTab === 'qr' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  QR Verification Code
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scannable URL or certificate serial code
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full p-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 hover:border-blue-500 text-blue-700 dark:text-blue-300 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  Create QR Verification Code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center Canvas Viewport */}
        <div
          ref={canvasContainerRef}
          className="flex-1 overflow-auto p-8 flex items-center justify-center relative bg-slate-200/70 dark:bg-slate-950/80"
          onClick={() => setSelectedElementId(null)}
        >
          <div className="relative">
            <CertificateCanvas
              domRef={canvasDomRef}
              width={project.width}
              height={project.height}
              background={project.background}
              border={project.border}
              elements={project.elements}
              selectedElementId={selectedElementId}
              onSelectElement={(id) => {
                setSelectedElementId(id);
                if (id) setShowInspector(true);
              }}
              onUpdateElement={updateElement}
              onDragEnd={handleDragEnd}
              scale={scale}
            />
          </div>
        </div>

        {/* Right Inspector Sidebar (Element Properties) */}
        <div className="w-72 sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto p-4 shrink-0 z-10 space-y-5 text-xs">
          {selectedElem ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  {selectedElem.type} Properties
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      updateElement(selectedElem.id, { locked: !selectedElem.locked })
                    }
                    className="p-1 text-slate-500 hover:text-slate-900 rounded"
                    title={selectedElem.locked ? 'Unlock' : 'Lock'}
                  >
                    {selectedElem.locked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={duplicateSelectedElement}
                    className="p-1 text-slate-500 hover:text-slate-900 rounded"
                    title="Duplicate (Ctrl+C, Ctrl+V)"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={deleteSelectedElement}
                    className="p-1 text-red-500 hover:text-red-700 rounded"
                    title="Delete (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text specific inspector */}
              {selectedElem.type === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Text Content:
                    </label>
                    <textarea
                      rows={3}
                      value={selectedElem.content || ''}
                      onChange={(e) => updateElement(selectedElem.id, { content: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Font Family:
                    </label>
                    <select
                      value={selectedElem.fontFamily || 'Plus Jakarta Sans'}
                      onChange={(e) =>
                        updateElement(selectedElem.id, { fontFamily: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option value="Cinzel">Cinzel (Diplomatic Serif)</option>
                      <option value="Playfair Display">Playfair Display (Classical Elegance)</option>
                      <option value="Cormorant Garamond">Cormorant Garamond (Academic Heritage)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                      <option value="Montserrat">Montserrat (Geometric Sans)</option>
                      <option value="Oswald">Oswald (Athletic Bold)</option>
                      <option value="Pinyon Script">Pinyon Script (Calligraphic Signature)</option>
                      <option value="Great Vibes">Great Vibes (Formal Cursive)</option>
                      <option value="Alex Brush">Alex Brush (Flowing Script)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Serial & ID Code)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Size:
                      </label>
                      <input
                        type="number"
                        min="8"
                        max="120"
                        value={selectedElem.fontSize || 16}
                        onChange={(e) =>
                          updateElement(selectedElem.id, { fontSize: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Weight:
                      </label>
                      <select
                        value={selectedElem.fontWeight || 'normal'}
                        onChange={(e) =>
                          updateElement(selectedElem.id, { fontWeight: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <option value="400">Regular (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">SemiBold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">ExtraBold (800)</option>
                      </select>
                    </div>
                  </div>

                  {/* Alignment & Style */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <button
                        onClick={() => updateElement(selectedElem.id, { textAlign: 'left' })}
                        className={`p-1.5 rounded ${
                          selectedElem.textAlign === 'left' ? 'bg-white dark:bg-slate-700 shadow-2xs' : ''
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateElement(selectedElem.id, { textAlign: 'center' })}
                        className={`p-1.5 rounded ${
                          selectedElem.textAlign === 'center' || !selectedElem.textAlign
                            ? 'bg-white dark:bg-slate-700 shadow-2xs'
                            : ''
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateElement(selectedElem.id, { textAlign: 'right' })}
                        className={`p-1.5 rounded ${
                          selectedElem.textAlign === 'right' ? 'bg-white dark:bg-slate-700 shadow-2xs' : ''
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-medium text-slate-700 dark:text-slate-300">Color:</label>
                      <input
                        type="color"
                        value={selectedElem.color || '#000000'}
                        onChange={(e) => updateElement(selectedElem.id, { color: e.target.value })}
                        className="w-7 h-7 rounded border cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Tag as Placeholder */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Dynamic Placeholder Mapping:
                    </label>
                    <select
                      value={selectedElem.placeholderKey || ''}
                      onChange={(e) =>
                        updateElement(selectedElem.id, { placeholderKey: e.target.value || undefined })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
                    >
                      <option value="">None (Static text)</option>
                      {STANDARD_PLACEHOLDERS.map(ph => (
                        <option key={ph.key} value={ph.key}>
                          [{ph.key}] - {ph.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Badge/Shape specific inspector */}
              {(selectedElem.type === 'badge' || selectedElem.type === 'shape' || selectedElem.type === 'line') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-slate-700 dark:text-slate-300">Fill Color:</label>
                    <input
                      type="color"
                      value={selectedElem.fill || '#C5A059'}
                      onChange={(e) => updateElement(selectedElem.id, { fill: e.target.value })}
                      className="w-7 h-7 rounded border cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="font-medium text-slate-700 dark:text-slate-300">Border / Stroke:</label>
                    <input
                      type="color"
                      value={selectedElem.stroke || '#8C6D2D'}
                      onChange={(e) => updateElement(selectedElem.id, { stroke: e.target.value })}
                      className="w-7 h-7 rounded border cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Position & Geometry */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Geometry & Alignment
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400">X Position:</span>
                    <input
                      type="number"
                      value={selectedElem.x}
                      onChange={(e) => updateElement(selectedElem.id, { x: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Y Position:</span>
                    <input
                      type="number"
                      value={selectedElem.y}
                      onChange={(e) => updateElement(selectedElem.id, { y: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Width:</span>
                    <input
                      type="number"
                      value={selectedElem.width}
                      onChange={(e) =>
                        updateElement(selectedElem.id, { width: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Height:</span>
                    <input
                      type="number"
                      value={selectedElem.height}
                      onChange={(e) =>
                        updateElement(selectedElem.id, { height: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Canvas Center Alignment Buttons */}
                <div className="pt-2 flex items-center justify-between gap-1">
                  <button
                    onClick={() => {
                      const newX = Math.round((project.width - selectedElem.width) / 2);
                      updateElement(selectedElem.id, { x: newX });
                      pushHistory({
                        ...project,
                        elements: project.elements.map(el =>
                          el.id === selectedElem.id ? { ...el, x: newX } : el
                        )
                      });
                    }}
                    className="flex-1 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    title="Center element horizontally on canvas"
                  >
                    Center Horizontally
                  </button>
                  <button
                    onClick={() => {
                      const newY = Math.round((project.height - selectedElem.height) / 2);
                      updateElement(selectedElem.id, { y: newY });
                      pushHistory({
                        ...project,
                        elements: project.elements.map(el =>
                          el.id === selectedElem.id ? { ...el, y: newY } : el
                        )
                      });
                    }}
                    className="flex-1 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    title="Center element vertically on canvas"
                  >
                    Center Vertically
                  </button>
                </div>

                {/* Layer arrange buttons */}
                <div className="pt-2 flex items-center justify-between gap-1">
                  <button
                    onClick={() => changeLayerOrder('front')}
                    className="flex-1 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px]"
                    title="Bring to Front"
                  >
                    To Front
                  </button>
                  <button
                    onClick={() => changeLayerOrder('back')}
                    className="flex-1 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px]"
                    title="Send to Back"
                  >
                    To Back
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center py-6">
              <Frame className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  Canvas Selected
                </h4>
                <p className="text-slate-500 text-xs mt-1">
                  Click any text, badge, or image on the certificate to edit its properties, or use the left panel to insert new elements.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Certificate Canvas Info:
                </span>
                <div className="text-slate-500 space-y-1 font-mono text-[11px]">
                  <div>Size: {project.width} × {project.height} px</div>
                  <div>Orientation: {project.orientation}</div>
                  <div>Format: {project.format} (Print standard)</div>
                  <div>Elements count: {project.elements.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Modals */}
      <SignaturePadModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onInsertSignature={handleInsertImage}
      />

      <QrGeneratorModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onInsertQr={addQrCode}
      />

      <PaletteFontPickerModal
        isOpen={isPaletteModalOpen}
        onClose={() => setIsPaletteModalOpen(false)}
        onApplyTheme={(theme) => {
          const updated: CertificateProject = {
            ...project,
            border: {
              ...project.border,
              color: theme.borderColor,
              secondaryColor: theme.secondaryColor
            },
            background: {
              ...project.background,
              color: theme.backgroundColor
            },
            elements: project.elements.map(el => {
              if (el.type === 'text') {
                const isHeading = (el.fontSize || 16) >= 28;
                return {
                  ...el,
                  fontFamily: isHeading ? theme.fontDisplay : theme.fontBody,
                  color: isHeading ? theme.accentColor : theme.textColor
                };
              }
              if (el.type === 'badge') {
                return {
                  ...el,
                  fill: theme.borderColor,
                  stroke: theme.secondaryColor
                };
              }
              return el;
            })
          };
          pushHistory(updated);
        }}
      />

      <SizeCalculatorModal
        isOpen={isSizeCalcOpen}
        onClose={() => setIsSizeCalcOpen(false)}
        onApplySize={(w, h, format, orientation) => {
          const updated: CertificateProject = {
            ...project,
            width: w,
            height: h,
            format,
            orientation
          };
          pushHistory(updated);
          setTimeout(fitToScreen, 100);
        }}
      />
    </div>
  );
};
