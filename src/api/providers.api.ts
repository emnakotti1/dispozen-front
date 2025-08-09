import { apiFetch } from './client'

export type Provider = {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  address: string
  imageUrl: string
  postalCode: string
  city: string
  email: string
}

export function getProviders(page = 1, limit = 6, search?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (search?.trim()) {
    params.append('search', search.trim())
  }

  return apiFetch<{ data: Provider[] }>(
    `/users/providers?${params.toString()}`,
  ).then(response => response.data)
}
