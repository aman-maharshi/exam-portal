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

            {/* User Stats */}
            <UserStats userStats={userStats} />

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
