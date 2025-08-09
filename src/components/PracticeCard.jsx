import React from "react"
import LightningIcon from "../assets/lightning.svg?react"
import ChevronRightIcon from "../assets/chevron-right.svg?react"

const PracticeCard = ({ topic, onCardClick }) => {
  const totalQuestions = topic.tests.reduce((acc, test) => acc + test.questionsList.length, 0)
  const cardColor = "from-blue-500 to-cyan-500"

  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-50"
      onClick={() => onCardClick(topic.name)}
    >
      <div className="p-5">
        {/* Header with topic name and question count */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">{totalQuestions}</div>
            <div className="text-xs text-gray-400">Questions</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center text-sm text-gray-500">
            <LightningIcon className="w-3.5 h-3.5 mr-2 text-blue-400" />
            {topic.tests.length} test{topic.tests.length !== 1 ? "s" : ""} available
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <LightningIcon className="w-3.5 h-3.5 mr-2 text-green-400" />
            Instant feedback
          </div>
        </div>

        {/* Action area */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Start Practice</span>
          <div className="w-8 h-8 cta-gradient rounded-full flex items-center justify-center transition-all duration-200">
            <ChevronRightIcon className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeCard
