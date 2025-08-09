import { useEffect, useContext, useState } from "react"
import GlobalContext from "../GlobalContext"
import { useNavigate } from "react-router-dom"
import { data } from "../data"
import clsx from "clsx"
import { toast } from "react-toastify"

// COMPONENTS
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import PracticeQuestion from "../components/PracticeQuestion"
import PracticeCard from "../components/PracticeCard"

const Practice = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  const filteredData = data.filter(item => item.class === userData?.selectedClass)
  const [availableTopics, setAvailableTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [practiceSession, setPracticeSession] = useState({
    topic: null,
    questions: [],
    answers: [],
    score: 0,
    totalQuestions: 0,
    completed: false
  })
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Get unique topics for the selected class
  useEffect(() => {
    const topics = [...new Set(filteredData.map(item => item.topic))]
    setAvailableTopics(
      topics.map(topic => ({
        name: topic,
        tests: filteredData.filter(item => item.topic === topic)
      }))
    )
  }, [userData?.selectedClass])

  const startPracticeSession = topic => {
    const topicData = availableTopics.find(t => t.name === topic)
    if (!topicData) return

    // Get all questions from this topic
    const allQuestions = topicData.tests.flatMap(test =>
      test.questionsList.map((q, index) => ({
        ...q,
        testId: test.id,
        testTopic: test.topic,
        questionIndex: index
      }))
    )

    setPracticeSession({
      topic: topic,
      questions: allQuestions,
      answers: new Array(allQuestions.length).fill(""),
      score: 0,
      totalQuestions: allQuestions.length,
      completed: false
    })
    setSelectedTopic(topic)
    setCurrentQuestionIndex(0)
    setIsTransitioning(false)
  }

  const handleAnswerSubmit = answer => {
    const currentQuestion = practiceSession.questions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.answer

    // Update answers array
    const newAnswers = [...practiceSession.answers]
    newAnswers[currentQuestionIndex] = answer

    // Update score
    const newScore = practiceSession.score + (isCorrect ? 1 : 0)

    setPracticeSession(prev => ({
      ...prev,
      answers: newAnswers,
      score: newScore
    }))

    // Set transitioning state after showing feedback
    setTimeout(() => {
      setIsTransitioning(true)

      // Move to next question or complete session
      setTimeout(() => {
        if (currentQuestionIndex < practiceSession.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setIsTransitioning(false)
        } else {
          // Session completed
          setPracticeSession(prev => ({ ...prev, completed: true }))
          setIsTransitioning(false)
          toast.success("🎉 Practice session completed!", { position: "top-center" })
        }
      }, 1000) // 1 second to show transition state
    }, 7000) // 7 seconds to show feedback
  }

  const resetSession = () => {
    setPracticeSession({
      topic: null,
      questions: [],
      answers: [],
      score: 0,
      totalQuestions: 0,
      completed: false
    })
    setSelectedTopic(null)
    setCurrentQuestionIndex(0)
    setIsTransitioning(false)
  }

  const getProgressPercentage = () => {
    if (practiceSession.totalQuestions === 0) return 0
    return Math.round((currentQuestionIndex / practiceSession.totalQuestions) * 100)
  }

  const getScorePercentage = () => {
    if (practiceSession.totalQuestions === 0) return 0
    return Math.round((practiceSession.score / practiceSession.totalQuestions) * 100)
  }

  return (
    <Layout>
      <div className="min-h-screen modern-bg w-full flex">
        <div className="flex flex-1 min-w-0">
          <Sidebar />

          <div className="flex-1 rounded-xl p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto min-w-0">
            <Topbar userData={userData} />

            <div className="mt-6">
              {/* Enhanced Header */}
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-bold ">Practice Mode</h3>
                <p className="text-gray-600 text-lg">Master concepts at your own pace with instant feedback</p>
              </div>

              {!selectedTopic ? (
                // Enhanced Topic Selection
                <div className="space-y-6">
                  {availableTopics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableTopics.map((topic, index) => (
                        <PracticeCard key={index} topic={topic} onCardClick={startPracticeSession} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Topics Available</h3>
                      <p className="text-gray-500">No practice topics are available for your selected class yet.</p>
                    </div>
                  )}
                </div>
              ) : (
                // Enhanced Practice Session
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Enhanced Session Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">Practicing: {selectedTopic}</h4>
                          <p className="text-gray-600">
                            Question {currentQuestionIndex + 1} of {practiceSession.totalQuestions}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={resetSession}
                        className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md font-medium"
                      >
                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Change Topic
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Enhanced Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-blue-600">{getProgressPercentage()}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${getProgressPercentage()}%` }}
                        />
                      </div>
                    </div>

                    {/* Enhanced Score Display */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-blue-800">Current Score</span>
                            <div className="text-2xl font-bold text-blue-900">
                              {practiceSession.score} / {practiceSession.totalQuestions}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">{getScorePercentage()}%</div>
                          <div className="text-sm text-blue-700">Success Rate</div>
                        </div>
                      </div>
                    </div>

                    {practiceSession.completed ? (
                      // Enhanced Session Completed
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>

                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Practice Session Completed!</h3>

                        <div className="max-w-md mx-auto mb-8">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                              {practiceSession.score}/{practiceSession.totalQuestions}
                            </div>
                            <div className="text-lg text-green-700 mb-1">Questions Correct</div>
                            <div className="text-2xl font-bold text-green-600">{getScorePercentage()}%</div>
                            <div className="text-sm text-green-600">Success Rate</div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            onClick={resetSession}
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
                          >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Practice Another Topic
                          </button>
                          <button
                            onClick={() => navigate("/home")}
                            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-200"
                          >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m5-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1v4a1 1 0 01-1 1H9z"
                              />
                            </svg>
                            Back to Home
                          </button>
                        </div>
                      </div>
                    ) : isTransitioning ? (
                      // Enhanced Transitioning State
                      <div className="text-center py-16">
                        <div className="inline-flex flex-col items-center">
                          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                          <div className="text-lg font-medium text-blue-600">Moving to next question...</div>
                          <div className="text-sm text-gray-500 mt-2">Preparing your next challenge</div>
                        </div>
                      </div>
                    ) : (
                      // Current Question
                      <PracticeQuestion
                        question={practiceSession.questions[currentQuestionIndex]}
                        onAnswerSubmit={handleAnswerSubmit}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={practiceSession.totalQuestions}
                      />
                    )}
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

export default Practice
