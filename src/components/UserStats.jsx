import React from "react"

const UserStats = ({ userStats }) => {
  if (!userStats) return null

  return (
    <>
      <div className="mt-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900">Your Statistics</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tests Taken */}
        <div className="bg-white rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Tests Taken</p>
            <p className="text-3xl font-bold text-gray-900">{userStats.totalTestsTaken}</p>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
            <p className="text-3xl font-bold text-gray-900">{userStats.averageScore}%</p>
          </div>
        </div>

        {/* Last Test Date */}
        <div className="bg-white rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Last Test</p>
            <p className="text-lg font-bold text-gray-900">
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
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserStats
