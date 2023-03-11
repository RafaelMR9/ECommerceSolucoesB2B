import { createContext, useState, useEffect } from 'react'
import { getUserInfo } from '../services/userService'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function setUserInfo() {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const userData = await getUserInfo()
                setUser(userData)
            } catch (e) {
                console.log(e)
            }
        }
    }
    
    setUserInfo()
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};