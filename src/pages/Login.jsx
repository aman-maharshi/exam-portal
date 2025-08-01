import React, { useState, useContext } from "react"
import GlobalContext from "../GlobalContext"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { authService } from "../services/authService"
import clsx from "clsx"

// ICONS
import DownArrow from "../assets/down-arrow.svg?react"
import UserInfo from "../assets/user-info.svg?react"
import ShowPassword from "../assets/password-show.svg?react"
import HidePassword from "../assets/password-hide.svg?react"
import Copy from "../assets/copy.svg?react"
import Check from "../assets/check.svg?react"

const Login = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleLogin = async e => {
    e?.preventDefault()

    if (!email || !password || !selectedClass) {
      return showToast("All fields are required")
    }

    try {
      const result = await authService.login(email, password)

      if (result.success) {
        setUserData({
          ...result.user,
          selectedClass,
          loggedIn: true
        })
        navigate("/home")
      } else {
        showToast(result.error || "Login failed")
      }
    } catch (error) {
      showToast("Login failed. Please try again.")
    }
  }

  const handleRegister = async e => {
    e?.preventDefault()

    if (!username || !email || !password) {
      return showToast("All fields are required")
    }

    if (password.length < 6) {
      return showToast("Password must be at least 6 characters")
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return showToast("Please enter a valid email address")
    }

    try {
      const userData = {
        username,
        email,
        role: "student", // Default role is student
        results: [],
        createdAt: new Date().toISOString()
      }

      const result = await authService.register(email, password, userData)

      if (result.success) {
        showToast("Registration successful! You can now login.", {
          type: "success"
        })
        setIsLogin(true)
        setPassword("")
        setUsername("")
        setEmail("")
      } else {
        showToast(result.error || "Registration failed")
      }
    } catch (error) {
      showToast("Registration failed. Please try again.")
    }
  }

  const showToast = (message, options = {}) => {
    toast(message, {
      position: "top-center",
      type: "error",
      limit: 1,
      autoClose: 5000,
      ...options
    })
  }

  return (
    <div className="w-full min-h-screen bg-neutral-100 text-[#1b1b1b]">
      <div className="min-h-screen flex flex-col gap-10 items-center">
        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="bg-white p-10 rounded-xl card-shadow flex flex-col w-full sm:w-[450px] mt-24"
        >
          <div className="flex justify-center mb-6">
            <button
              type="button"
              className={clsx(
                "py-2 px-4 rounded-l-lg transition-all font-medium duration-300 outline-none",
                isLogin ? "cta-gradient text-white" : "bg-gray-200 text-black"
              )}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={clsx(
                "py-2 px-4 rounded-r-lg transition-all font-medium duration-300 outline-none",
                !isLogin ? "cta-gradient text-white" : "bg-gray-200 text-black"
              )}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 mt-4">Exam Portal</h2>
          <p className="mb-6 text-center text-gray-500">
            {isLogin ? "Please enter your details to login" : "Please enter your details to register"}
          </p>

          {!isLogin && (
            <input
              type="text"
              placeholder="Enter your Name"
              className="border p-2 rounded-lg mb-4"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Enter your Email"
            className="border p-2 rounded-lg mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          {isLogin && (
            <div className="border p-2 rounded-lg overflow-hidden mb-4 flex items-center justify-between">
              <select
                className={clsx(
                  "appearance-none outline-none flex-1 cursor-pointer bg-transparent",
                  selectedClass ? "text-black" : "text-gray-400"
                )}
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your class
                </option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
              </select>
              <DownArrow className="h-5 w-5" />
            </div>
          )}

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="border p-2 rounded-lg w-full pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <ShowPassword className="h-6 w-6 text-black" />
              ) : (
                <HidePassword className="h-6 w-6 text-black" />
              )}
            </button>
          </div>

          <button type="submit" className="p-2 mt-4 rounded-lg text-white transition-all duration-300 cta-gradient">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
