import React, { useState } from "react"
import { toast } from "react-toastify"
import { authService } from "../../services/authService"

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

    setForgotPasswordLoading(true)
    try {
      const result = await authService.forgotPassword(forgotPasswordEmail)

      if (result.success) {
        showToast("If an account with this email exists, a password reset link has been sent.", { type: "success" })
        onBackToSignIn()
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
  )
}

export default ForgotPassword
