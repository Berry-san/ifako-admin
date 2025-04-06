// components/shared/DeleteConfirmModal.tsx

interface DeleteConfirmModalProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  itemName?: string
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  itemName = 'this item',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center space-y-4">
        <h4 className="text-lg font-semibold text-red-600">Confirm Deletion</h4>
        <p className="text-gray-600">
          Are you sure you want to delete {itemName}?
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
