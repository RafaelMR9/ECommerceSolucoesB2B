import { createContext, useEffect, useMemo, useState } from 'react'

export const AuthContext = createContext({ user: null, cartCount: 0 })
export function AuthProvider({ initialUser = null, initialCartCount = 0, children }) {
  const [user, setUser] = useState(initialUser)
  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])
  const value = useMemo(
    () => ({ user, setUser, cartCount: initialCartCount }),
    [user, initialCartCount]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
