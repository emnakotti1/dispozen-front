// frontend/src/queries/users.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  getUsers,
  createUser,
  updateUser,
  getUserById,
  type User,
} from '../api/users.api'

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export function useUserByIdQuery(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: !!id, // Only run query if id is provided
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

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}
