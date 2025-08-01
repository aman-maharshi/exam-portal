import React from "react"

const UserStats = ({ userStats }) => {
  if (!userStats) return null

  return (
    <>
      <div className="mt-6 mb-4">
        <h3 className="text-xl font-bold">Your Statistics</h3>
      </div>
      <div className="bg-white p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tests Taken */}
          <div className="bg-blue-50 p-4 rounded-xl text-gray-800 border border-blue-200">
            <div className="flex items-center justify-between">
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
          <div className="bg-green-50 p-4 rounded-xl text-gray-800 border border-green-200">
            <div className="flex items-center justify-between">
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
          <div className="bg-purple-50 p-4 rounded-xl text-gray-800 border border-purple-200">
            <div className="flex items-center justify-between">
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
    </>
  )
}

export default UserStats
