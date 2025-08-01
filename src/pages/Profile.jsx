import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import GlobalContext from "../GlobalContext"
import { databaseService } from "../services/databaseService"
import { toast } from "react-toastify"

// COMPONENTS
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

// ICONS
import UserInfo from "../assets/user-info.svg?react"

const Profile = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    selectedClass: userData?.selectedClass || ""
  })

  const handleSaveProfile = async () => {
    if (!formData.username.trim()) {
      toast.error("Username is required")
      return
    }

    try {
      const result = await databaseService.updateUserProfile(userData.uid, {
        username: formData.username,
        selectedClass: formData.selectedClass
      })

      if (result.success) {
        setUserData(prev => ({
          ...prev,
          username: formData.username,
          selectedClass: formData.selectedClass
        }))
        setEditing(false)
        toast.success("Profile updated successfully")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error updating profile")
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      username: userData?.username || "",
      selectedClass: userData?.selectedClass || ""
    })
    setEditing(false)
  }

  return (
    <Layout>
      <div className="min-h-screen modern-bg w-full flex">
        <div className="flex flex-1">
          <Sidebar />

          <div className="flex-1 rounded-lg p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto">
            <Topbar userData={userData} />

            <div className="mt-6">
              {/* Profile Information */}
              <div className="bg-white p-6 rounded-xl max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-bold">Profile Information</h3>
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                      <select
                        value={formData.selectedClass}
                        onChange={e => setFormData(prev => ({ ...prev, selectedClass: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="7th">7th</option>
                        <option value="8th">8th</option>
                        <option value="9th">9th</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        className="cta-gradient text-white py-2 px-4 rounded-lg font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Username</label>
                      <p className="text-lg font-semibold">{userData?.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg font-semibold">{userData?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Class</label>
                      <p className="text-lg font-semibold">{userData?.selectedClass}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Role</label>
                      <p className="text-lg font-semibold capitalize">{userData?.role}</p>
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      className="cta-gradient text-white py-2 px-4 rounded-lg font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
