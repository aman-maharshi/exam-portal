import { useEffect, useContext } from 'react'
import GlobalContext from "../GlobalContext"

import { useNavigate } from 'react-router-dom'
import { data } from "../data"

// COMPONENTS
import Layout from '../Layout'
import Sidebar from '../components/Sidebar'
import AvailableTestRow from '../components/AvailableTestRow'

const Home = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const currentDate = new Date().toLocaleDateString(undefined, options)
  // console.log(userData, "userData")
  // console.log(data, "data")

  const availableTests = data.filter(item => item.class === userData?.grade)

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6 flex'>

        <div className='flex gap-6 flex-1'>
          <Sidebar />

          <div className='flex-1 rounded-xl'>
            <div className='flex justify-between items-center'>
              <h1 className='font-bold text-xl sm:text-3xl'>Welcome, {userData?.username} 👋</h1>
              <div className='flex items-center gap-2'>
                <div>Class : </div> 
                <div className='px-3 py-0.5 rounded-full bg-blue-200 text-base font-bold'>
                  {userData?.grade}
                </div>
              </div>
            </div>
            <div className='p-4 py-6 mt-4 px-8 rounded-xl card-gradient text-gray-200 shadow-md flex justify-between gap-4'>
              <div>
                <p className='font-bold text-lg'>{currentDate}</p>
                <div className='max-w-lg mt-4 text-sm sm:text-base'>
                  Here you can take new tests to challenge your knowledge and skills, and revisit detailed solutions to previously attempted ones.
                </div>
              </div>
              <div>
                <img src="/study-male.svg" alt="student" className='h-24 w-24 min-w-24 lg:h-36 lg:w-36 lg:min-w-36 bg-white rounded-full' />
              </div>
            </div>

            <div className='mt-6'>
              <h3 className='text-xl font-bold'>Available Tests</h3>

              {availableTests.map((test, index) => (
                <AvailableTestRow
                  key={index}
                  test={test}
                  userData={userData}
                />
              ))}

              {/* <div className='bg-gray-100 border p-4 rounded-xl my-4 flex justify-between items-center gap-4'>
                <div className='flex items-center gap-4'>
                  <CircleCheckIcon className="h-5 w-5 text-green-700" />
                  <div className='font-medium text-lg'>Light</div>
                </div>
                <div className='flex items-center gap-4'>
                  <button
                    className='card-gradient text-white font-bold py-2 px-8 rounded-lg'
                  >
                    Solutions
                  </button>
                  <button
                    className='bg-[#3d6eff] disabled:bg-gray-200 disabled:text-gray-500 text-white font-bold py-2 px-8 rounded-lg'
                    disabled={true}
                  >
                    Take Test
                  </button>
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home