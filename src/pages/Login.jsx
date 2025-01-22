import React, { useState, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import { useNavigate } from 'react-router-dom'

import { defaultPassword } from "../utils/apiConstants"

const Login = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = () => {
    if (username && email && password) {
      if (password !== defaultPassword) {
        alert('Incorrect Password!')
        return
      }

      setUserData({ username, email, password })
      navigate('/home')
    }
  }

  return (
    <Layout>
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

          <input
            type="email"
            placeholder='Enter your Email'
            className='border p-2 rounded-lg mb-4'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder='Enter Password'
            className='border p-2 rounded-lg mb-4'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className='p-2 mt-4 rounded-lg text-white transition-all duration-300 bg-[#3d6eff]'
          >
            Login
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Login