import { useAuth } from '../composables/useAuth'

const API_BASE_URL = 'http://localhost:3000'

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  // Utiliser le composable d'authentification pour obtenir le token
  const { getAccessToken } = useAuth()
  const token = getAccessToken()

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Erreur API')
  }

  // Vérifier si la réponse contient du JSON
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json()
  } else {
    // Si ce n'est pas du JSON, retourner le texte
    return res.text() as T
  }
}
