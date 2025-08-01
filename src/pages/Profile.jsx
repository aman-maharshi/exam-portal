import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import GlobalContext from "../GlobalContext"
import { databaseService } from "../services/databaseService"
import { toast } from "react-toastify"

// COMPONENTS
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

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

            <div className="mt-6 max-w-4xl mx-auto">
              {/* Profile Header */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 cta-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {userData?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{userData?.username}</h1>
                    <p className="text-gray-600">{userData?.email}</p>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                </div>

                {editing ? (
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                      <select
                        value={formData.selectedClass}
                        onChange={e => setFormData(prev => ({ ...prev, selectedClass: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select your class</option>
                        <option value="7th">7th Grade</option>
                        <option value="8th">8th Grade</option>
                        <option value="9th">9th Grade</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 cta-gradient text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                        <p className="text-lg font-semibold text-gray-900">{userData?.username}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <p className="text-lg font-semibold text-gray-900">{userData?.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Class</label>
                        <p className="text-lg font-semibold text-gray-900">{userData?.selectedClass}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                        <p className="text-lg font-semibold text-gray-900 capitalize">{userData?.role}</p>
                      </div>
                    </div>
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
