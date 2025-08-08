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
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-bold mb-2">Practice Mode</h3>
                <p className="text-gray-600">Practice questions without time pressure and get instant feedback</p>
              </div>

              {!selectedTopic ? (
                // Topic Selection
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold mb-4">Choose a Topic to Practice</h4>

                  {availableTopics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableTopics.map((topic, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => startPracticeSession(topic.name)}
                        >
                          <h5 className="font-semibold text-gray-900 mb-2">{topic.name}</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            {topic.tests.length} test{topic.tests.length !== 1 ? "s" : ""} available
                          </p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Total Questions: {topic.tests.reduce((acc, test) => acc + test.questionsList.length, 0)}
                            </span>
                            <span className="text-blue-600 font-medium">Start Practice</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No topics available for your selected class</p>
                    </div>
                  )}
                </div>
              ) : (
                // Practice Session
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Session Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-lg font-semibold">Practicing: {selectedTopic}</h4>
                      <p className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of {practiceSession.totalQuestions}
                      </p>
                    </div>
                    <button
                      onClick={resetSession}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Change Topic
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{getProgressPercentage()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">Current Score:</span>
                      <span className="text-lg font-bold text-blue-900">
                        {practiceSession.score} / {practiceSession.totalQuestions} ({getScorePercentage()}%)
                      </span>
                    </div>
                  </div>

                  {practiceSession.completed ? (
                    // Session Completed
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold mb-4">Practice Session Completed!</h3>
                      <div className="text-lg mb-6">
                        Final Score:{" "}
                        <span className="font-bold text-blue-600">
                          {practiceSession.score}/{practiceSession.totalQuestions}
                        </span>
                        <br />
                        Percentage: <span className="font-bold text-blue-600">{getScorePercentage()}%</span>
                      </div>
                      <div className="space-x-4">
                        <button
                          onClick={resetSession}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Practice Another Topic
                        </button>
                        <button
                          onClick={() => navigate("/home")}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Back to Home
                        </button>
                      </div>
                    </div>
                  ) : isTransitioning ? (
                    // Transitioning State
                    <div className="text-center py-12">
                      <div className="inline-flex items-center text-blue-600 font-medium text-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                        Moving to next question...
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
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Practice
