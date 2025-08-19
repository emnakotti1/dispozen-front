import { apiFetch } from './client'

export const DayOfWeek = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek]

export interface WorkingHours {
  id: string
  dayOfWeek: DayOfWeek
  startTime: string | null // Format HH:MM
  endTime: string | null // Format HH:MM
  isClosed: boolean
  provider: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface UpdateWorkingHoursDto {
  dayOfWeek: DayOfWeek
  startTime?: string | null
  endTime?: string | null
  isClosed: boolean
}

// Récupérer les horaires de travail d'un provider spécifique
export async function getProviderWorkingHours(
  providerId: string,
): Promise<WorkingHours[]> {
  return apiFetch<WorkingHours[]>(`/working-hours/provider/${providerId}`)
}

// Récupérer mes propres horaires de travail (provider connecté)
export async function getMyWorkingHours(): Promise<WorkingHours[]> {
  return apiFetch<WorkingHours[]>(`/working-hours/me`)
}

// Mettre à jour mes horaires de travail (provider connecté)
export async function updateMyWorkingHours(
  workingHours: UpdateWorkingHoursDto[],
): Promise<WorkingHours[]> {
  return apiFetch<WorkingHours[]>(`/working-hours/me`, {
    method: 'PUT',
    body: JSON.stringify(workingHours),
  })
}
