import React, { useState, useContext } from 'react'
import GlobalContext from "../GlobalContext"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { defaultPassword } from "../utils/apiConstants"
import clsx from 'clsx'
import DownArrow from "../assets/down-arrow.svg?react"

const Login = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [grade, setGrade] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (username && password) {
      if (password !== defaultPassword) {
        // alert('Incorrect Password!')
        toast('Incorrect Password!', {
          position: "top-center",
          type: "error",
          limit: 1,
          autoClose: 5000,
        })
        return
      }

      setUserData({
        username,
        password,
        grade,
        loggedIn: true,
        results: []
      })
      navigate('/home')
    }
  }

  return (
    <div className='w-full min-h-screen bg-gradient text-[#1b1b1b]'>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-white p-10 rounded-xl card-shadow flex flex-col w-[450px]'>
          <h2 className='text-3xl font-bold text-center mb-2'>Exam Portal</h2>
          <p className='mb-6 text-center text-gray-500'>Please enter your details below to start your test</p>

          <input
            type="text"
            placeholder='Enter your Name'
            className='border p-2 rounded-lg mb-4'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* <input
            type="email"
            placeholder='Enter your Email'
            className='border p-2 rounded-lg mb-4'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}

          <div className='border p-2 rounded-lg overflow-hidden mb-4 flex items-center justify-between'>
            <select
              className={clsx(
                'appearance-none outline-none flex-1 cursor-pointer',
                grade ? 'text-black' : 'text-gray-400'
              )}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="" disabled>Select your class</option>
              <option value="7th">7th</option>
              <option value="8th">8th</option>
            </select>
            <DownArrow className="h-5 w-5" />
          </div>

          <input
            type="password"
            placeholder='Enter Password'
            className='border p-2 rounded-lg mb-4'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className='p-2 mt-4 rounded-lg text-white transition-all duration-300 card-gradient'
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login