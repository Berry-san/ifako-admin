// hooks/useNewsAndMembers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/ApiService'

// Get all news or members
export const useGetAllItems = (type: 'news' | 'member') => {
  return useQuery({
    queryKey: ['main', type],
    queryFn: async () => await apiService.get(`/main/all/${type}`),
  })
}

// Create news or member (FormData)
export const useCreateItem = (type: 'news' | 'member') => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: any) =>
      await apiService.post('/main/create', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main', type] })
    },
  })
}

// Delete news or member
export const useDeleteItem = (type: 'news' | 'member') => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) =>
      await apiService.post(`/main/delete/${type}/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['main', type] })
    },
  })
}
