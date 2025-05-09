'use client'

import { toast } from 'react-toastify'
import { useUpdateData } from '../../hooks/useApiHooks'

const ApproveButton = ({ id }: { id: string }) => {
  const { mutate: approveNews, isPending } = useUpdateData(
    '/main/approve/news',
    '/main/all/news?status=pending'
  )

  const handleApprove = () => {
    approveNews(
      { id, body: { status: 'approved' } },
      {
        onSuccess: () => {
          toast.success('News approved successfully')
        },
        onError: () => {
          toast.error('Failed to approve news')
        },
      }
    )
  }

  return (
    <button
      onClick={handleApprove}
      disabled={isPending}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      {isPending ? 'Approving...' : 'Approve'}
    </button>
  )
}

export default ApproveButton
