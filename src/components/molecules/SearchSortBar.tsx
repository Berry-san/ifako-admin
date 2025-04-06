// components/shared/SearchSortBar.tsx
import React from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface SearchSortBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortAsc: boolean
  onToggleSort: () => void
  sortLabel?: string
}

const SearchSortBar: React.FC<SearchSortBarProps> = ({
  searchTerm,
  onSearchChange,
  sortAsc,
  onToggleSort,
  sortLabel = 'Sort',
}) => {
  return (
    <div className="flex justify-between gap-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-4 border border-gray-300 rounded w-1/3"
      />
      <button
        onClick={onToggleSort}
        className="flex items-center px-3 py-2 bg-black rounded text-white cursor-pointer"
      >
        {sortAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="ml-2">{sortLabel}</span>
      </button>
    </div>
  )
}

export default SearchSortBar
