import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Layers,
  Heart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  SlidersHorizontal,
  Flame,
  Clock,
  ArrowUpDown,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { CertificateTemplate } from '../../types/certificate';
import { CERTIFICATE_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/templates';
import { CertificateThumbnail } from './CertificateThumbnail';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { AdBanner } from '../common/AdBanner';
import { siteConfig } from '../../config/siteConfig';

interface TemplateGalleryProps {
  onSelectTemplate: (template: CertificateTemplate) => void;
  onSelectForBulk: (template: CertificateTemplate) => void;
}

const MONTHS = [
  { num: 0, label: 'All Year Collections' },
  { num: 1, label: 'Jan • New Year Kickoff' },
  { num: 2, label: 'Feb • Career & Mentorship' },
  { num: 3, label: 'Mar • Academic Honors' },
  { num: 4, label: 'Apr • Community & Earth' },
  { num: 5, label: 'May • Graduation Season' },
  { num: 6, label: 'Jun • Internships & Youth' },
  { num: 7, label: 'Jul • Athletics & Camps' },
  { num: 8, label: 'Aug • Tech Bootcamps' },
  { num: 9, label: 'Sep • Back to School' },
  { num: 10, label: 'Oct • Safety & Cyber' },
  { num: 11, label: 'Nov • Leadership & Gratitude' },
  { num: 12, label: 'Dec • Year-End Galas' }
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onSelectForBulk
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [quickTab, setQuickTab] = useState<'all' | 'featured' | 'popular' | 'newest' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'az' | 'category'>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(36);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('certstudio_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal preview state
  const [previewTemplate, setPreviewTemplate] = useState<CertificateTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('certstudio_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites to localStorage', e);
      }
      return updated;
    });
  };

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: CERTIFICATE_TEMPLATES.length };
    CERTIFICATE_TEMPLATES.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and Sort Pipeline
  const filteredTemplates = useMemo(() => {
    let result = CERTIFICATE_TEMPLATES.filter(tmpl => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tmpl.name.toLowerCase().includes(q);
        const matchesCategory = tmpl.category.toLowerCase().includes(q);
        const matchesSubcat = tmpl.subcategory ? tmpl.subcategory.toLowerCase().includes(q) : false;
        const matchesDesc = tmpl.description.toLowerCase().includes(q);
        const matchesTags = tmpl.tags.some(tag => tag.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesSubcat && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All' && tmpl.category !== selectedCategory) {
        return false;
      }

      // 3. Orientation
      if (selectedOrientation !== 'all' && tmpl.orientation !== selectedOrientation) {
        return false;
      }

      // 4. Style
      if (selectedStyle !== 'all' && tmpl.style !== selectedStyle) {
        return false;
      }

      // 5. Month Collection
      if (selectedMonth > 0 && tmpl.monthCollection !== selectedMonth) {
        return false;
      }

      // 6. Quick Tab
      if (quickTab === 'featured' && !tmpl.featured) {
        return false;
      }
      if (quickTab === 'popular' && (tmpl.popularity || 0) < 600) {
        return false;
      }
      if (quickTab === 'favorites' && !favorites.includes(tmpl.id)) {
        return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      if (sortBy === 'az') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === 'newest') {
        return (b.monthCollection || 0) - (a.monthCollection || 0);
      }
      return 0;
    });

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedOrientation,
    selectedStyle,
    selectedMonth,
    quickTab,
    sortBy,
    favorites
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedOrientation, selectedStyle, selectedMonth, quickTab, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredTemplates.length / pageSize) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTemplates.slice(start, start + pageSize);
  }, [filteredTemplates, currentPage, pageSize]);

  const handleOpenPreview = (tmpl: CertificateTemplate) => {
    setPreviewTemplate(tmpl);
    setIsPreviewOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedOrientation('all');
    setSelectedStyle('all');
    setSelectedMonth(0);
    setQuickTab('all');
    setSortBy('popular');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              1,000+ Free Certificate Designs
            </span>
            <span className="text-xs text-slate-400">Updated for 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Comprehensive Certificate Template Library
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Browse over 1,000 professionally crafted certificate templates across 20 distinct categories and 12 seasonal collections. 100% free, customizable in your browser, and ready for single or bulk CSV export.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium shrink-0">
          Showing <strong className="text-slate-900 dark:text-slate-100">{filteredTemplates.length}</strong> of{' '}
          {CERTIFICATE_TEMPLATES.length} templates
        </div>
      </div>

      {/* Main Filter & Control Panel */}
      <div className="space-y-4">
        {/* Row 1: Search, Orientation, Style & Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box (6 cols) */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, topic, degree, award, skill..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          {/* Orientation (3 cols) */}
          <div className="sm:col-span-3 flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-medium">
            {['all', 'landscape', 'portrait'].map(or => (
              <button
                key={or}
                onClick={() => setSelectedOrientation(or)}
                className={`flex-1 py-1.5 rounded-lg capitalize transition-colors ${
                  selectedOrientation === or
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {or}
              </button>
            ))}
          </div>

          {/* Style Filter (2 cols) */}
          <div className="sm:col-span-2">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs capitalize"
            >
              <option value="all">All Styles</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="luxury">Luxury Gold</option>
              <option value="corporate">Corporate</option>
              <option value="minimal">Minimal</option>
              <option value="vintage">Vintage</option>
              <option value="elegant">Elegant</option>
            </select>
          </div>

          {/* Sort By (2 cols) */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Seasonal / Newest</option>
              <option value="az">Alphabetical (A-Z)</option>
              <option value="category">By Category</option>
            </select>
          </div>
        </div>

        {/* Row 2: Quick Filter Tabs (All, Featured, Popular, Favorites) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setQuickTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                quickTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Designs ({CERTIFICATE_TEMPLATES.length})
            </button>
            <button
              onClick={() => setQuickTab('featured')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                quickTab === 'featured'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Featured
            </button>
            <button
              onClick={() => setQuickTab('popular')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                quickTab === 'popular'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Top Rated
            </button>
            <button
              onClick={() => setQuickTab('favorites')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                quickTab === 'favorites'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              Favorites ({favorites.length})
            </button>
          </div>

          {/* Monthly Collections selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden lg:inline">Seasonal Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500"
            >
              {MONTHS.map(m => (
                <option key={m.num} value={m.num}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Horizontal 20-Category Carousel with Count Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {TEMPLATE_CATEGORIES.map(cat => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 font-medium rounded-xl whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-semibold ring-2 ring-blue-600/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Certificate Templates */}
      {paginatedTemplates.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedTemplates.map(tmpl => {
              const isFav = favorites.includes(tmpl.id);
              const isLandscape = tmpl.orientation === 'landscape';

              return (
                <div
                  key={tmpl.id}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Thumbnail Container */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800/80 relative">
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tmpl.id);
                      }}
                      className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs shadow-xs text-slate-400 hover:text-rose-500 transition-colors"
                      title={isFav ? 'Remove favorite' : 'Add favorite'}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                    </button>

                    {/* Orientation Badge */}
                    <span className="absolute top-4 left-4 z-10 px-2 py-0.5 text-[10px] font-mono uppercase font-semibold rounded-md bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 shadow-2xs">
                      {tmpl.orientation}
                    </span>

                    {/* Clickable Vector Thumbnail */}
                    <div
                      className="cursor-pointer overflow-hidden rounded-lg hover:scale-101 transition-transform duration-200 flex items-center justify-center min-h-[170px]"
                      onClick={() => handleOpenPreview(tmpl)}
                    >
                      <CertificateThumbnail template={tmpl} />
                    </div>
                  </div>

                  {/* Card Info Footer */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[180px]">
                          {tmpl.category}
                        </span>
                        {tmpl.monthName && (
                          <span className="text-slate-400">{tmpl.monthName}</span>
                        )}
                      </div>

                      <h3
                        className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-blue-600 cursor-pointer"
                        onClick={() => handleOpenPreview(tmpl)}
                        title={tmpl.name}
                      >
                        {tmpl.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPreview(tmpl)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
                        title="Quick View Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectTemplate(tmpl)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">
              Showing{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredTemplates.length)}
              </strong>{' '}
              of <strong className="text-slate-800 dark:text-slate-200">{filteredTemplates.length}</strong> certificates
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1 text-xs font-medium">
                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pageNum = idx + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + idx;
                    if (pageNum > totalPages) pageNum = totalPages - 4 + idx;
                  }
                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white font-bold shadow-2xs'
                          : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching certificate templates found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              We couldn’t find any templates matching "{searchQuery || selectedCategory}". Try selecting another category or clearing your search filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}

      {/* Interactive Modal Preview */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onCustomize={onSelectTemplate}
        onUseForBulk={onSelectForBulk}
        isFavorite={previewTemplate ? favorites.includes(previewTemplate.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* AdSense Placement */}
      <AdBanner slot={siteConfig.adsense.slots.homeHeroBottom} format="responsive" />
    </div>
  );
};
