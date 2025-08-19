import { apiFetch } from './client'

export type Service = {
  id: string
  name: string
  description: string
  price: number
  providerId: string
  currency: string
}

export function getServicesByProvider(providerId: string) {
  return apiFetch<Service[]>(`/services/provider/${providerId}`)
}
