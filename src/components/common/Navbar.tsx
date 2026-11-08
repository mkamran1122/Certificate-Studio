import React, { useState } from 'react';
import { Award, Sun, Moon, Sparkles, Menu, X } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  isDark,
  onToggleDark
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 no-print">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            {siteConfig.name}
          </span>
        </div>

        {/* Zone 2: Concise single-line navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'home' ? 'text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('templates')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'templates' ? 'text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => handleNavClick('editor')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'editor' ? 'text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => handleNavClick('bulk')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'bulk' ? 'text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            Bulk Generator
          </button>
          <button
            onClick={() => handleNavClick('projects')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'projects' ? 'text-blue-600 dark:text-blue-400' : ''
            }`}
          >
            My Projects
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Theme toggle + Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleNavClick('editor')}
            className="hidden sm:flex px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Certificate</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 bg-white dark:bg-slate-900 animate-in slide-in-from-top-2 duration-150">
          {[
            { id: 'home', label: 'Home' },
            { id: 'templates', label: 'Templates' },
            { id: 'editor', label: 'Editor' },
            { id: 'bulk', label: 'Bulk Generator' },
            { id: 'projects', label: 'My Projects' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeView === item.id
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 sm:hidden">
            <button
              onClick={() => handleNavClick('editor')}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Certificate</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
