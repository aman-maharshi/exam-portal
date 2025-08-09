import { useEffect, useContext, useState } from "react"
import GlobalContext from "../GlobalContext"
import { useNavigate } from "react-router-dom"
import { data } from "../data"
import clsx from "clsx"
import { toast } from "react-toastify"
import RefreshIcon from "../assets/refresh.svg?react"

// COMPONENTS
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import PracticeQuestion from "../components/PracticeQuestion"
import PracticeCompletion from "../components/PracticeCompletion"
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
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Practicing: {selectedTopic}</h4>
                        <p className="text-gray-600">
                          Question {currentQuestionIndex + 1} of {practiceSession.totalQuestions}
                        </p>
                      </div>
                      <button
                        onClick={resetSession}
                        className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md font-medium"
                      >
                        <RefreshIcon className="w-4 h-4 inline mr-2" />
                        Change Topic
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Minimal Score Display */}

                    {!practiceSession.completed && (
                      <div className="mb-8 p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          {/* Score */}
                          <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-light text-slate-800">{practiceSession.score}</span>
                            <span className="text-lg text-slate-400">/ {practiceSession.totalQuestions}</span>
                          </div>

                          {/* Progress */}
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-slate-500 font-medium">Progress</div>
                              <div className="text-2xl font-light text-slate-800">{getScorePercentage()}%</div>
                            </div>
                            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-slate-800 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${getScorePercentage()}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {practiceSession.completed ? (
                      <PracticeCompletion
                        practiceSession={practiceSession}
                        getScorePercentage={getScorePercentage}
                        resetSession={resetSession}
                      />
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
