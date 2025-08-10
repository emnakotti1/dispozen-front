import { apiFetch } from './client'

export const ServiceStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export type ServiceStatus = (typeof ServiceStatus)[keyof typeof ServiceStatus]

export interface CreateServiceDto {
  name: string
  duration: number
  description: string
  price: number
  currency?: string
  status?: ServiceStatus
}

export interface Service {
  id: string
  name: string
  duration: number
  description: string
  price: number
  currency: string
  status: ServiceStatus
  provider: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface UpdateServiceDto {
  name?: string
  duration?: number
  description?: string
  price?: number
  currency?: string
  status?: ServiceStatus
}

// Créer un nouveau service pour un provider
export async function createService(
  providerId: string,
  dto: CreateServiceDto,
): Promise<Service> {
  return apiFetch<Service>(`/services/${providerId}`, {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

// Récupérer tous les services d'un provider
export async function getProviderServices(
  providerId: string,
): Promise<Service[]> {
  return apiFetch<Service[]>(`/services/provider/${providerId}`)
}

// Récupérer un service par ID
export async function getServiceById(serviceId: string): Promise<Service> {
  return apiFetch<Service>(`/services/${serviceId}`)
}

// Mettre à jour un service
export async function updateService(
  serviceId: string,
  dto: UpdateServiceDto,
): Promise<Service> {
  return apiFetch<Service>(`/services/${serviceId}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

// Supprimer un service
export async function cancelService(serviceId: string): Promise<void> {
  return apiFetch<void>(`/services/${serviceId}`, {
    method: 'DELETE',
  })
}

// Activer/désactiver un service
export async function toggleServiceStatus(
  serviceId: string,
  status: ServiceStatus,
): Promise<Service> {
  return apiFetch<Service>(`/services/${serviceId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
