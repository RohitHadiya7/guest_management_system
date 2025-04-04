import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const withAuth = (WrappedComponent) => {
  return (props) => {
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
}

export default withAuth