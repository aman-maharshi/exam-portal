import React, { useState } from "react"
import { toast } from "react-toastify"
import { authService } from "../../services/authService"
import { rateLimiter } from "../../utils/rateLimiter"

// ICONS
import EmailAtIcon from "../../assets/email-at.svg?react"

const ForgotPassword = ({ onBackToSignIn }) => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)

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

    // Check rate limiting for forgot password
    if (rateLimiter.isRateLimited("forgotPassword")) {
      const timeRemaining = rateLimiter.formatTimeRemaining("forgotPassword")
      return showToast(`Too many password reset attempts. Please try again in ${timeRemaining}.`)
    }

    setForgotPasswordLoading(true)
    try {
      const result = await authService.forgotPassword(forgotPasswordEmail)

      // Record attempt regardless of success/failure for forgot password
      rateLimiter.recordAttempt("forgotPassword")

      if (result.success) {
        showToast("If an account with this email exists, a password reset link has been sent.", { type: "success" })
        onBackToSignIn()
        setForgotPasswordEmail("")
      } else {
        const remainingAttempts = rateLimiter.getRemainingAttempts("forgotPassword")

        if (remainingAttempts > 0) {
          showToast("Failed to send reset email. Please try again.")
        } else {
          const timeRemaining = rateLimiter.formatTimeRemaining("forgotPassword")
          showToast(`Too many password reset attempts. Please try again in ${timeRemaining}.`)
        }
      }
    } catch (error) {
      // Record failed attempt for network errors too
      rateLimiter.recordAttempt("forgotPassword")
      const remainingAttempts = rateLimiter.getRemainingAttempts("forgotPassword")

      if (remainingAttempts > 0) {
        showToast("Network error. Please check your connection and try again.")
      } else {
        const timeRemaining = rateLimiter.formatTimeRemaining("forgotPassword")
        showToast(`Too many password reset attempts. Please try again in ${timeRemaining}.`)
      }
    } finally {
      setForgotPasswordLoading(false)
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
    <form onSubmit={handleForgotPassword} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
        <button type="button" onClick={onBackToSignIn} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

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
            value={forgotPasswordEmail}
            onChange={e => setForgotPasswordEmail(e.target.value)}
            required
          />
        </div>
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
  )
}

export default ForgotPassword
