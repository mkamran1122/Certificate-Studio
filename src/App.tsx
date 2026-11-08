import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { TemplateGallery } from './components/templates/TemplateGallery';
import { CertificateEditor } from './components/editor/CertificateEditor';
import { BulkGenerator } from './components/bulk/BulkGenerator';
import { ProjectsView } from './components/projects/ProjectsView';
import { CategoryHubPage } from './components/seo/CategoryHubPage';
import { AboutUs } from './components/pages/AboutUs';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfUse } from './components/pages/TermsOfUse';
import { FaqPage } from './components/pages/FaqPage';
import { ContactUs } from './components/pages/ContactUs';
import { SizeCalculatorModal } from './components/tools/SizeCalculatorModal';
import { QrGeneratorModal } from './components/tools/QrGeneratorModal';
import { SignaturePadModal } from './components/tools/SignaturePadModal';
import { IdGeneratorModal } from './components/tools/IdGeneratorModal';
import { CertificateProject, CertificateTemplate } from './types/certificate';
import { CERTIFICATE_TEMPLATES } from './data/templates';
import { storage } from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeCategoryHub, setActiveCategoryHub] = useState<string>('free-certificate-maker');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active working project
  const [activeProject, setActiveProject] = useState<CertificateProject>(() => {
    const savedDraft = storage.getActiveDraft();
    if (savedDraft) return savedDraft;

    const defaultTmpl = CERTIFICATE_TEMPLATES[0];
    return {
      id: 'proj_' + Date.now(),
      name: defaultTmpl.name,
      templateId: defaultTmpl.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      width: defaultTmpl.width,
      height: defaultTmpl.height,
      orientation: defaultTmpl.orientation,
      format: defaultTmpl.format,
      background: { ...defaultTmpl.background },
      border: { ...defaultTmpl.border },
      elements: defaultTmpl.elements.map(el => ({ ...el }))
    };
  });

  // Global modals triggered from Navbar, Footer, or Tools
  const [isSizeCalcOpen, setIsSizeCalcOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [isIdGenOpen, setIsIdGenOpen] = useState(false);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleDark = () => {
    setIsDark(prev => !prev);
  };

  const handleSelectTemplateForEditor = (template: CertificateTemplate) => {
    const newProject: CertificateProject = {
      id: 'proj_' + Date.now(),
      name: template.name,
      templateId: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      width: template.width,
      height: template.height,
      orientation: template.orientation,
      format: template.format,
      background: { ...template.background },
      border: { ...template.border },
      elements: template.elements.map(el => ({
        ...el,
        id: 'el_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
      }))
    };
    setActiveProject(newProject);
    storage.saveActiveDraft(newProject);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplateForBulk = (template: CertificateTemplate) => {
    const newProject: CertificateProject = {
      id: 'proj_' + Date.now(),
      name: template.name,
      templateId: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      width: template.width,
      height: template.height,
      orientation: template.orientation,
      format: template.format,
      background: { ...template.background },
      border: { ...template.border },
      elements: template.elements.map(el => ({
        ...el,
        id: 'el_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
      }))
    };
    setActiveProject(newProject);
    storage.saveActiveDraft(newProject);
    setCurrentView('bulk');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHub = (slug: string) => {
    setActiveCategoryHub(slug);
    setCurrentView('category-hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTool = (toolName: string) => {
    if (toolName === 'size-calculator') setIsSizeCalcOpen(true);
    else if (toolName === 'signature-pad') setIsSigModalOpen(true);
    else if (toolName === 'qr-generator') setIsQrModalOpen(true);
    else if (toolName === 'id-generator') setIsIdGenOpen(true);
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Primary Top Bar */}
      <Navbar
        activeView={currentView}
        onNavigate={navigateTo}
        isDark={isDark}
        onToggleDark={handleToggleDark}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomePage
            onOpenEditor={(template) => {
              if (template) handleSelectTemplateForEditor(template);
              else navigateTo('editor');
            }}
            onNavigateToTemplates={() => navigateTo('templates')}
            onNavigateToBulk={() => navigateTo('bulk')}
            onNavigateToHub={handleOpenHub}
            onOpenTool={handleOpenTool}
          />
        )}

        {currentView === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplateForEditor}
            onSelectForBulk={handleSelectTemplateForBulk}
          />
        )}

        {currentView === 'editor' && (
          <CertificateEditor
            initialProject={activeProject}
            onNavigateToBulk={(proj) => {
              setActiveProject(proj);
              navigateTo('bulk');
            }}
            onNavigateToProjects={() => navigateTo('projects')}
          />
        )}

        {currentView === 'bulk' && (
          <BulkGenerator
            currentProject={activeProject}
            onOpenInEditor={(proj) => {
              setActiveProject(proj);
              navigateTo('editor');
            }}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsView
            onOpenProject={(proj) => {
              setActiveProject(proj);
              navigateTo('editor');
            }}
            onCreateNew={() => {
              const defaultTmpl = CERTIFICATE_TEMPLATES[0];
              const freshProject: CertificateProject = {
                id: 'proj_' + Date.now(),
                name: 'Untitled Certificate',
                templateId: defaultTmpl.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                width: defaultTmpl.width,
                height: defaultTmpl.height,
                orientation: defaultTmpl.orientation,
                format: defaultTmpl.format,
                background: { ...defaultTmpl.background },
                border: { ...defaultTmpl.border },
                elements: defaultTmpl.elements.map(el => ({
                  ...el,
                  id: 'el_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
                }))
              };
              setActiveProject(freshProject);
              navigateTo('editor');
            }}
          />
        )}

        {currentView === 'category-hub' && (
          <CategoryHubPage
            hubKey={activeCategoryHub}
            onSelectTemplate={handleSelectTemplateForEditor}
            onOpenEditor={() => navigateTo('editor')}
          />
        )}

        {currentView === 'about' && <AboutUs />}
        {currentView === 'privacy' && <PrivacyPolicy />}
        {currentView === 'terms' && <TermsOfUse />}
        {currentView === 'faq' && <FaqPage />}
        {currentView === 'contact' && <ContactUs />}
      </main>

      {/* Global Modals */}
      <SizeCalculatorModal
        isOpen={isSizeCalcOpen}
        onClose={() => setIsSizeCalcOpen(false)}
        onApplySize={(w, h, format, orientation) => {
          setActiveProject(prev => ({
            ...prev,
            width: w,
            height: h,
            format,
            orientation
          }));
          navigateTo('editor');
        }}
      />

      <QrGeneratorModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onInsertQr={(qrVal, darkCol) => {
          const newQr = {
            id: 'el_' + Date.now(),
            type: 'qr' as const,
            x: activeProject.width - 150,
            y: activeProject.height - 150,
            width: 80,
            height: 80,
            qrValue: qrVal,
            qrColor: darkCol
          };
          setActiveProject(prev => ({
            ...prev,
            elements: [...prev.elements, newQr]
          }));
          navigateTo('editor');
        }}
      />

      <SignaturePadModal
        isOpen={isSigModalOpen}
        onClose={() => setIsSigModalOpen(false)}
        onInsertSignature={(dataUrl) => {
          const newImg = {
            id: 'el_' + Date.now(),
            type: 'image' as const,
            x: activeProject.width / 2 - 100,
            y: activeProject.height / 2,
            width: 200,
            height: 80,
            src: dataUrl
          };
          setActiveProject(prev => ({
            ...prev,
            elements: [...prev.elements, newImg]
          }));
          navigateTo('editor');
        }}
      />

      <IdGeneratorModal
        isOpen={isIdGenOpen}
        onClose={() => setIsIdGenOpen(false)}
        onApplyId={(id) => {
          // Replace or add ID element
          const hasId = activeProject.elements.some(el => el.placeholderKey === 'CERTIFICATE_ID');
          if (hasId) {
            setActiveProject(prev => ({
              ...prev,
              elements: prev.elements.map(el =>
                el.placeholderKey === 'CERTIFICATE_ID'
                  ? { ...el, content: `CERTIFICATE ID: ${id}` }
                  : el
              )
            }));
          } else {
            const newIdEl = {
              id: 'el_' + Date.now(),
              type: 'text' as const,
              x: activeProject.width / 2 - 200,
              y: activeProject.height - 70,
              width: 400,
              height: 20,
              content: `CERTIFICATE ID: ${id}`,
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              color: '#94A3B8',
              textAlign: 'center' as const,
              placeholderKey: 'CERTIFICATE_ID'
            };
            setActiveProject(prev => ({
              ...prev,
              elements: [...prev.elements, newIdEl]
            }));
          }
          navigateTo('editor');
        }}
      />

      {/* Footer is visible on non-editor views */}
      {currentView !== 'editor' && (
        <Footer
          onNavigate={navigateTo}
          onNavigateToHub={handleOpenHub}
          onOpenTool={handleOpenTool}
        />
      )}
    </div>
  );
}
