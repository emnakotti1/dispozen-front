import { apiFetch } from './client'

export type Provider = {
  firstName: string
  lastName: string
  phoneNumber: string
  address: string
  imageUrl: string
  postalCode: string
  city: string
}

export function getProviders() {
  return apiFetch<Provider[]>('/users/providers')
}
