import { useEffect, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import { useNavigate, useParams } from 'react-router-dom'

const Test = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()
  const { testId } = useParams()
  console.log(testId, "testId")

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6'>

        <div className='bg-white p-4 rounded-xl max-w-[800px] mx-auto mt-10'>
          <h2 className='text-4xl font-bold text-center mt-4'>Test Name</h2>

          <div className='flex items-center gap-4 justify-center mt-4'>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>Test: Name</div>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>Duration: 10 mins</div>
            <div className='bg-stone-100 text-stone-700 py-1 px-3 rounded-lg text-sm font-medium'>Questions: 5</div>
          </div>

          <div className='max-w-[500px] my-10 mx-auto text-stone-600'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero ad dolorum error accusamus obcaecati nihil doloremque sit vel laboriosam explicabo.

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