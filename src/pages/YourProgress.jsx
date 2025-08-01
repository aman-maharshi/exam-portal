import React, { useContext, useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList, CartesianGrid } from "recharts"
import GlobalContext from "../GlobalContext"
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

const difficultyColors = {
  Easy: "#10b981", // Modern emerald green
  Moderate: "#3b82f6", // Modern blue
  Hard: "#ef4444" // Modern red
}

const YourProgress = () => {
  const { userData } = useContext(GlobalContext)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (userData?.results) {
      const updatedData = userData?.results.map(item => ({
        ...item,
        percentage: Math.round((Number(item?.totalMarks) / Number(item?.totalQuestions)) * 100)
      }))
      setResults(updatedData)
    }
  }, [userData?.results])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload
      return (
        <div className="bg-white p-3 border rounded shadow-lg text-base min-w-[160px]">
          <div className="font-semibold text-indigo-700 mb-1">{data.topic}</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg">{data.percentage}%</span>
            <span className="text-xs text-gray-500">
              ({data.totalMarks}/{data.totalQuestions})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: difficultyColors[data.difficulty] }}
            ></span>
            <span className="text-sm text-gray-700">{data.difficulty}</span>
          </div>
        </div>
      )
    }
    return null
  }

  // Sort results by topic for better readability
  const sortedResults = [...results].sort((a, b) => a.topic.localeCompare(b.topic))

  // Custom Bar to color by difficulty and add a subtle shadow
  const CustomBar = props => {
    const { x, y, width, height, payload } = props
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={difficultyColors[payload.difficulty] || "#4F46E5"}
          rx={8}
          ry={8}
          style={{
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))"
          }}
        />
      </g>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen modern-bg w-full flex">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 rounded-lg p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto">
            <Topbar userData={userData} />
            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-2 text-black">Your Progress</h3>
              {sortedResults?.length > 1 ? (
                <div className="w-full max-w-3xl p-2 sm:p-4 mt-10 bg-white rounded-lg shadow-lg">
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={sortedResults} barSize={38}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="topic" tick={{ fontSize: 14, fill: "gray" }} axisLine={false} tickLine={false} />
                      <YAxis
                        label={{
                          value: "Percentage",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: 14, fill: "gray" }
                        }}
                        tick={{ fontSize: 13, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ top: 0, right: 20, fontSize: 14 }}
                        payload={[
                          { value: "Easy", type: "circle", color: difficultyColors.Easy },
                          { value: "Moderate", type: "circle", color: difficultyColors.Moderate },
                          { value: "Hard", type: "circle", color: difficultyColors.Hard }
                        ]}
                      />
                      <Bar dataKey="percentage" shape={<CustomBar />} isAnimationActive={true} radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="percentage" position="top" fill="#334155" fontWeight={700} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-4 justify-center">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ background: difficultyColors.Easy }}
                      ></span>
                      Easy
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ background: difficultyColors.Moderate }}
                      ></span>
                      Moderate
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ background: difficultyColors.Hard }}
                      ></span>
                      Hard
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-xl">No progress data available</p>
                    <p className="text-base">You need to take at least 2 tests to view your progress graph</p>
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

export default YourProgress
