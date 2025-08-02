import React, { useState } from "react"
import clsx from "clsx"

// ICONS
import GraduationHat from "../assets/graduation-hat.svg?react"
import TrophyIcon from "../assets/trophy.svg?react"
import GraphIcon from "../assets/graph.svg?react"
import CheckIcon from "../assets/check.svg?react"

// COMPONENTS
import SignIn from "../components/auth/SignIn"
import SignUp from "../components/auth/SignUp"
import ForgotPassword from "../components/auth/ForgotPassword"
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
              {/* Tab Switcher - Only show when not in forgot password mode */}
              {/* {!showForgotPassword && (
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
              )} */}

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

            <DemoCredentials />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
