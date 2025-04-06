import React, { ReactNode, MouseEvent } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null

  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.id === 'backdrop') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center m-0 bg-black/50 backdrop-blur-sm"
      id="backdrop"
      onClick={handleClose}
    >
      <div className="relative flex flex-col w-96 p-4 mx-3 space-y-4 bg-white rounded">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="p-4 text-black scroll-black">{children}</div>
      </div>
    </div>
  )
}

export default Modal
