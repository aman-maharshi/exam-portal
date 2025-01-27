import { useEffect, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import CheckIcon from "../../public/check.svg?react"
import { useNavigate, useParams } from 'react-router-dom'
import { data } from "../data"

const Result = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const { testId } = useParams()
  // console.log(testId, "testId")
  const test = data.find(test => test.id === parseInt(testId))
  const result = userData.results.find(result => result.testId === testId)
  // console.log(result, "result")

  const resultPercentage = parseInt((result?.totalMarks / result?.totalQuestions) * 100)

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6'>

        <div className='bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10'>
          <h2 className='text-4xl font-bold text-center mt-4'>Your Result</h2>

          <div className='flex items-center gap-4 justify-center mt-4'>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>
              Topic: {result.topic}
            </div>
          </div>

          <div className='flex flex-col items-center justify-center mt-10'>
            <div>
              {resultPercentage >= 75 ? (
                <span role="img" aria-label="happy" className="text-6xl">😊</span>
              ) : resultPercentage >= 50 ? (
                <span role="img" aria-label="average" className="text-6xl">😐</span>
              ) : (
                <span role="img" aria-label="sad" className="text-6xl">😢</span>
              )}
            </div>

            <p className='my-4'>You got {result?.totalMarks} out of {result?.totalQuestions}</p>

            <div className="bg-blue-50/80 p-6 max-w-xs rounded-xl border border-blue-200">
              <div className="space-y-2">
                <p className="text-6xl font-bold text-gray-900">{resultPercentage}%</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/home`)}
            className='card-gradient py-2 px-8 mt-14 mb-4 block mx-auto rounded-lg text-white'
          >
            ← back to Home
          </button>
        </div>

      </div>
    </Layout>
  )
}

export default Result