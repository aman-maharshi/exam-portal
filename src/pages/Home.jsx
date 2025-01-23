import { useEffect, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import Sidebar from '../components/Sidebar'

const Home = () => {
  const { userData, setUserData } = useContext(GlobalContext)

  useEffect(() => {
    if (!userData?.password) {
      window.location.href = '/'
    }
  }, [userData])
  

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const currentDate = new Date().toLocaleDateString(undefined, options)

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-6 flex'>

        <div className='flex gap-6 flex-1'>
          <Sidebar />

          <div className='flex-1 rounded-xl'>


            <div className='p-4 px-8 rounded-xl card-gradient text-gray-200 shadow-md flex justify-between'>
              <div>
                <h1 className='font-bold text-3xl mt-5'>Welcome, {userData?.username} 👋</h1>
                <div className='my-4 max-w-md'>Here you can participate in active exams, and review the results of your previous attempts with ease.</div>
              </div>
              <div>
                <p className='text-gray-300'>{currentDate}</p>
                {/* <img src="/student.svg" alt="student" className='h-32 w-32' /> */}
              </div>
            </div>
          </div>
        </div>


      </div>
    </Layout>
  )
}

export default Home