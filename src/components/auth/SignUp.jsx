import React, { useState } from "react"
import { toast } from "react-toastify"
import { authService } from "../../services/authService"
import { rateLimiter } from "../../utils/rateLimiter"

// ICONS
import ShowPassword from "../../assets/password-show.svg?react"
import HidePassword from "../../assets/password-hide.svg?react"
import UserIcon from "../../assets/user.svg?react"
import EmailAtIcon from "../../assets/email-at.svg?react"
import LockIcon from "../../assets/lock.svg?react"

const SignUp = ({ onSwitchToSignIn }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

    // Check rate limiting for signup
    if (rateLimiter.isRateLimited("signup")) {
      const timeRemaining = rateLimiter.formatTimeRemaining("signup")
      return showToast(`Too many signup attempts. Please try again in ${timeRemaining}.`)
    }

    setIsLoading(true)
    try {
      const userData = {
        username,
        email,
        role: "student", // Default role is student
        results: [],
        createdAt: new Date().toISOString()
      }

      const result = await authService.register(email, password, userData)

      // Record attempt regardless of success/failure for signup
      rateLimiter.recordAttempt("signup")

      if (result.success) {
        showToast("Registration successful! You can now login.", {
          type: "success"
        })
        onSwitchToSignIn()
        setPassword("")
        setUsername("")
        setEmail("")
      } else {
        const remainingAttempts = rateLimiter.getRemainingAttempts("signup")

        if (remainingAttempts > 0) {
          showToast("Registration failed. Please check your details and try again.")
        } else {
          const timeRemaining = rateLimiter.formatTimeRemaining("signup")
          showToast(`Too many signup attempts. Please try again in ${timeRemaining}.`)
        }
      }
    } catch (error) {
      // Record failed attempt for network errors too
      rateLimiter.recordAttempt("signup")
      const remainingAttempts = rateLimiter.getRemainingAttempts("signup")

      if (remainingAttempts > 0) {
        showToast("Network error. Please check your connection and try again.")
      } else {
        const timeRemaining = rateLimiter.formatTimeRemaining("signup")
        showToast(`Too many signup attempts. Please try again in ${timeRemaining}.`)
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
    <form onSubmit={handleRegister} className="space-y-6">
      {/* Username Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <div className="flex items-center border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus-within:border-gray-400 transition-all duration-200">
          <div className="pl-3 pr-2">
            <UserIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            className="flex-1 py-3 pr-4 border-none bg-transparent focus:outline-none"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email Address</label>
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

      {/* Password Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
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
        <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
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
            Creating Account...
          </div>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            disabled={isLoading}
            className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSwitchToSignIn}
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  )
}

export default SignUp
