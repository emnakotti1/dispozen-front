import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export function authGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // Vérifier directement dans localStorage pour éviter les problèmes de réactivité dans les guards
  const token = localStorage.getItem('accessToken')
  const userData = localStorage.getItem('userData')

  // Vérifier si le token est valide
  if (token && userData) {
    try {
      // Vérifier si le token n'est pas expiré
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      if (payload.exp && payload.exp > currentTime) {
        next() // Token valide, continuer
        return
      }
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error)
    }
  }

  // Token invalide ou absent, rediriger vers login
  next('/login')
}

// Guard pour les pages publiques (login, register) - rediriger si déjà connecté
export function guestGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // Vérifier directement dans localStorage
  const token = localStorage.getItem('accessToken')
  const userData = localStorage.getItem('userData')

  // Si l'utilisateur est authentifié et le token est valide, rediriger vers les providers
  if (token && userData) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      if (payload.exp && payload.exp > currentTime) {
        next('/providers') // Rediriger vers providers si déjà connecté
        return
      }
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error)
    }
  }

  next() // Utilisateur non authentifié, continuer vers la page demandée
}
