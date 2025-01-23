"use client";

import { RiSearchLine, RiFilter3Line } from 'react-icons/ri';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'published' | 'draft';
  onStatusFilterChange: (status: 'all' | 'published' | 'draft') => void;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-grow relative">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une formation..."
          className="w-full pl-10 pr-4 py-2 bg-dark/50 backdrop-blur rounded-lg border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <RiFilter3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'published' | 'draft')}
            className="pl-10 pr-4 py-2 bg-dark/50 backdrop-blur rounded-lg border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </div>
    </div>
  );
} 