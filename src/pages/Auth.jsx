import React, { useState } from "react"
import clsx from "clsx"

// ICONS
import GraduationHatIcon from "../assets/graduation-hat.svg?react"

// COMPONENTS
import SignIn from "../components/auth/SignIn"
import SignUp from "../components/auth/SignUp"
import ForgotPassword from "../components/auth/ForgotPassword"
import Hero from "../components/auth/Hero"
import DemoCredentials from "../components/DemoCredentials"

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSwitchToSignUp = () => {
    setIsLogin(false)
    setShowForgotPassword(false)
  }

  const handleSwitchToSignIn = () => {
    setIsLogin(true)
    setShowForgotPassword(false)
  }

  const handleSwitchToForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackToSignIn = () => {
    setShowForgotPassword(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Column - Introduction */}
        <Hero />

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 cta-gradient rounded-2xl mb-4 shadow-lg">
                <GraduationHatIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Exam Portal
              </h1>
              <p className="text-gray-600 mt-2">Your gateway to academic excellence</p>
            </div>

            {/* Card Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20 p-8">
              {/* Tab Switcher - Only show when not in forgot password mode */}
              {!showForgotPassword && (
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                  <button
                    type="button"
                    className={clsx(
                      "flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300",
                      isLogin ? "cta-gradient text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={handleSwitchToSignIn}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300",
                      !isLogin ? "cta-gradient text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={handleSwitchToSignUp}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Render appropriate component based on state */}
              {showForgotPassword ? (
                <ForgotPassword onBackToSignIn={handleBackToSignIn} />
              ) : isLogin ? (
                <SignIn
                  onSwitchToSignUp={handleSwitchToSignUp}
                  onSwitchToForgotPassword={handleSwitchToForgotPassword}
                />
              ) : (
                <SignUp onSwitchToSignIn={handleSwitchToSignIn} />
              )}
            </div>

            {/* <DemoCredentials /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
