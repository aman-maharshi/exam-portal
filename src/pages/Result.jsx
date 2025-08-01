import { useEffect, useContext, useState } from "react"
import Layout from "../Layout"
import GlobalContext from "../GlobalContext"
import CheckIcon from "../assets/check.svg?react"
import { useNavigate, useParams } from "react-router-dom"
import { data } from "../data"
import { databaseService } from "../services/databaseService"
import { toast } from "react-toastify"

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
        <div className="min-h-screen bg-[#ecf2f9] w-full p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your result...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!result) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#ecf2f9] w-full p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Result not found</p>
            <button onClick={() => navigate("/home")} className="mt-4 cta-gradient py-2 px-4 rounded-lg text-white">
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const resultPercentage = parseInt((result?.totalMarks / result?.totalQuestions) * 100)
  const isHighScore = resultPercentage >= 75
  const isAverageScore = resultPercentage >= 50

  return (
    <Layout>
      {isHighScore && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      <div className="min-h-screen bg-[#ecf2f9] w-full p-6">
        <div className="bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10">
          <h2 className="text-4xl font-bold text-center mt-4">Your Result</h2>

          <div className="flex items-center gap-4 justify-center mt-4 flex-wrap">
            <div className="bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium">
              Topic: {result.topic}
            </div>
            <div className="bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium">
              Difficulty: {result.difficulty}
            </div>
            {result.class && (
              <div className="bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium">
                Class: {result.class}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center mt-10">
            <div>
              {isHighScore ? (
                <span role="img" aria-label="excellent" className="text-6xl">
                  🎉
                </span>
              ) : isAverageScore ? (
                <span role="img" aria-label="good" className="text-6xl">
                  😊
                </span>
              ) : (
                <span role="img" aria-label="needs improvement" className="text-6xl">
                  📚
                </span>
              )}
            </div>

            <p className="my-4 text-lg">
              You got {result?.totalMarks} out of {result?.totalQuestions} questions correct
            </p>

            <div
              className={`p-6 max-w-xs rounded-xl border ${
                isHighScore
                  ? "bg-green-50 border-green-200"
                  : isAverageScore
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="space-y-2">
                <p
                  className={`text-6xl font-bold ${
                    isHighScore ? "text-green-600" : isAverageScore ? "text-yellow-600" : "text-red-600"
                  }`}
                >
                  {resultPercentage}%
                </p>
                <p className="text-sm text-gray-600">
                  {isHighScore
                    ? "Excellent! Keep up the great work!"
                    : isAverageScore
                    ? "Good job! You can do even better!"
                    : "Keep practicing! You'll improve with time!"}
                </p>
              </div>
            </div>

            {result.submittedAt && (
              <div className="mt-4 text-sm text-gray-500">
                Submitted on: {new Date(result.submittedAt).toLocaleDateString()} at{" "}
                {new Date(result.submittedAt).toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => navigate(`/solution/${testId}`)}
              className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded-lg text-white transition-colors"
            >
              View Solutions
            </button>
            <button
              onClick={() => navigate(`/home`)}
              className="cta-gradient py-2 px-6 rounded-lg text-white transition-all duration-300 hover:opacity-90"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Result
