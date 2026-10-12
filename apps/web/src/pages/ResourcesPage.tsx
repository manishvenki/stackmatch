import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Filter,
  Sparkles,
  Layers,
  ShieldCheck,
  Compass,
  ArrowRight,
  RotateCcw,
  Tag,
  Clock,
  GraduationCap,
} from 'lucide-react';
import {
  CURATED_RESOURCES,
  RESOURCE_CATEGORIES,
  CuratedResource,
  ResourceCategory,
  ResourceType,
} from '../data/curatedResources';
import { Button } from '../components/ui/Button';

export interface ResourcesPageProps {
  onStartPlanning?: () => void;
  onNavigateHome?: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  onStartPlanning,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filtered list
  const filteredResources = useMemo(() => {
    return CURATED_RESOURCES.filter((res) => {
      // Category filter
      if (selectedCategory !== 'All' && res.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (selectedType === 'Official' && !res.isOfficialDoc) {
        return false;
      }
      if (selectedType === 'Guides' && res.isOfficialDoc) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && res.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = res.title.toLowerCase().includes(query);
        const matchesDesc = res.description.toLowerCase().includes(query);
        const matchesTech = res.technology.toLowerCase().includes(query);
        const matchesCategory = res.category.toLowerCase().includes(query);
        const matchesOutcomes = res.learningOutcomes.some((outcome) =>
          outcome.toLowerCase().includes(query)
        );
        return matchesTitle || matchesDesc || matchesTech || matchesCategory || matchesOutcomes;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedType, selectedDifficulty]);

  // Featured resources
  const featuredResources = useMemo(() => {
    return CURATED_RESOURCES.filter((res) => res.featured);
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedDifficulty('All');
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: CURATED_RESOURCES.length };
    RESOURCE_CATEGORIES.forEach((cat) => {
      counts[cat] = CURATED_RESOURCES.filter((r) => r.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col">
      {/* Top Hero Banner */}
      <div className="bg-white border-b border-[#E5E7EB] pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Knowledge Base & Architecture Guides</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                Developer Resources & Architecture Hub
              </h1>
              <p className="text-base text-[#4B5563] leading-relaxed">
                Curated documentation, system design playbooks, and best practices to help you turn ideas into requirements, evaluate technology trade-offs, and build scalable systems.
              </p>
            </div>

            {onStartPlanning && (
              <div className="shrink-0 flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onStartPlanning}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-xs whitespace-nowrap"
                >
                  Start Project Plan
                </Button>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, technology (e.g. React, PostgreSQL, Docker, MVP, Security)..."
                className="w-full pl-12 pr-10 py-3.5 bg-[#F9FAFB] rounded-xl border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#687280] hover:text-[#111827] px-2 py-1 rounded-md hover:bg-[#E5E7EB]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-8">
        {/* Filter Controls Bar */}
        <div className="space-y-4">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F3F4F6] hover:text-[#111827]'
              }`}
            >
              All Topics ({categoryCounts['All']})
            </button>
            {RESOURCE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F3F4F6] hover:text-[#111827]'
                }`}
              >
                {cat} ({categoryCounts[cat] || 0})
              </button>
            ))}
          </div>

          {/* Secondary Sub-filters (Type & Difficulty) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-lg p-1">
                <span className="text-[#687280] font-medium px-2">Source:</span>
                <button
                  onClick={() => setSelectedType('All')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    selectedType === 'All'
                      ? 'bg-[#111827] text-white'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  All Sources
                </button>
                <button
                  onClick={() => setSelectedType('Official')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    selectedType === 'Official'
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  Official Docs
                </button>
                <button
                  onClick={() => setSelectedType('Guides')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    selectedType === 'Guides'
                      ? 'bg-[#111827] text-white'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  StackMatch Guides
                </button>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-lg p-1">
                <span className="text-[#687280] font-medium px-2">Level:</span>
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(lvl)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      selectedDifficulty === lvl
                        ? 'bg-[#111827] text-white'
                        : 'text-[#4B5563] hover:text-[#111827]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Match Counter & Reset */}
            <div className="flex items-center gap-3">
              <span className="text-[#687280] font-medium">
                Showing <strong className="text-[#111827]">{filteredResources.length}</strong> of{' '}
                {CURATED_RESOURCES.length} resources
              </span>
              {(searchQuery || selectedCategory !== 'All' || selectedType !== 'All' || selectedDifficulty !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[#2563EB] hover:underline font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Featured Guides Banner (When viewing all and not searching) */}
        {selectedCategory === 'All' && !searchQuery && selectedType === 'All' && selectedDifficulty === 'All' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#374151]">
                Featured Architecture & Planning Essentials
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredResources.slice(0, 4).map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <span className="text-[#687280] font-medium">{res.readTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-[#687280]">
                      {res.technology}
                    </span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#111827] hover:text-[#2563EB] cursor-pointer"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resource Cards Grid */}
        {filteredResources.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#374151]">
              {selectedCategory === 'All' ? 'All Curated Resources' : selectedCategory}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <article
                  key={res.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col justify-between hover:border-[#D1D5DB] hover:shadow-md transition-all group"
                >
                  <div className="space-y-3.5">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {res.isOfficialDoc ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                            <CheckCircle2 className="w-3 h-3 text-[#2563EB]" />
                            Official Documentation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#111827] border border-[#E5E7EB]">
                            <BookOpen className="w-3 h-3 text-[#111827]" />
                            StackMatch Guide
                          </span>
                        )}
                      </div>

                      {/* Difficulty Level */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          res.difficulty === 'Beginner'
                            ? 'bg-[#DCFCE7] text-[#16A34A]'
                            : res.difficulty === 'Intermediate'
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {res.difficulty}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-snug mb-1.5">
                        {res.title}
                      </h3>
                      <p className="text-xs text-[#4B5563] leading-relaxed">
                        {res.description}
                      </p>
                    </div>

                    {/* Learning Outcomes Box */}
                    {res.learningOutcomes && res.learningOutcomes.length > 0 && (
                      <div className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB] space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#374151]">
                          <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>What you'll learn:</span>
                        </div>
                        <ul className="space-y-1">
                          {res.learningOutcomes.map((outcome, idx) => (
                            <li
                              key={idx}
                              className="text-[11px] text-[#4B5563] flex items-start gap-1.5 leading-snug"
                            >
                              <span className="text-[#16A34A] font-bold shrink-0 leading-none">✓</span>
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-4 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#687280]">
                      <span className="font-semibold text-[#111827] bg-[#F3F4F6] px-2 py-0.5 rounded text-[11px]">
                        {res.technology}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {res.readTime}
                      </span>
                    </div>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#111827] group-hover:text-[#2563EB] hover:underline cursor-pointer"
                    >
                      <span>{res.isOfficialDoc ? 'View Docs' : 'Read Guide'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          /* Empty Search & Filter State */
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#687280]">
              <Search className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#111827]">
                No matching resources found
              </h3>
              <p className="text-xs text-[#687280] leading-relaxed max-w-sm mx-auto">
                We couldn't find any resources matching your current search query or filter selection.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="font-semibold"
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
