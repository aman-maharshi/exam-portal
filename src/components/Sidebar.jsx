import { useContext, useState } from 'react'
import GlobalContext from "../GlobalContext"
import { useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'

// ICONS
import TrophyIcon from "../assets/trophy.svg?react"
import HomeIcon from "../assets/home.svg?react"
import BookIcon from "../assets/book.svg?react"
import LogoutIcon from "../assets/logout.svg?react"
import MenuIcon from "../assets/menu.svg?react"
import CloseIcon from "../assets/close.svg?react"

const Sidebar = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  const { pathname } = useLocation()

  const handleLogout = () => {
    setUserData({ role: userData?.role })
    navigate('/')
  }

  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 fixed top-3 left-3 sm:top-5 sm:left-4 z-50 cta-gradient rounded-full shadow-lg"
      >
        {isOpen ? <CloseIcon className="size-5 sm:size-6 text-white" /> : <MenuIcon className="size-5 sm:size-6 text-white" />}
      </button>
      <div
        className={clsx(
          'fixed top-0 left-0 lg:relative h-full bg-white w-[250px] p-4 pt-20 lg:pt-4 rounded-xl shadow-xl transform transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col gap-4">
          <div
            onClick={() => navigate('/home')}
            className={clsx(
              'p-4 rounded-xl font-bold cursor-pointer flex items-center gap-3',
              pathname === '/home' ? 'cta-gradient text-white' : 'bg-gray-100'
            )}
          >
            <HomeIcon className="w-5 h-5" />
            <div>Home</div>
          </div>
          <div
            onClick={() => navigate('/results')}
            className={clsx(
              'p-4 rounded-xl font-bold cursor-pointer flex items-center gap-3',
              pathname === '/results' ? 'cta-gradient text-white' : 'bg-gray-100'
            )}
          >
            <TrophyIcon className="w-5 h-5" />
            <div>Test Results</div>
          </div>
          <div
            className={clsx(
              'p-4 rounded-xl font-bold cursor-default flex items-center gap-3 opacity-50',
              pathname === '/study-material' ? 'cta-gradient text-white' : 'bg-gray-100'
            )}
          >
            <BookIcon className="w-5 h-5" />
            <div>Study Material</div>
          </div>
          <div
            onClick={handleLogout}
            className="p-4 mt-auto text-gray-500 font-bold cursor-pointer flex items-center gap-3"
          >
            <LogoutIcon className="w-5 h-5" />
            <div>Logout</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar