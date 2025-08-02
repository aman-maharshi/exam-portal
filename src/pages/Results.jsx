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
import UserStats from "../components/UserStats"

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
            <div className="flex-1 rounded-lg p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto">
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
        <div className="flex flex-1 min-w-0">
          <Sidebar />

          <div className="flex-1 rounded-lg p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto min-w-0">
            <Topbar userData={userData} />

            {/* User Stats */}
            <UserStats userStats={userStats} results={results} />

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Available Results</h3>

              {results?.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Table Container with Horizontal Scroll */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px] w-full">
                      {/* Table Header */}
                      <div className="bg-gray-50 border-b rounded-t-lg border-gray-200 px-4 py-3">
                        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                          <div className="col-span-4 sm:col-span-3">Topic</div>
                          <div className="col-span-2">Difficulty</div>
                          <div className="col-span-2">Class</div>
                          <div className="col-span-2">Score</div>
                          <div className="hidden sm:block col-span-2">Date</div>
                          <div className="col-span-1">Actions</div>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-gray-200">
                        {results?.map((result, index) => {
                          const resultPercentage = parseInt((result?.totalMarks / result?.totalQuestions) * 100)
                          let textColor =
                            resultPercentage >= 75
                              ? "text-green-600"
                              : resultPercentage >= 50
                              ? "text-yellow-600"
                              : "text-red-600"

                          return (
                            <div key={index} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Topic */}
                                <div className="col-span-4 sm:col-span-3">
                                  <div className="font-medium text-gray-900 truncate">{result?.topic}</div>
                                </div>

                                {/* Difficulty */}
                                <div className="col-span-2">
                                  <div
                                    className={clsx(
                                      "text-sm px-3 py-1 rounded-full w-fit",
                                      result?.difficulty === "Easy" && "bg-green-100 text-green-600",
                                      result?.difficulty === "Moderate" && "bg-yellow-100 text-yellow-600",
                                      result?.difficulty === "Hard" && "bg-red-100 text-red-600"
                                    )}
                                  >
                                    {result?.difficulty}
                                  </div>
                                </div>

                                {/* Class */}
                                <div className="col-span-2">
                                  {result?.class ? (
                                    <div className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full w-fit">
                                      {result.class}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </div>

                                {/* Score */}
                                <div className="col-span-2">
                                  <div className="flex items-center gap-2">
                                    <div className="font-bold text-lg">
                                      <span className={textColor}>{result?.totalMarks}</span>
                                      <span className="text-gray-600"> / {result?.totalQuestions}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">({resultPercentage}%)</div>
                                  </div>
                                </div>

                                {/* Date */}
                                <div className="hidden sm:block col-span-2">
                                  {result?.submittedAt ? (
                                    <div className="text-sm text-gray-600">
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
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-1">
                                  <Link
                                    to={`/solution/${result?.testId}`}
                                    className="cta-gradient text-white font-bold py-2 px-3 rounded-lg text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                                  >
                                    Solutions
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {results?.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="text-gray-500">
                    <p className="text-xl mb-2">No results available</p>
                    <p className="text-base mb-4">You haven't attempted any tests yet</p>
                    <Link to="/home" className="cta-gradient text-white py-2 px-4 rounded-lg inline-block">
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
