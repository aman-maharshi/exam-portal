import { useEffect, useContext, useState } from 'react'
import GlobalContext from "../GlobalContext"

import { useNavigate } from 'react-router-dom'
import { data } from "../data"

// COMPONENTS
import Layout from '../Layout'
import Sidebar from '../components/Sidebar'
import AvailableTestRow from '../components/AvailableTestRow'
import Topbar from '../components/Topbar'
import InfoCard from '../components/InfoCard'

const Home = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  // console.log(userData, "userData")
  // console.log(data, "data")

  const filteredData = data.filter(item => item.class === userData?.grade)
  const [availableTests, setAvailableTests] = useState(filteredData)
  // console.log(availableTests, "availableTests")

  useEffect(() => {
    const results = userData?.results
    if (results && results.length > 0) {
      const testIds = results.map(result => Number(result.testId))
      const attemptedTests = availableTests.filter(test => testIds.includes(test.id))
      const remainingTests = availableTests.filter(test => !testIds.includes(test.id))
      setAvailableTests([...remainingTests, ...attemptedTests])
    }
  }, [userData])

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full flex'>

        <div className='flex flex-1'>
          <Sidebar />

          <div className='flex-1 rounded-xl p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto'>
            <Topbar userData={userData} />
            <InfoCard
              text="Here, you can explore all the available tests and choose the ones that interest you. Attempt tests to challenge your knowledge and improve your skills."
              image="/study-male.svg"
            />
            <div className='mt-6'>
              <h3 className='text-xl font-bold'>Available Tests</h3>

              {availableTests.map((test, index) => (
                <AvailableTestRow
                  key={index}
                  test={test}
                  userData={userData}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home