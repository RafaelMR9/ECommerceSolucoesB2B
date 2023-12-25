import { createContext, useState, useEffect } from 'react'
import { getUser } from '@/services/userService'
import jwt_decode from 'jwt-decode'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const storedUser = localStorage.getItem('authTokens')
    if (storedUser) {
      const jwtObj = jwt_decode(storedUser)
      const fetchUserData = async () => {
        try {
          const data = await getUser(jwtObj.user_id)

          setUser(data)
          setIsLoading(false)
          setAuthTokens(JSON.parse(storedUser))
        } catch (e) {
          setAuthTokens(null)
          setUser(null)
          localStorage.removeItem('authTokens')
          setIsLoading(false)
        }
      }

      fetchUserData()
    }
    else
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
        <div className={`animate-spin ease-linear rounded-full h-32 w-32 pt-14 border-8 border-l-gray-400 border-r-gray-400 border-b-gray-400 border-t-indigo-900`}/>
      </div>
    )
    
  return (
    <AuthContext.Provider value={ contextData }>
      {children}
    </AuthContext.Provider>
  )
}