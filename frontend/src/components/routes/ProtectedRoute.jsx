import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

export default function ProtectedRoute(props) {
    const { user } = useContext(AuthContext)
    const router = useRouter()
    const isAuthorized = !props.isProtected || (props.isAdminOnly && user.eAdministrador === true)

    if (props.isAuthPage && user) {
        router.push('/')
        return null
    }
    if (props.isProtected && !user) {
        router.push('/authentication')
        return null
    }
    if (isAuthorized) 
        return props.children
    else {
        router.push('/')
        return null
    }
}