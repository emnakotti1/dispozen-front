import { apiFetch } from './client'

export type User = {
  id?: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  password?: string
  imageUrl?: string | null
  address?: string | null
  postalCode?: string | null
  city?: string | null
  governorate?: string | null
  biography?: string | null
  registrationDate?: string
  role?: string
}

export function getUsers() {
  return apiFetch<User[]>('/users')
}

export function getUserById(id: string) {
  return apiFetch<User>(`/users/${id}`)
}

export function createUser(user: User) {
  return apiFetch<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export function updateUser(id: string, userData: Partial<User>) {
  return apiFetch<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  })
}
