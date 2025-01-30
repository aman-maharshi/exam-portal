import { useEffect, useContext } from 'react'
import GlobalContext from "./GlobalContext"

const Layout = ({ children }) => {
  const { userData, setUserData } = useContext(GlobalContext)

  useEffect(() => {
    if (!userData?.loggedIn) {
      window.location.href = '/'
    }
  }, [userData])

  return (
    <div className='w-full min-h-screen bg-gradient text-[#1b1b1b]'>
      {children}
    </div>
  )
}

export default Layout