import { useContext, useState } from "react"
import GlobalContext from "../GlobalContext"
import { useNavigate, useLocation } from "react-router-dom"
import clsx from "clsx"
import LogoutModal from "./modals/LogoutModal"
import { authService } from "../services/authService"

// ICONS
import TrophyIcon from "../assets/trophy.svg?react"
import HomeIcon from "../assets/home.svg?react"
import BookIcon from "../assets/book.svg?react"
import LogoutIcon from "../assets/logout.svg?react"
import MenuIcon from "../assets/menu.svg?react"
import CloseIcon from "../assets/close.svg?react"
import GraphIcon from "../assets/graph.svg?react"
import PracticeIcon from "../assets/graduation-hat.svg?react" // Reusing graduation hat for practice

const Sidebar = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { pathname } = useLocation()

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUserData(null)
      localStorage.removeItem("rate_limit_signin")
      localStorage.removeItem("rate_limit_signup")
      localStorage.removeItem("rate_limit_forgot_password")
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
      // Fallback to local logout
      setUserData({ role: userData?.role })
      navigate("/")
    }
  }

  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 fixed top-3 left-3 sm:top-4 sm:left-4 z-50 cta-gradient rounded-full shadow-lg"
      >
        {isOpen ? (
          <CloseIcon className="size-5 sm:size-6 text-white" />
        ) : (
          <MenuIcon className="size-5 sm:size-6 text-white" />
        )}
      </button>
      <div
        className={clsx(
          "fixed top-0 left-0 z-40 lg:relative h-screen bg-white w-[250px] p-4 pt-20 lg:pt-6 shadow-xl transform transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-4 h-full">
          <div
            onClick={() => navigate("/home")}
            className={clsx(
              "p-4 rounded-lg font-bold cursor-pointer flex items-center gap-3",
              pathname === "/home" ? "cta-gradient text-white" : "bg-transparent"
            )}
          >
            <HomeIcon className="w-5 h-5" />
            <div>Home</div>
          </div>
          <div
            onClick={() => navigate("/results")}
            className={clsx(
              "p-4 rounded-lg font-bold cursor-pointer flex items-center gap-3",
              pathname === "/results" ? "cta-gradient text-white" : "bg-transparent"
            )}
          >
            <TrophyIcon className="w-5 h-5" />
            <div>Test Results</div>
          </div>
          <div
            onClick={() => navigate("/study-materials")}
            className={clsx(
              "p-4 rounded-lg font-bold cursor-pointer flex items-center gap-3",
              pathname === "/study-materials" ? "cta-gradient text-white" : "bg-transparent"
            )}
          >
            <BookIcon className="w-5 h-5" />
            <div>Study Material</div>
          </div>
          <div
            onClick={() => navigate("/your-progress")}
            className={clsx(
              "p-4 rounded-lg font-bold cursor-pointer flex items-center gap-3",
              pathname === "/your-progress" ? "cta-gradient text-white" : "bg-transparent"
            )}
          >
            <GraphIcon className="w-5 h-5" />
            <div>Your Progress</div>
          </div>
          {/* <div
            onClick={() => navigate("/practice")}
            className={clsx(
              "p-4 rounded-lg font-bold cursor-pointer flex items-center gap-3",
              pathname === "/practice" ? "cta-gradient text-white" : "bg-transparent"
            )}
          >
            <PracticeIcon className="w-5 h-5" />
            <div>Practice Mode</div>
          </div> */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="p-4 mt-auto text-gray-500 font-bold cursor-pointer flex items-center gap-3"
          >
            <LogoutIcon className="w-5 h-5" />
            <div>Logout</div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <LogoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleLogout={handleLogout} />
      )}
    </>
  )
}

export default Sidebar
