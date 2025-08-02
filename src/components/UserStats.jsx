import React from "react"

const UserStats = ({ userStats, results }) => {
  if (!userStats) return null

  // Calculate best score
  const bestScore =
    results && results.length > 0
      ? Math.max(...results.map(r => Math.round((r.totalMarks / r.totalQuestions) * 100)))
      : 0

  // Calculate last test date
  const getLastTestDate = date => {
    if (!date) return "N/A"

    const testDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now - testDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays === 0) return "Today"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return testDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: testDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    })
  }

  const lastTestDate = getLastTestDate(userStats.lastTestDate)

  return (
    <>
      <div className="mt-6 mb-4">
        <h3 className="text-lg font-bold text-gray-900">Your Statistics</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Best Score */}
        <div className="bg-white rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Best Score</p>
            <p className="text-3xl font-bold text-gray-900">{bestScore}%</p>
          </div>
        </div>

        {/* Last Test Date */}
        <div className="bg-white rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Last Test Taken</p>
            <p className="text-lg font-bold text-gray-900">{lastTestDate}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserStats
