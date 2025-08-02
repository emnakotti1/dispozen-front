// frontend/src/queries/users.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { getUsers, createUser} from '../api/users.api'
import type { User } from '../api/users.api' // ✅ Corrige l’erreur


export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}
export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
 