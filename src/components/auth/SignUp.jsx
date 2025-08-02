import React, { useState } from "react"
import { toast } from "react-toastify"
import { authService } from "../../services/authService"

// ICONS
import ShowPassword from "../../assets/password-show.svg?react"
import HidePassword from "../../assets/password-hide.svg?react"

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

      if (result.success) {
        showToast("Registration successful! You can now login.", {
          type: "success"
        })
        onSwitchToSignIn()
        setPassword("")
        setUsername("")
        setEmail("")
      } else {
        showToast("Registration failed. Please check your details and try again.")
      }
    } catch (error) {
      showToast("Network error. Please check your connection and try again.")
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
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
