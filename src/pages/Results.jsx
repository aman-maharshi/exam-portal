import { useEffect, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import Sidebar from '../components/Sidebar'
import CircleCheckIcon from "../assets/check-circle.svg?react"

const Results = () => {
  const { userData, setUserData } = useContext(GlobalContext)

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const currentDate = new Date().toLocaleDateString(undefined, options)

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6 flex'>

        <div className='flex gap-6 flex-1'>
          <Sidebar />

          <div className='flex-1 rounded-xl'>
            <h1 className='font-bold text-3xl'>Welcome, {userData?.username} 👋</h1>
            <div className='p-4 py-6 mt-4 px-8 rounded-xl card-gradient text-gray-200 shadow-md flex justify-between'>
              <div>
                <p className='font-bold text-lg'>{currentDate}</p>
                <div className='max-w-lg mt-4'>
                  View your scores for attempted tests and track your performance effortlessly. Stay informed about your progress and identify areas for improvement!
                </div>
              </div>
              <div>
                <img src="/study-female.svg" alt="student" className='h-36 w-36 bg-white rounded-full' />
              </div>
            </div>

            <div className='mt-6'>
              <h3 className='text-xl font-bold'>Available Results</h3>

              <div className='bg-white border p-4 rounded-xl my-4 flex justify-between items-center gap-4'>
                <div className='flex items-center gap-4'>
                  <CircleCheckIcon className="h-5 w-5" />
                  <div className='font-medium text-lg'>Sound</div>
                </div>
                <div className='flex items-end gap-4'>
                  <div className='font-bold text-3xl'>8/10</div>
                  <div className='text-gray-500 text-sm pb-0.5'>80%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Results