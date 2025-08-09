import React, { useState, useEffect } from "react"

import CheckIcon from "../assets/check.svg?react"
import CrossIcon from "../assets/close.svg?react"

const PracticeQuestion = ({ question, onAnswerSubmit, questionNumber, totalQuestions }) => {
  const { questionText, questionImage, imageWidth, options, answer, solution } = question
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [countdown, setCountdown] = useState(7)

  const handleOptionSelect = option => {
    if (showFeedback) return // Prevent changing answer after submission

    setSelectedAnswer(option)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === answer
    setIsCorrect(correct)
    setShowFeedback(true)
    setCountdown(7)

    // Call parent handler
    onAnswerSubmit(selectedAnswer)
  }

  // Countdown effect
  useEffect(() => {
    let timer
    if (showFeedback && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [showFeedback, countdown])

  const getFeedbackColor = () => {
    if (!showFeedback) return ""
    return isCorrect ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"
  }

  const getFeedbackIcon = () => {
    if (!showFeedback) return null
    return isCorrect ? <CheckIcon className="w-6 h-6 text-green-600" /> : <CrossIcon className="w-6 h-6 text-red-600" />
  }

  return (
    <div
      className={`border border-gray-100 rounded-xl p-6 transition-all duration-300 ${getFeedbackColor()} bg-white shadow-sm relative`}
    >
      {/* Auto-advance indicator */}
      {showFeedback && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg border border-white">
            <div className="inline-flex items-center font-medium">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2.5"></div>
              <span className="text-sm font-semibold">
                Next question in <span className="font-bold">{countdown}</span> second
                {countdown !== 1 ? "s" : ""}...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Question Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{questionNumber}</span>
          </div>
          <div className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>
        {showFeedback && (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCorrect ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <div className="text-xl">{getFeedbackIcon()}</div>
          </div>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-relaxed">{questionText}</h3>

        {/* Question Image */}
        {questionImage && (
          <div className="mb-5">
            <div className="relative group">
              <img
                src={`/questions/${questionImage}`}
                alt={questionImage}
                className="max-w-full h-auto object-contain rounded-xl border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                style={{ maxWidth: imageWidth || "100%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrectAnswer = option === answer

          let optionStyle = "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
          let radioStyle = "border-gray-300"
          let textStyle = "text-gray-900"

          if (showFeedback) {
            if (isCorrectAnswer) {
              // Correct answer always shows green
              optionStyle = "border-green-400 bg-green-50"
              radioStyle = "border-green-500 bg-green-500"
              textStyle = "text-green-900 font-medium"
            } else if (isSelected && !isCorrect) {
              // Wrong selected answer shows red
              optionStyle = "border-red-400 bg-red-50"
              radioStyle = "border-red-500 bg-red-500"
              textStyle = "text-red-900 font-medium"
            }
          } else if (isSelected) {
            // Normal selection state
            optionStyle = "border-blue-400 bg-blue-50"
            radioStyle = "border-blue-500 bg-blue-500"
            textStyle = "text-blue-900 font-medium"
          }

          return (
            <div
              key={index}
              className={`p-4 border rounded-lg transition-all duration-200 ${optionStyle} ${
                showFeedback ? "cursor-default" : "cursor-pointer"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${radioStyle}`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <span className={`text-base ${textStyle}`}>{option}</span>
                {showFeedback && isCorrectAnswer && (
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-green-600 font-medium text-sm">Correct</span>
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div
          className={`p-5 rounded-xl mb-6 border ${
            isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <div className="text-xl">{getFeedbackIcon()}</div>
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-semibold mb-3 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? "Excellent! That's correct!" : "Not quite right, but keep learning!"}
              </h4>
              {!isCorrect && (
                <div className="mb-4 p-3 bg-white rounded-lg border border-red-100">
                  <p className="text-red-700 mb-2 text-sm">
                    <span className="font-medium">Your Answer:</span> {selectedAnswer}
                  </p>
                  <p className="text-red-700 text-sm">
                    <span className="font-medium">Correct Answer:</span> {answer}
                  </p>
                </div>
              )}
              {solution && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Explanation</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{solution}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {!showFeedback && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={`px-8 py-3 rounded-lg font-medium text-base transition-all duration-200 ${
              selectedAnswer
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedAnswer ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Submit Answer
              </div>
            ) : (
              "Select an answer to continue"
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default PracticeQuestion
