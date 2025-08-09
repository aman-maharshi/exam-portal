import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { authService } from "../../services/authService"
import GlobalContext from "../../GlobalContext"
import { rateLimiter } from "../../utils/rateLimiter"

// ICONS
import DownArrow from "../../assets/down-arrow.svg?react"
import ShowPassword from "../../assets/password-show.svg?react"
import HidePassword from "../../assets/password-hide.svg?react"
import EmailAtIcon from "../../assets/email-at.svg?react"
import UserIcon from "../../assets/user.svg?react"
import LockIcon from "../../assets/lock.svg?react"

const SignIn = ({ onSwitchToSignUp, onSwitchToForgotPassword }) => {
  const { setUserData } = useContext(GlobalContext)
  const [email, setEmail] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async e => {
    e?.preventDefault()

    if (!email || !password || !selectedClass) {
      return showToast("All fields are required")
    }

    // Check rate limiting for signin
    if (rateLimiter.isRateLimited("signin")) {
      const timeRemaining = rateLimiter.formatTimeRemaining("signin")
      return showToast(`Too many failed attempts. Please try again in ${timeRemaining}.`)
    }

    setIsLoading(true)
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
        // Record failed attempt
        rateLimiter.recordAttempt("signin")
        const remainingAttempts = rateLimiter.getRemainingAttempts("signin")

        if (remainingAttempts > 0) {
          showToast("Invalid email or password. Please try again.")
        } else {
          const timeRemaining = rateLimiter.formatTimeRemaining("signin")
          showToast(`Too many failed attempts. Please try again in ${timeRemaining}.`)
        }
      }
    } catch (error) {
      // Record failed attempt for network errors too
      rateLimiter.recordAttempt("signin")
      const remainingAttempts = rateLimiter.getRemainingAttempts("signin")

      if (remainingAttempts > 0) {
        showToast("Network error. Please check your connection and try again.")
      } else {
        const timeRemaining = rateLimiter.formatTimeRemaining("signin")
        showToast(`Too many failed attempts. Please try again in ${timeRemaining}.`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const showToast = (message, options = {}) => {
    toast(message, {
      position: "top-center",
      type: options.type || "error",
      limit: 1,
      autoClose: 5000,
      ...options
    })
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Email Address</label>
        <div className="flex items-center border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus-within:border-gray-400 transition-all duration-200">
          <div className="pl-3 pr-2">
            <EmailAtIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 py-3 pr-4 border-none bg-transparent focus:outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Class Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Class</label>
        <div className="flex items-center border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus-within:border-gray-400 transition-all duration-200">
          <div className="pl-3 pr-2">
            <UserIcon className="h-5 w-5 text-gray-500" />
          </div>
          <select
            className="flex-1 py-3 pr-10 border-none bg-transparent focus:outline-none appearance-none cursor-pointer"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            required
          >
            <option value="" disabled>
              Select your class
            </option>
            <option value="7th">7th Grade</option>
            <option value="8th">8th Grade</option>
            <option value="9th">9th Grade</option>
          </select>
          <div className="pr-3">
            <DownArrow className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Password</label>
        <div className="flex items-center border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus-within:border-gray-400 transition-all duration-200">
          <div className="pl-3 pr-2">
            <LockIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="flex-1 py-3 pr-12 border-none bg-transparent focus:outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ShowPassword className="h-5 w-5" /> : <HidePassword className="h-5 w-5" />}
          </button>
        </div>
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            onClick={onSwitchToForgotPassword}
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 cta-gradient text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Signing In...
          </div>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Additional Info */}
      {/* <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            disabled={isLoading}
            className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSwitchToSignUp}
          >
            Sign up
          </button>
        </p>
      </div> */}
    </form>
  )
}

export default SignIn
