import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GlobalContext from './GlobalContext'
import Results from './pages/Results'
import { ToastContainer } from 'react-toastify';

// COMPONENTS
import Home from './pages/Home'
import Login from './pages/Login'
import Instructions from './pages/Instructions'
import Result from './pages/Result'
import Test from './pages/Test'

const App = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))

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
          <Route path="/instructions/:testId" element={<Instructions />} />
          <Route path="/test/:testId" element={<Test />} />
          <Route path="/result/:testId" element={<Result />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer limit={3} />
    </GlobalContext.Provider >
  )
}

export default App