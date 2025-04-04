import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      const jwt = localStorage.getItem('jwt')
      if (!jwt) {
        router.push('/login') 
      } else {
        setLoading(false) 
      }
    }, [])

    if (loading) {
      return <p>Loading...</p> 
    }

    return <WrappedComponent {...props} />
  }

  // Add display name for better debugging
  AuthenticatedComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return AuthenticatedComponent
}

export default withAuth
