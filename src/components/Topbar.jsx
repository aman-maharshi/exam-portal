import React from "react"
import { useNavigate } from "react-router-dom"
import UserInfo from "../assets/user-info.svg?react"

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
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          title="View Profile"
        >
          <UserInfo className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  )
}

export default Topbar
