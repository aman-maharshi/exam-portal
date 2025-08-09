import React from "react"
import { useNavigate } from "react-router-dom"
import CheckCircleIcon from "../assets/check-circle.svg?react"
import HomeIcon from "../assets/home.svg?react"
import RefreshIcon from "../assets/refresh.svg?react"

const PracticeCompletion = ({ practiceSession, getScorePercentage, resetSession }) => {
  const navigate = useNavigate()

  return (
    <div className="p-4">
      {/* Title */}
      <h3 className="text-2xl font-light text-slate-800 text-center mb-8">Practice Complete</h3>

      {/* Score Display */}
      <div className="max-w-sm mx-auto mb-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="text-center">
            <div className="flex items-baseline justify-center space-x-2 mb-3">
              <span className="text-5xl font-light text-slate-800">{practiceSession.score}</span>
              <span className="text-xl text-slate-400">/ {practiceSession.totalQuestions}</span>
            </div>
            <div className="text-sm text-slate-500 font-medium mb-4">Questions Correct</div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div
                className="h-2 bg-slate-800 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${getScorePercentage()}%` }}
              />
            </div>

            <div className="text-2xl font-light text-slate-800">{getScorePercentage()}%</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        <button
          onClick={resetSession}
          className="flex-1 px-6 py-3.5 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all duration-200 font-medium text-sm"
        >
          <RefreshIcon className="w-4 h-4 inline mr-2" />
          Practice Again
        </button>
        <button
          onClick={() => navigate("/home")}
          className="flex-1 px-6 py-3.5 bg-slate-50 text-slate-700 rounded-2xl hover:bg-slate-100 transition-all duration-200 font-medium text-sm border border-slate-200"
        >
          <HomeIcon className="w-4 h-4 inline mr-2" />
          Back Home
        </button>
      </div>
    </div>
  )
}

export default PracticeCompletion
