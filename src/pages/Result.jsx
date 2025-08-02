import { useEffect, useContext, useState } from "react"
import Layout from "../Layout"
import GlobalContext from "../GlobalContext"
import CheckIcon from "../assets/check.svg?react"
import { useNavigate, useParams } from "react-router-dom"
import { data } from "../data"
import { databaseService } from "../services/databaseService"
import { toast } from "react-toastify"

// ICONS
import NotesIcon from "../assets/notes.svg?react"
import HomeIcon from "../assets/home.svg?react"

import { useWindowSize } from "react-use"
import Confetti from "react-confetti"

const Result = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const { width, height } = useWindowSize()
  const navigate = useNavigate()
  const { testId } = useParams()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const test = data.find(test => test.id === parseInt(testId))

  useEffect(() => {
    const loadResult = async () => {
      if (!userData?.uid) {
        toast.error("User not authenticated")
        navigate("/")
        return
      }

      setLoading(true)
      try {
        // Try to get result from database first
        const dbResult = await databaseService.getTestResult(userData.uid, testId)

        if (dbResult.success) {
          setResult(dbResult.result)
        } else {
          // Fallback to local result
          const localResult = userData.results.find(result => result.testId === parseInt(testId))
          if (localResult) {
            setResult(localResult)
          } else {
            toast.error("Result not found")
            navigate("/home")
          }
        }
      } catch (error) {
        console.error("Error loading result:", error)
        // Fallback to local result
        const localResult = userData.results.find(result => result.testId === parseInt(testId))
        if (localResult) {
          setResult(localResult)
        } else {
          toast.error("Failed to load result")
          navigate("/home")
        }
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [testId, userData?.uid])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading your result...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!result) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <NotesIcon className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Result Not Found</h3>
              <p className="text-slate-600 mb-6">We couldn't find the result you're looking for.</p>
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const resultPercentage = parseInt((result?.totalMarks / result?.totalQuestions) * 100)
  const isHighScore = resultPercentage >= 75
  const isAverageScore = resultPercentage >= 50

  const getScoreColor = () => {
    if (isHighScore) return "from-emerald-500 to-green-600"
    if (isAverageScore) return "from-amber-500 to-orange-600"
    return "from-red-500 to-pink-600"
  }

  const getScoreMessage = () => {
    if (isHighScore) return "Outstanding Performance!"
    if (isAverageScore) return "Good Work!"
    return "Keep Learning!"
  }

  const getScoreEmoji = () => {
    if (isHighScore) return "🎉"
    if (isAverageScore) return "👍"
    return "📚"
  }

  return (
    <Layout>
      {isHighScore && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Test Results</h1>
            <p className="text-slate-600">Here's how you performed</p>
          </div>

          {/* Main Result Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-6">
            {/* Score Display */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full mb-4">
                <span className="text-3xl">{getScoreEmoji()}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-2">{getScoreMessage()}</h2>
              <p className="text-slate-600 mb-4 text-sm">
                You got <span className="font-semibold text-slate-800">{result?.totalMarks}</span> out of{" "}
                <span className="font-semibold text-slate-800">{result?.totalQuestions}</span> questions correct
              </p>

              {/* Percentage Circle */}
              <div className="relative inline-flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${getScoreColor()} flex items-center justify-center`}
                  >
                    <span className="text-2xl font-bold text-white">{resultPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-slate-500 mb-1">Topic</p>
                <p className="font-semibold text-slate-800 text-sm">{result.topic}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs font-medium text-slate-500 mb-1">Difficulty</p>
                <p className="font-semibold text-slate-800 text-sm">{result.difficulty}</p>
              </div>
              {result.class && (
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs font-medium text-slate-500 mb-1">Class</p>
                  <p className="font-semibold text-slate-800 text-sm">{result.class}</p>
                </div>
              )}
            </div>

            {/* Submission Time */}
            {result.submittedAt && (
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  {new Date(result.submittedAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}{" "}
                  at{" "}
                  {new Date(result.submittedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/solution/${testId}`)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all duration-200 hover:shadow-lg"
            >
              <NotesIcon className="w-4 h-4 mr-2" />
              View Solutions
            </button>
            <button
              onClick={() => navigate(`/home`)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-white text-slate-800 border-2 border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200 hover:shadow-lg"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Result
