import { useContext } from 'react'
import GlobalContext from "../GlobalContext"
import { useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const Sidebar = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  const { pathname } = useLocation()

  const handleLogout = () => {
    setUserData({})
    navigate('/')
  }

  return (
    <div className='bg-white w-[250px] p-4 h-full rounded-xl shadow-md hidden md:flex flex-col gap-4'>
      <div
        onClick={() => navigate('/home')}
        className={clsx(
          'p-4 rounded-xl font-bold cursor-pointer',
          pathname === '/home' ? 'card-gradient text-white' : 'bg-gray-100'
        )}
      >
        Home
      </div>
      <div
        onClick={() => navigate('/results')}
        className={clsx(
          'p-4 rounded-xl font-bold cursor-pointer',
          pathname === '/results' ? 'card-gradient text-white' : 'bg-gray-100'
        )}
      >
        Test Results
      </div>
      <div
        className={clsx(
          'p-4 rounded-xl font-bold cursor-default',
          pathname === '/study-material' ? 'card-gradient text-white' : 'bg-gray-100'
        )}
      >
        Study Material
      </div>


      <div onClick={handleLogout} className='p-4 mt-auto text-gray-500 font-bold cursor-pointer'>
        Logout
      </div>
    </div>
  )
}

export default Sidebar