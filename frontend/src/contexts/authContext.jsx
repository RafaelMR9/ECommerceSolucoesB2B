import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  useEffect(() => {
    console.log(user)
    const storedUser = localStorage.getItem('authTokens')
    if (storedUser) {
      setAuthTokens(JSON.parse(storedUser))
      setUser(jwt_decode(storedUser))
    }
  }, [])

  const [authTokens, setAuthTokens] = useState(null)
  const [user, setUser] = useState(null)

  let contextData = {
    authTokens: authTokens,
    user: user,
    setAuthTokens,
    setUser
  }

  return (
    <AuthContext.Provider value={ contextData }>
      {children}
    </AuthContext.Provider>
  )
}