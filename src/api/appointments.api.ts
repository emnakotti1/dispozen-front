import { apiFetch } from './client'

export interface CreateAppointmentDto {
  providerId: string
  serviceId: string
  date: string // Format: YYYY-MM-DD
  startTime: string // Format: HH:MM
}

export interface Appointment {
  id: string
  client: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  provider: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  service: {
    id: string
    name: string
    description: string
    price: number
    currency: string
    duration: number // en minutes
  }
  calendar: {
    id: string
    date: string
    startTime: string
    endTime: string
  }
  createdAt: string
  updatedAt: string
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
