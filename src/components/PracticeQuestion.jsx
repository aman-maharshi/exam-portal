import React, { useState, useEffect } from "react"

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
    return isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
  }

  const getFeedbackIcon = () => {
    if (!showFeedback) return null
    return isCorrect ? "✅" : "❌"
  }

  return (
    <div className={`border-2 rounded-lg p-6 transition-all duration-300 ${getFeedbackColor()}`}>
      {/* Auto-advance indicator with countdown - MOVED TO TOP */}
      {showFeedback && (
        <div className="text-center mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="inline-flex items-center text-blue-700 font-medium">
            <div className="animate-pulse mr-2">⏱️</div>
            Next question in {countdown} second{countdown !== 1 ? "s" : ""}...
          </div>
        </div>
      )}

      {/* Question Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Question {questionNumber} of {totalQuestions}
        </div>
        {showFeedback && <div className="text-2xl">{getFeedbackIcon()}</div>}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{questionText}</h3>

        {/* Question Image */}
        {questionImage && (
          <div className="mb-4">
            <img
              src={`/questions/${questionImage}`}
              alt={questionImage}
              className="max-w-full h-auto object-contain rounded-lg border border-gray-200"
              style={{ maxWidth: imageWidth || "100%" }}
            />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrectAnswer = option === answer

          let optionStyle = "border-gray-200 hover:border-gray-300"
          let radioStyle = "border-gray-300"

          if (showFeedback) {
            if (isCorrectAnswer) {
              // Correct answer always shows green
              optionStyle = "border-green-500 bg-green-100"
              radioStyle = "border-green-500 bg-green-500"
            } else if (isSelected && !isCorrect) {
              // Wrong selected answer shows red
              optionStyle = "border-red-500 bg-red-100"
              radioStyle = "border-red-500 bg-red-500"
            }
          } else if (isSelected) {
            // Normal selection state
            optionStyle = "border-blue-500 bg-blue-50"
            radioStyle = "border-blue-500 bg-blue-500"
          }

          return (
            <div
              key={index}
              className={`p-4 border-2 rounded-lg transition-all duration-200 ${optionStyle} ${
                showFeedback ? "cursor-default" : "cursor-pointer"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${radioStyle}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <span className="text-gray-900">{option}</span>
                {showFeedback && isCorrectAnswer && (
                  <span className="ml-2 text-green-600 font-medium">✓ Correct Answer</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            <div className="text-2xl mr-3 mt-1">{getFeedbackIcon()}</div>
            <div>
              <h4 className={`font-semibold mb-2 ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </h4>
              {!isCorrect && (
                <p className="text-red-700 mb-2">
                  <span className="font-medium">Your Answer:</span> {selectedAnswer}
                </p>
              )}
              {solution && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                  <p className="text-sm text-gray-600">{solution}</p>
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
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedAnswer
                ? "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  )
}

export default PracticeQuestion
