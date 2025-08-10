import { apiFetch } from './client'

export interface CreateAppointmentDto {
  providerId: string
  serviceId: string
  date: string // Format: YYYY-MM-DD
  startTime: string // Format: HH:MM
  notes?: string // Notes additionnelles (optionnel)
}

export const AppointmentStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export interface Appointment {
  id: string
  createdAt: string
  status: AppointmentStatus
  isValidated: boolean
  isCancelled: boolean
  notes?: string
  client: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
    imageUrl?: string
    address?: string
    postalCode?: string
    city?: string
    governorate?: string
    biography?: string
    registrationDate: string
    role: string
  }
  provider: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
    imageUrl?: string
    address?: string
    postalCode?: string
    city?: string
    governorate?: string
    biography?: string
    registrationDate: string
    role: string
  }
  service: {
    id: string
    name: string
    description: string
    price: number
    currency: string
    duration: number // en minutes
    status: string
  }
  calendar: {
    id: string
    date: string
    startTime: string
    endTime: string
    type: string
    reason?: string
    createdAt: string
    serviceId: string
  } | null
}

export async function createAppointment(
  dto: CreateAppointmentDto,
): Promise<Appointment> {
  // Récupérer le clientId depuis le localStorage ou le token
  const userData = localStorage.getItem('userData')
  let clientId = ''

  if (userData) {
    try {
      const user = JSON.parse(userData)
      clientId = user.id
    } catch (error) {
      console.error('Error parsing user data:', error)
      throw new Error('User not authenticated')
    }
  } else {
    throw new Error('User not authenticated')
  }

  return apiFetch<Appointment>(`/appointment`, {
    method: 'POST',
    body: JSON.stringify({
      ...dto,
      clientId, // Ajouter le clientId au DTO
    }),
  })
}

export async function getAppointments(
  clientId: string,
): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(`/appointment/client/${clientId}`)
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointment/${id}`)
}

export async function cancelAppointment(id: string): Promise<string> {
  return apiFetch<string>(`/appointment/cancel/${id}`, {
    method: 'PATCH',
  })
}

export async function confirmAppointment(id: string): Promise<string> {
  try {
    const result = await apiFetch<string>(`/appointment/confirme/${id}`, {
      method: 'PATCH',
    })
    return result
  } catch (error) {
    console.error('❌ API: Erreur confirmation:', error)
    throw error
  }
}

export async function getProviderAppointments(
  providerId: string,
): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(`/appointment/prestataire/${providerId}`)
}

// Récupérer les détails d'une réservation
export async function getAppointmentDetails(
  appointmentId: string,
): Promise<Appointment> {
  try {
    const result = await apiFetch<Appointment>(
      `/appointment/details/${appointmentId}`,
    )
    return result
  } catch (error) {
    console.error('❌ API: Erreur récupération détails:', error)
    throw error
  }
}
