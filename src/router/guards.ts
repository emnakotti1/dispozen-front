import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// Guard pour créer un guard spécifique aux providers
export function providerGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const token = localStorage.getItem('accessToken')
  const userData = localStorage.getItem('userData')
  const userRole = localStorage.getItem('userRole')

  // Vérifier si l'utilisateur est authentifié
  if (token && userData) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      if (payload.exp && payload.exp > currentTime) {
        // Vérifier si l'utilisateur est un provider
        if (userRole === 'provider') {
          next() // Autoriser l'accès
          return
        } else {
          // Rediriger les clients vers la liste des providers
          next('/providers')
          return
        }
      }
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error)
    }
  }

  // Token invalide ou absent, rediriger vers login
  next('/login')
}

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
  const userRole = localStorage.getItem('userRole')

  // Si l'utilisateur est authentifié et le token est valide, rediriger selon le rôle
  if (token && userData) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      if (payload.exp && payload.exp > currentTime) {
        // Rediriger selon le rôle de l'utilisateur
        if (userRole === 'provider') {
          next('/provider/dashboard')
        } else {
          next('/providers') // Rediriger vers providers pour les clients
        }
        return
      }
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error)
    }
  }

  next() // Utilisateur non authentifié, continuer vers la page demandée
}
