import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import GlobalContext from "./GlobalContext"
import Results from "./pages/Results"
import { ToastContainer } from "react-toastify"
import { authService } from "./services/authService"

// COMPONENTS
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import Instructions from "./pages/Instructions"
import Result from "./pages/Result"
import Test from "./pages/Test"
import Solution from "./pages/Solution"
import StudyMaterials from "./pages/StudyMaterials"
import YourProgress from "./pages/YourProgress"
import Profile from "./pages/Profile"
import Practice from "./pages/Practice"

const App = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("userData")))

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChange(user => {
      if (user) {
        // User is signed in
        setUserData(prev => ({ ...prev, uid: user.uid, loggedIn: true }))
      } else {
        // User is signed out
        setUserData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData))
    } else {
      localStorage.removeItem("userData")
    }
  }, [userData])

  const contextObject = { userData, setUserData }

  return (
    <GlobalContext.Provider value={contextObject}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/practice" element={<Practice />} /> */}
          <Route path="/results" element={<Results />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/your-progress" element={<YourProgress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/instructions/:testId" element={<Instructions />} />
          <Route path="/test/:testId" element={<Test />} />
          <Route path="/result/:testId" element={<Result />} />
          <Route path="/solution/:testId" element={<Solution />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer limit={3} />
    </GlobalContext.Provider>
  )
}

export default App
