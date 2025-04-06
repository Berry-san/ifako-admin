// components/shared/SectionHeader.tsx
import React from 'react'
import { PlusCircle } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  onAction?: () => void
  actionLabel?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onAction,
  actionLabel = 'Add',
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">{title}</h2>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded cursor-pointer"
        >
          <PlusCircle size={18} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}

export default SectionHeader
