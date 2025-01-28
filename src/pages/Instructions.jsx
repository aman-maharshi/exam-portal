import { useEffect, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import CheckIcon from "../../public/check.svg?react"
import { useNavigate, useParams } from 'react-router-dom'
import { data } from "../data"

const Instructions = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const { testId } = useParams()
  // console.log(testId, "testId")
  const test = data.find(test => test.id === parseInt(testId))
  // console.log(test, "test")

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6'>

        <div className='bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10'>
          <h2 className='text-4xl font-bold text-center mt-4'>Test Instructions</h2>

          <div className='flex items-center gap-4 justify-center mt-4'>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>
              Topic: {test.topic}
            </div>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>
              Class: {test?.class}
            </div>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>
              Duration: {test?.duration}
            </div>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>
              Questions: {test?.questionsList?.length}
            </div>
          </div>

          <div className='max-w-[500px] my-10 mx-auto text-stone-600'>
            <p>Welcome to the test portal! Please read the following instructions carefully before starting the test:</p>

            <ul className='list-none mt-6 flex flex-col gap-2'>
              <li className='flex gap-2 items-start'>
                <CheckIcon className="h-4 w-4 mt-1" />
                There are a total of {test?.questionsList?.length} questions in this test.
              </li>
              <li className='flex gap-2 items-start'>
                <CheckIcon className="h-4 w-4 mt-1" />
                Each question carries 1 mark.
              </li>
              <li className='flex gap-2 items-start'>
                <CheckIcon className="h-4 w-4 mt-1" />
                There is no negative marking.
              </li>
              <li className='flex gap-2 items-start'>
                <CheckIcon className="h-4 w-4 mt-1" />
                Once you start the test, you cannot pause it.
              </li>
              <li className='flex gap-2 items-start'>
                <CheckIcon className="h-4 w-4 mt-1" />
                Make sure you have a stable internet connection before starting the test.
              </li>
              <li className='flex gap-2 items-start'>
                <CheckIcon className="h-4 w-4 mt-1" />
                Click on the 'Start Test' button to begin the test.
              </li>
            </ul>
          </div>

          <button
            onClick={() => navigate(`/test/${testId}`)}
            className='card-gradient py-2 px-8 mt-14 mb-4 block mx-auto rounded-lg text-white'
          >
            Start Test
          </button>
        </div>

      </div>
    </Layout>
  )
}

export default Instructions