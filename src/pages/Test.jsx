import { useState, useEffect, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import { useNavigate, useParams } from 'react-router-dom'

import { data } from "../data"
import Question from '../components/Question'

const Test = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const { testId } = useParams()
  const test = data.find(test => test.id === parseInt(testId))
  console.log(test)

  const [totalMarks, setTotalMarks] = useState(0)

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6'>

        <div className='bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10'>
          <h2 className='text-4xl font-bold text-center mt-4'>{test?.topic}</h2>

          <div className='font-bold my-4 flex justify-end'>{totalMarks} / {test?.questionsList?.length}</div>
          <div className='max-w-[600px] my-10 mx-auto text-stone-600'>
            {test?.questionsList?.map((question, index) => (
              <Question
                key={index}
                index={index}
                question={question}
                setTotalMarks={setTotalMarks}
              />
            ))}
          </div>

          <button className='card-gradient py-2 px-8 mt-14 mb-4 block mx-auto rounded-lg text-white'>
            Submit
          </button>
        </div>

      </div>
    </Layout>
  )
}

export default Test