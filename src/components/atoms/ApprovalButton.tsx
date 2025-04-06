// const { mutate: update, isPending } = useUpdateData(
//   '/main/edit/news',
//   id || '',
//   '/main/all/news'
// )

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/ApiService'
import { toast } from 'react-toastify'

const ApproveButton = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      apiService.update(`/main/approve/news`, id, { status: 'approved' }),
    onSuccess: () => {
      toast.success('News approved successfully')
      queryClient.invalidateQueries({
        queryKey: ['/main/all/news?status=pending'],
      })
    },
    onError: () => toast.error('Failed to approve news'),
  })

  return (
    <button
      onClick={() => mutate()}
      disabled={isLoading}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      {isLoading ? 'Approving...' : 'Approve'}
    </button>
  )
}

export default ApproveButton
