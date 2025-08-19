import { apiFetch } from './client'

export interface Unavailability {
  id: string
  date: string
  startTime: string
  endTime: string
  type: 'unavailability' | 'client_appointment'
  reason: string | null
  createdAt: string
  serviceId: string | null
}

export async function getProviderUnavailabilities(
  providerId: string,
): Promise<Unavailability[]> {
  // Endpoint public pour récupérer les indisponibilités d'un provider spécifique
  // Vous devrez ajouter cet endpoint dans votre backend :
  // @Get('provider/:providerId/unavailabilities')
  return apiFetch<Unavailability[]>(
    `/calendar/provider/${providerId}/unavailabilities`,
  )
}
