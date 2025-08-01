import React, { useState, useContext } from "react"
import GlobalContext from "../GlobalContext"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { defaultPassword } from "../utils/apiConstants"
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
  const [grade, setGrade] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordCopied, setIsPasswordCopied] = useState(false)
  const navigate = useNavigate()
  const testUserPassword = import.meta.env.VITE_DEFAULT_PASSWORD

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(testUserPassword)
      setIsPasswordCopied(true)
      setTimeout(() => setIsPasswordCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy password:", error)
    }
  }

  const handleLogin = e => {
    e?.preventDefault()

    if (role !== "student") {
      return showToast("Unauthorized")
    }

    if (!username || !grade || !password) {
      return showToast("All fields are required")
    }

    if (password !== defaultPassword) {
      return showToast("Incorrect Password!")
    }

    setUserData({ username, password, grade, role, loggedIn: true, results: [] })
    navigate("/home")
  }

  const showToast = message => {
    toast(message, {
      position: "top-center",
      type: "error",
      limit: 1,
      autoClose: 5000
    })
  }

  return (
    <div className="w-full min-h-screen bg-neutral-100 text-[#1b1b1b]">
      <div className="min-h-screen flex flex-col gap-10 items-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-xl card-shadow flex flex-col w-full sm:w-[450px] mt-24"
        >
          <div className="flex justify-center mb-6">
            <button
              type="button"
              className={clsx(
                "py-2 px-4 rounded-l-lg transition-all font-medium duration-300 outline-none",
                role === "student" ? "cta-gradient text-white" : "bg-gray-200 text-black"
              )}
              onClick={() => setRole("student")}
            >
              Student Login
            </button>
            <button
              type="button"
              className={clsx(
                "py-2 px-4 rounded-r-lg transition-all font-medium duration-300 outline-none",
                role === "teacher" ? "cta-gradient text-white" : "bg-gray-200 text-black"
              )}
              onClick={() => setRole("teacher")}
            >
              Teacher Login
            </button>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 mt-4">Exam Portal</h2>
          <p className="mb-6 text-center text-gray-500">Please enter your details below to start your test</p>

          <input
            type="text"
            placeholder="Enter your Name"
            className="border p-2 rounded-lg mb-4"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          {role === "student" && (
            <div className="border p-2 rounded-lg overflow-hidden mb-4 flex items-center justify-between">
              <select
                className={clsx(
                  "appearance-none outline-none flex-1 cursor-pointer bg-transparent",
                  grade ? "text-black" : "text-gray-400"
                )}
                value={grade}
                onChange={e => setGrade(e.target.value)}
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
            Login
          </button>
        </form>

        {role === "student" && (
          <div className="p-4 w-[280px] bg-gradient-to-r from-neutral-50 to-gray-50 border border-neutral-200 rounded-xl shadow-sm flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <UserInfo className="h-5 w-5 text-neutral-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-neutral-900 mb-1">Demo Password</div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-neutral-700 font-mono bg-neutral-100 px-2 py-1 rounded-md flex-1">
                  {testUserPassword}
                </div>
                <button
                  onClick={handleCopyPassword}
                  className="p-1.5 bg-neutral-100 rounded-md transition-colors"
                  title={isPasswordCopied ? "Password copied!" : "Copy password"}
                >
                  {isPasswordCopied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-neutral-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
