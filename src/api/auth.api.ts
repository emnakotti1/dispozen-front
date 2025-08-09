// src/api/auth.api.ts
import { apiFetch } from './client'

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  access_token: string
  role: string
  refreshToken?: string
  user?: {
    id: string
    email: string
    firstname: string
    lastname: string
  }
}

export function loginUser(payload: LoginPayload) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
