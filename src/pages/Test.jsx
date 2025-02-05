import { useState, useEffect, useContext } from 'react'
import GlobalContext from "../GlobalContext"
import { useNavigate, useParams } from 'react-router-dom'
import { data } from "../data"

// COMPONENTS
import Layout from '../Layout'
import Question from '../components/Question'
import Timer from '../components/Timer'

const Test = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const { testId } = useParams()
  const test = data.find(test => test.id === parseInt(testId))
  // console.log(test)

  const [totalMarks, setTotalMarks] = useState(0)
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

  const handleSubmitTest = () => {
    const existingResultIndex = userData.results.findIndex(result => result.testId === testId)
    let updatedResults

    if (existingResultIndex !== -1) {
      updatedResults = userData.results.map((result, index) =>
        index === existingResultIndex ? { ...result, totalMarks } : result
      )
    } else {
      updatedResults = [...userData.results, {
        testId,
        totalMarks,
        totalQuestions: test?.questionsList.length,
        topic: test?.topic
      }]
    }

    const updatedData = {
      ...userData,
      results: updatedResults
    }
    setUserData(updatedData)

    setTimeout(() => {
      navigate('/result/' + testId)
    }, 250)
  }

  /*
    TIMER
  ---------*/
  const [timerEnded, setTimerEnded] = useState(false)

  const handleTimerEnd = () => {
    setTimerEnded(true)
    handleSubmitTest()
  }

  const targetDate = new Date(new Date().getTime() + 10 * 60 * 1000).toISOString() // 10 minutes

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6'>

        <div className='bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10 relative'>

          <div className='fixed top-4 right-4 lg:top-6 lg:right-6'> 
            {!timerEnded ? (
              <Timer targetDate={targetDate} handleTimerEnd={handleTimerEnd} />
            ) : (
              <div className="p-4 text-lg font-bold text-red-500">
                Timer has ended!
              </div>
            )}
          </div>
          <h2 className='text-4xl font-bold text-center mt-4'>{test?.topic}</h2>
          <div className='max-w-[600px] my-10 mx-auto text-stone-600'>
            {test?.questionsList?.map((question, index) => (
              <Question
                key={index}
                index={index}
                question={question}
                setAnswersList={setAnswersList}
              />
            ))}
          </div>

          <button
            onClick={handleSubmitTest}
            className='card-gradient py-2 px-8 mt-14 mb-4 block mx-auto rounded-lg text-white'
          >
            Submit
          </button>
        </div>

      </div>
    </Layout>
  )
}

export default Test