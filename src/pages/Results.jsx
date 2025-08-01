import { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import clsx from "clsx"
import GlobalContext from "../GlobalContext"
import CircleCheckIcon from "../assets/check-circle.svg?react"
import { databaseService } from "../services/databaseService"
import { toast } from "react-toastify"

// COMPONENTS
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

const Results = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const [results, setResults] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResults = async () => {
      if (!userData?.uid) {
        toast.error("User not authenticated")
        return
      }

      setLoading(true)
      try {
        const result = await databaseService.getUserResults(userData.uid)

        if (result.success) {
          setResults(result.results)
          setUserStats(result.userStats)

          // Update local user data with fresh results
          setUserData(prev => ({
            ...prev,
            results: result.results
          }))
        } else {
          console.error("Failed to load results:", result.error)
          toast.error("Failed to load results")

          // Fallback to local results
          setResults(userData.results || [])
        }
      } catch (error) {
        console.error("Error loading results:", error)
        toast.error("Error loading results")

        // Fallback to local results
        setResults(userData.results || [])
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [userData?.uid])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userData?.uid) return

    const unsubscribe = databaseService.subscribeToUserData(userData.uid, data => {
      if (data.success && data.user.results) {
        setResults(data.user.results)
        setUserStats({
          totalTestsTaken: data.user.totalTestsTaken || 0,
          averageScore: data.user.averageScore || 0,
          lastTestDate: data.user.results[0]?.submittedAt || null
        })

        // Update local user data
        setUserData(prev => ({
          ...prev,
          results: data.user.results
        }))
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [userData?.uid])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen modern-bg w-full flex">
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 rounded-xl p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto">
              <Topbar userData={userData} />
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your results...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen modern-bg w-full flex">
        <div className="flex flex-1">
          <Sidebar />

          <div className="flex-1 rounded-xl p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto">
            <Topbar userData={userData} />

            <div className="mt-6 mb-4">
              <h3 className="text-xl font-bold">Your Statistics</h3>
            </div>

            {/* User Stats */}
            {userStats && (
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tests Taken */}
                  <div className="bg-blue-50 p-6 rounded-xl text-gray-800 shadow-md border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">{userStats.totalTestsTaken}</div>
                        <div className="text-gray-600 text-sm font-medium">Tests Taken</div>
                      </div>
                    </div>
                  </div>

                  {/* Average Score */}
                  <div className="bg-green-50 p-6 rounded-xl text-gray-800 shadow-md border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">{userStats.averageScore}%</div>
                        <div className="text-gray-600 text-sm font-medium">Average Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Last Test Date */}
                  <div className="bg-purple-50 p-6 rounded-xl text-gray-800 shadow-md border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">
                          {userStats.lastTestDate
                            ? (() => {
                                const date = new Date(userStats.lastTestDate)
                                const now = new Date()
                                const diffTime = Math.abs(now - date)
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                                if (diffDays === 1) return "Yesterday"
                                if (diffDays === 0) return "Today"
                                if (diffDays < 7) return `${diffDays} days ago`
                                if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
                                return date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
                                })
                              })()
                            : "N/A"}
                        </div>
                        <div className="text-gray-600 text-sm font-medium">Last Test</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-bold">Available Results</h3>

              {results?.map((result, index) => {
                const resultPercentage = parseInt((result?.totalMarks / result?.totalQuestions) * 100)
                let textColor =
                  resultPercentage >= 75
                    ? "text-green-600"
                    : resultPercentage >= 50
                    ? "text-yellow-600"
                    : "text-red-600"

                return (
                  <div
                    key={index}
                    className="bg-white border p-4 rounded-xl my-4 flex flex-col md:flex-row justify-between md:items-center gap-4"
                  >
                    <div className="flex items-center gap-3 lg:gap-4 sm:w-[350px]">
                      <div className="font-medium text-base lg:text-lg">{result?.topic}</div>
                      <div
                        className={clsx(
                          "text-sm px-3 py-0.5 rounded-full",
                          result?.difficulty === "Easy" && "bg-green-100 text-green-600",
                          result?.difficulty === "Moderate" && "bg-yellow-100 text-yellow-600"
                        )}
                      >
                        {result?.difficulty}
                      </div>
                      {result?.class && (
                        <div className="text-sm px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{result.class}</div>
                      )}
                    </div>

                    <Link
                      to={`/solution/${result?.testId}`}
                      className="cta-gradient text-white font-bold py-2 px-2 sm:px-4 rounded-lg text-center"
                    >
                      View Solutions
                    </Link>

                    <div className="flex items-end justify-end gap-4">
                      <span className="text-sm text-gray-500 font-medium">you scored</span>
                      <div className="font-bold text-4xl">
                        <span className={textColor}>{result?.totalMarks}</span>
                        <span className="text-2xl text-black"> / {result?.totalQuestions}</span>
                      </div>
                      <div className="text-gray-600 text-base pb-0.5 font-medium">{resultPercentage}%</div>
                    </div>

                    {result?.submittedAt && (
                      <div className="text-xs text-gray-500 mt-2 md:mt-0">
                        {(() => {
                          const date = new Date(result.submittedAt)
                          const now = new Date()
                          const diffTime = Math.abs(now - date)
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                          if (diffDays === 0) return "Today"
                          if (diffDays === 1) return "Yesterday"
                          if (diffDays < 7) return `${diffDays} days ago`
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
                          })
                        })()}
                      </div>
                    )}
                  </div>
                )
              })}

              {results?.length === 0 && (
                <div>
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-xl">No results available</p>
                    <p className="text-base">You haven't attempted any tests yet</p>
                    <Link to="/home" className="mt-4 inline-block cta-gradient text-white py-2 px-4 rounded-lg">
                      Take Your First Test
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Results
