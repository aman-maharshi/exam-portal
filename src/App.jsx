import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalContext from './GlobalContext'
import Results from './pages/Results'
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {})

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData))
  }, [userData])

  const contextObject = { userData, setUserData }

  return (
    <GlobalContext.Provider value={contextObject}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer limit={3} />
    </GlobalContext.Provider >
  )
}

export default App