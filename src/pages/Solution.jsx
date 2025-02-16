import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../Layout'
import { data } from '../data'

// ICONS
import BackIcon from "../assets/back-arrow.svg?react"
import ShowPassword from "../assets/password-show.svg?react"
import HidePassword from "../assets/password-hide.svg?react"

const Solution = () => {
  const { testId } = useParams()
  const navigate = useNavigate()
  const test = data.find(test => test.id === parseInt(testId))
  const [showSolutions, setshowSolutions] = useState(true)
  // console.log(test, "test")

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6 relative'>
        <button
          onClick={() => navigate('/results')}
          className='absolute left-4 top-4 z-10 lg:left-8 lg:top-8 cta-gradient py-2 px-4 mx-auto rounded-lg text-white flex items-center gap-2'
        >
          <BackIcon className="size-4" />
          Back
        </button>

        <div className='bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10 relative'>
          <button
            className='flex gap-2 items-center absolute right-4 top-4 bg-gray-200 px-2 py-1 rounded-lg text-sm'
            onClick={() => setshowSolutions(!showSolutions)}
          >
            {showSolutions ? <HidePassword className="size-4" /> : <ShowPassword className="size-4" />}
            {showSolutions ? 'Hide Solutions' : 'Show Solutions'}
          </button>

          <h2 className='text-2xl md:text-4xl font-bold text-center mt-4'>{test?.topic}</h2>

          <div className='max-w-[600px] my-10 mx-auto text-stone-600'>
            {test?.questionsList.map((question, index) => (
              <div className="mb-8" key={index}>
                {index + 1}. {question.questionText}

                {question.questionImage && (
                  <div className={`w-[${question.imageWidth}]`}>
                    <img
                      src={`/questions/${question.questionImage}`}
                      alt={question.questionImage}
                      className='h-full w-full object-contain'
                    />
                  </div>
                )}

                <div className="my-4">
                  {question.options.map((option, i) => (
                    <div key={i} className='flex items-center gap-2 my-2'>
                      <li>{option}</li>
                    </div>
                  ))}
                </div>
                {showSolutions && (
                  <>
                    <div className="my-4 bg-blue-100 border border-blue-200 p-2 rounded-md">
                      <span className='underline'>Correct Answer</span> : <strong>{question.answer}</strong>

                      <div className='mt-2'>
                        <span className='underline'>Explanation</span> : {question?.solution}
                      </div>
                    </div>
                  </>
                )}

              </div>
            ))}

            <button
              onClick={() => navigate('/results')}
              className='cta-gradient py-2 px-4 mt-14 mb-4 mx-auto rounded-lg text-white flex items-center gap-2'
            >
              <BackIcon className="size-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Solution