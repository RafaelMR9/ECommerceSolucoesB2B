import { createContext, useEffect, useMemo, useState } from 'react'

export const AuthContext = createContext({ user: null })
export function AuthProvider({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser)
  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])
  const value = useMemo(() => ({ user, setUser }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
