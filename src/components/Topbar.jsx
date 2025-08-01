import React from "react"
import { useNavigate } from "react-router-dom"

const Topbar = ({ userData }) => {
  const navigate = useNavigate()

  const handleProfileClick = () => {
    navigate("/profile")
  }

  return (
    <div className="flex flex-row justify-between items-center pl-12 lg:pl-0">
      <h1 className="font-bold text-lg sm:text-xl lg:text-3xl">Welcome, {userData?.username} 👋</h1>
      <div className="flex items-center gap-4">
        <div className="text-base font-bold">{userData?.selectedClass} Class</div>
        <button
          onClick={handleProfileClick}
          className="p-2 rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200"
          title="View Profile"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Topbar
