import { apiFetch } from './client'

export type Provider = {
  id:string
  firstName: string
  lastName: string
  phoneNumber: string
  address: string
  imageUrl: string
  postalCode: string
  city: string
}

export function getProviders(page = 1, limit = 6) {
  return apiFetch<{ data: Provider[] }>(`/users/providers?page=${page}&limit=${limit}`)
    .then(response => response.data)
}
