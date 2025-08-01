// frontend/src/api/client.ts

const API_BASE_URL = '/'

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Erreur API')
  }

  return res.json()
}
