import { useContext } from 'react'
import GlobalContext from "../GlobalContext"
import { useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'

// ICONS
import TrophyIcon from "../assets/trophy.svg?react"
import HomeIcon from "../assets/home.svg?react"
import BookIcon from "../assets/book.svg?react"
import LogoutIcon from "../assets/logout.svg?react"

const Sidebar = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  const { pathname } = useLocation()

  const handleLogout = () => {
    setUserData({ role: userData?.role })
    navigate('/')
  }

  return (
    <div className='flex flex-col gap-4 bg-white w-auto lg:w-[250px] p-4 h-full rounded-xl shadow-lg'>
      <div
        onClick={() => navigate('/home')}
        className={clsx(
          'p-4 rounded-xl font-bold cursor-pointer flex items-center gap-3',
          pathname === '/home' ? 'card-gradient text-white' : 'bg-gray-100'
        )}
      >
        <HomeIcon className='w-5 h-5' />
        <div className='hidden lg:flex'>Home</div>
      </div>
      <div
        onClick={() => navigate('/results')}
        className={clsx(
          'p-4 rounded-xl font-bold cursor-pointer flex items-center gap-3',
          pathname === '/results' ? 'card-gradient text-white' : 'bg-gray-100'
        )}
      >
        <TrophyIcon className='w-5 h-5' />
        <div className='hidden lg:flex'>Test Results</div>
      </div>
      <div
        className={clsx(
          'p-4 rounded-xl font-bold cursor-default flex items-center gap-3 opacity-50',
          pathname === '/study-material' ? 'card-gradient text-white' : 'bg-gray-100'
        )}
      >
        <BookIcon className='w-5 h-5' />
        <div className='hidden lg:flex'>Study Material</div>
      </div>


      <div onClick={handleLogout} className='p-4 mt-auto text-gray-500 font-bold cursor-pointer flex items-center gap-3'>
        <LogoutIcon className='w-5 h-5' />
        <div className='hidden lg:flex'>Logout</div>
      </div>
    </div>
  )
}

export default Sidebar