import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const storedUser = localStorage.getItem('authTokens')
    if (storedUser) {
      setAuthTokens(JSON.parse(storedUser))
      setUser(jwt_decode(storedUser))
    }
    setIsLoading(false)
  }, [])

  let contextData = {
    authTokens: authTokens,
    user: user,
    setAuthTokens,
    setUser
  }

  if (isLoading)
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className={`animate-spin ease-linear rounded-full h-40 w-40 pt-14 border-8 border-l-gray-400 border-r-gray-400 border-b-gray-400 border-t-indigo-900`}/>
      </div>
    )
    
  return (
    <AuthContext.Provider value={ contextData }>
      {children}
    </AuthContext.Provider>
  )
}