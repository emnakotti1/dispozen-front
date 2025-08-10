import { ref, computed, watch } from 'vue'
import type { LoginResponse } from '../api/auth.api'

// État global pour l'authentification
const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
const user = ref<LoginResponse['user'] | null>(null)

// Charger les informations utilisateur depuis localStorage au démarrage
const userDataStored = localStorage.getItem('userData')
if (userDataStored) {
  try {
    user.value = JSON.parse(userDataStored)
  } catch (error) {
    console.error('Erreur lors du parsing des données utilisateur:', error)
    localStorage.removeItem('userData')
  }
}

export function useAuth() {
  // Computed pour vérifier si l'utilisateur est connecté
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!user.value
  })

  // Computed pour obtenir l'utilisateur actuel
  const currentUser = computed(() => user.value)

  // Fonction pour décoder un token JWT
  const decodeJWT = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error)
      return null
    }
  }

  // Fonction pour se connecter
  const login = (loginResponse: LoginResponse) => {
    console.log('🔑 Connexion avec données:', loginResponse)

    accessToken.value = loginResponse.access_token
    let tokenPayload = null

    // Si l'objet user n'est pas fourni, extraire les infos du token
    if (loginResponse.user) {
      user.value = loginResponse.user
      console.log('👤 Utilisateur depuis réponse API:', loginResponse.user)
    } else {
      // Décoder le token pour extraire les informations utilisateur
      tokenPayload = decodeJWT(loginResponse.access_token)
      console.log('🎫 Token décodé:', tokenPayload)

      if (tokenPayload) {
        user.value = {
          id: tokenPayload.sub || 'unknown',
          email: tokenPayload.email || 'unknown@example.com',
          firstname:
            tokenPayload.firstName || tokenPayload.firstname || 'Utilisateur',
          lastname: tokenPayload.lastName || tokenPayload.lastname || '',
        }
        console.log('👤 Utilisateur créé depuis token:', user.value)
      }
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('accessToken', loginResponse.access_token)
    if (user.value) {
      localStorage.setItem('userData', JSON.stringify(user.value))
    }

    // Optionnel: sauvegarder aussi le refresh token
    if (loginResponse.refreshToken) {
      localStorage.setItem('refreshToken', loginResponse.refreshToken)
    }

    // Sauvegarder le rôle s'il est fourni (soit depuis la réponse, soit depuis le token)
    const userRole = loginResponse.role || (tokenPayload && tokenPayload.role)
    if (userRole) {
      localStorage.setItem('userRole', userRole)
      console.log('🎭 Rôle utilisateur sauvegardé:', userRole)
    }

    console.log('💾 Données sauvegardées dans localStorage')
    console.log(
      "✅ État d'authentification:",
      !!accessToken.value && !!user.value,
    )

    // Retourner le rôle pour permettre une redirection immédiate
    return userRole
  }

  // Fonction pour se déconnecter
  const logout = () => {
    accessToken.value = null
    user.value = null

    // Nettoyer localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
  }

  // Fonction pour vérifier si le token est valide (optionnel)
  const checkTokenValidity = () => {
    const token = accessToken.value
    if (!token) return false

    try {
      // Décoder le JWT pour vérifier la date d'expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000

      if (payload.exp < currentTime) {
        // Token expiré, déconnecter l'utilisateur
        logout()
        return false
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error)
      logout()
      return false
    }
  }

  // Fonction pour obtenir le token d'accès
  const getAccessToken = () => accessToken.value

  // Fonction pour obtenir les headers d'authentification
  const getAuthHeaders = () => {
    const token = accessToken.value
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Fonction pour obtenir le rôle utilisateur
  const getUserRole = () => {
    return localStorage.getItem('userRole') || null
  }

  // Watcher pour synchroniser les changements avec localStorage
  watch(accessToken, newToken => {
    if (newToken) {
      localStorage.setItem('accessToken', newToken)
    } else {
      localStorage.removeItem('accessToken')
    }
  })

  watch(
    user,
    newUser => {
      if (newUser) {
        localStorage.setItem('userData', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('userData')
      }
    },
    { deep: true },
  )

  return {
    // État
    isAuthenticated,
    currentUser,

    // Actions
    login,
    logout,
    checkTokenValidity,
    getAccessToken,
    getAuthHeaders,
    getUserRole,
  }
}
