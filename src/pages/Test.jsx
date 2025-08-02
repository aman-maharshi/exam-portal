import { useState, useEffect, useContext, useRef } from "react"
import GlobalContext from "../GlobalContext"
import { useNavigate, useParams } from "react-router-dom"
import { data } from "../data"
import { databaseService } from "../services/databaseService"
import { toast } from "react-toastify"

import { clsx } from "clsx"

// COMPONENTS
import Layout from "../Layout"
import Question from "../components/Question"
import Timer from "../components/Timer"

const Test = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const { testId } = useParams()
  const test = data.find(test => test.id === parseInt(testId))

  const [totalMarks, setTotalMarks] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const answersMap = test?.questionsList.map(item => ({
    question: item.questionText,
    answer: item.answer,
    selectedAnswer: ""
  }))
  const [answersList, setAnswersList] = useState(answersMap)

  useEffect(() => {
    if (answersList.length > 0) {
      const marks = answersList.reduce((acc, item) => {
        if (item.answer === item.selectedAnswer) {
          return acc + 1
        }
        return acc
      }, 0)
      setTotalMarks(marks)
    }
  }, [answersList])

  const handleSubmitTest = async () => {
    if (submitting) return // Prevent double submission

    setSubmitting(true)
    setLoading(true)

    try {
      // Validate test data
      if (!test) {
        toast.error("Test not found")
        return
      }

      if (!userData?.uid) {
        toast.error("User not authenticated")
        return
      }

      // Prepare test result data
      const testResult = {
        testId: parseInt(testId),
        totalMarks,
        totalQuestions: test?.questionsList.length,
        topic: test?.topic,
        difficulty: test?.difficulty,
        percentage: Math.round((totalMarks / test?.questionsList.length) * 100),
        submittedAt: new Date().toISOString(),
        answers: answersList, // Store answers for detailed review
        class: test?.class
      }

      // Save result to Firebase
      const result = await databaseService.saveTestResult(userData.uid, testResult)

      if (result.success) {
        // Update local state with the returned result
        updateResultLocally(result.result)
        toast.success("Test submitted successfully!")
        navigate("/result/" + testId)
      } else {
        console.error("Failed to save result:", result.error)
        toast.error("Failed to save result. Please try again.")

        // Still update local state as fallback
        updateResultLocally(testResult)
        navigate("/result/" + testId)
      }
    } catch (error) {
      console.error("Error submitting test:", error)
      toast.error("An error occurred. Please try again.")

      // Fallback to local storage
      const testResult = {
        testId: parseInt(testId),
        totalMarks,
        totalQuestions: test?.questionsList.length,
        topic: test?.topic,
        difficulty: test?.difficulty,
        percentage: Math.round((totalMarks / test?.questionsList.length) * 100),
        submittedAt: new Date().toISOString(),
        answers: answersList,
        class: test?.class
      }

      updateResultLocally(testResult)
      navigate("/result/" + testId)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const updateResultLocally = testResult => {
    const existingResultIndex = userData.results.findIndex(result => result.testId === parseInt(testId))
    let updatedResults

    if (existingResultIndex !== -1) {
      updatedResults = userData.results.map((result, index) =>
        index === existingResultIndex ? { ...result, ...testResult } : result
      )
    } else {
      updatedResults = [...userData.results, testResult]
    }

    const updatedData = {
      ...userData,
      results: updatedResults
    }
    setUserData(updatedData)
  }

  /*
    TIMER
  ---------*/
  const [timerEnded, setTimerEnded] = useState(false)
  const targetDateRef = useRef(
    test?.timer
      ? new Date(new Date().getTime() + test.timer * 60 * 1000).toISOString()
      : new Date(new Date().getTime() + 10 * 60 * 1000).toISOString()
  ) // 10 minutes

  const handleTimerEnd = () => {
    setTimerEnded(true)
    toast.warning("Time's up! Submitting your test...")
    handleSubmitTest()
  }

  // Check if user has already attempted this test
  const hasAttempted = userData?.results?.some(result => result.testId === parseInt(testId))

  return (
    <Layout>
      <div className="min-h-screen bg-[#ecf2f9] w-full p-6">
        <div className="bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10 relative">
          <div className="fixed top-4 right-4 lg:top-6 lg:right-6">
            {!timerEnded ? (
              <Timer targetDate={targetDateRef.current} handleTimerEnd={handleTimerEnd} />
            ) : (
              <div className="p-4 text-lg font-bold text-red-500">Timer has ended!</div>
            )}
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-center mt-4">{test?.topic}</h2>

          {hasAttempted && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-center">
              <p className="text-blue-800 font-medium">
                You have already attempted this test. Your previous score will be updated.
              </p>
            </div>
          )}

          <div className="max-w-[600px] my-10 mx-auto text-stone-600">
            {test?.questionsList?.map((question, index) => (
              <Question key={index} index={index} question={question} setAnswersList={setAnswersList} />
            ))}
          </div>

          <button
            onClick={handleSubmitTest}
            className={clsx(
              "py-2 px-8 mt-14 mb-4 block mx-auto rounded-lg text-white transition-all duration-300",
              loading || submitting ? "bg-stone-400 cursor-not-allowed" : "cta-gradient hover:opacity-90"
            )}
            disabled={loading || submitting}
          >
            {loading || submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Test
