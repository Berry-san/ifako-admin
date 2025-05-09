// hooks/useApiHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/ApiService'

type Payload = object

// Generic fetch for list data
function useFetchData(endpoint: string, invalidateKey?: string) {
  return useQuery({
    queryKey: [invalidateKey || endpoint],
    queryFn: () => apiService.get(endpoint),
    initialData: [],
  })
}

// Generic fetch for item by ID
function useFetchById(endpoint: string, id: string) {
  return useQuery({
    queryKey: [endpoint, id],
    queryFn: () => apiService.getById(endpoint, id),
    enabled: !!id,
  })
}

// Generic POST mutation
function usePostData(endpoint: string, invalidateKey?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: Payload) => apiService.post(endpoint, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [invalidateKey || endpoint],
      })
    },
  })
}

// Generic PUT/PATCH mutation
function useUpdateData(endpoint: string, invalidateKey?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    // Accept an object containing both ID and body
    mutationFn: ({ id, body }: { id: string; body: Payload | FormData }) =>
      apiService.update(endpoint, id, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [invalidateKey || endpoint],
      })
    },
  })
}

// Generic DELETE mutation
function useDeleteData(endpoint: string, invalidateKey?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [invalidateKey || endpoint],
      })
    },
  })
}

export { useFetchData, useFetchById, usePostData, useUpdateData, useDeleteData }
