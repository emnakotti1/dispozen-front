import { apiFetch } from './client'

export type Service = {
  id: string
  name: string
  description: string
  price: number
  providerId: string
  // ajoute d'autres champs si besoin
}

export function getServicesByProvider(providerId: string) {
  return apiFetch<Service[]>(`/services/provider/${providerId}`);
}
