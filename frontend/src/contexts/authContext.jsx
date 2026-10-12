import { createContext, useMemo } from 'react'

export const AuthContext = createContext({ user: null, cartCount: 0 })
export function AuthProvider({ initialUser = null, initialCartCount = 0, children }) {
  const value = useMemo(
    () => ({ user: initialUser, cartCount: initialCartCount }),
    [initialUser, initialCartCount]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
