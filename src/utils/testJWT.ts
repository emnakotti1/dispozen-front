// Test rapide du décodage JWT
const testToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNmQxM2NmNC03N2YwLTQ0ZWMtYjRhNS00MzE0MjQ0Y2UxODEiLCJlbWFpbCI6InRlc3QwMUBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJ0ZXN0MDEiLCJsYXN0TmFtZSI6ImtvdHRpIiwicm9sZSI6ImNsaWVudCIsImlhdCI6MTc1NDc0MjMzNiwiZXhwIjoxNzU0NzQ1OTM2fQ.4xJjpppHji70KTvE4sYYxngtL7iHVrFLQHSPlvPP-y0'

try {
  JSON.parse(atob(testToken.split('.')[1]))

  // Token processing completed
} catch (error) {
  console.error('Erreur décodage:', error)
}

export {}
