import React, { useState, useContext } from "react"
import GlobalContext from "../GlobalContext"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { authService } from "../services/authService"
import clsx from "clsx"

// ICONS
import DownArrow from "../assets/down-arrow.svg?react"
import ShowPassword from "../assets/password-show.svg?react"
import HidePassword from "../assets/password-hide.svg?react"
import GraduationHat from "../assets/graduation-hat.svg?react"
import TrophyIcon from "../assets/trophy.svg?react"
import GraphIcon from "../assets/graph.svg?react"
import CheckIcon from "../assets/check.svg?react"

const Login = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async e => {
    e?.preventDefault()

    if (!email || !password || !selectedClass) {
      return showToast("All fields are required")
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
        showToast("Invalid email or password. Please try again.")
      }
    } catch (error) {
      showToast("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
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
        setIsLogin(true)
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

  const handleForgotPassword = async e => {
    e?.preventDefault()

    if (!forgotPasswordEmail.trim()) {
      return showToast("Please enter your email address")
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordEmail)) {
      return showToast("Please enter a valid email address")
    }

    setForgotPasswordLoading(true)
    try {
      const result = await authService.forgotPassword(forgotPasswordEmail)

      if (result.success) {
        showToast("If an account with this email exists, a password reset link has been sent.", { type: "success" })
        setShowForgotPassword(false)
        setForgotPasswordEmail("")
      } else {
        showToast("Failed to send reset email. Please try again.")
      }
    } catch (error) {
      showToast("Network error. Please check your connection and try again.")
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Column - Introduction */}
        <div className="hidden lg:flex lg:w-1/2 cta-gradient p-8 lg:p-12 flex-col justify-center">
          <div className="max-w-md mx-auto text-white">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 shadow-lg">
                <GraduationHat className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Exam Portal</h1>
              <p className="text-xl text-purple-100">Your gateway to academic excellence</p>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Why Choose Exam Portal?</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <TrophyIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Interactive Tests</h3>
                    <p className="text-purple-100 text-sm">
                      Take timed assessments with instant results and detailed solutions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <GraphIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Progress Tracking</h3>
                    <p className="text-purple-100 text-sm">
                      Monitor your performance with detailed analytics and progress charts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Class-Specific Content</h3>
                    <p className="text-purple-100 text-sm">Content tailored for 7th, 8th, and 9th grade students.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 cta-gradient rounded-2xl mb-4 shadow-lg">
                <GraduationHat className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Exam Portal
              </h1>
              <p className="text-gray-600 mt-2">Your gateway to academic excellence</p>
            </div>

            {/* Card Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20 p-8">
              {/* Tab Switcher */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                <button
                  type="button"
                  className={clsx(
                    "flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300",
                    isLogin ? "cta-gradient text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  )}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={clsx(
                    "flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300",
                    !isLogin ? "cta-gradient text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  )}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>

              {!showForgotPassword ? (
                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                  {/* Username Field (Register only) */}
                  {!isLogin && (
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
                  )}

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

                  {/* Class Selection (Login only) */}
                  {isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Class</label>
                      <div className="relative">
                        <select
                          className="w-full px-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
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
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <DownArrow className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )}

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
                    {isLogin && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
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
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </div>
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setForgotPasswordEmail("")
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      value={forgotPasswordEmail}
                      onChange={e => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full py-3 px-4 cta-gradient text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {forgotPasswordLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Email"
                    )}
                  </button>
                </form>
              )}

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    disabled={isLoading}
                    className="text-gray-900 hover:text-gray-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
