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
import clsx from 'clsx'

const Home = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  // console.log(userData, "userData")
  // console.log(data, "data")

  const filteredData = data.filter(item => item.class === userData?.grade)
  const [availableTests, setAvailableTests] = useState(filteredData)
  const [availabeTestsCopy, setAvailabeTestsCopy] = useState(filteredData)
  const [activeTab, setActiveTab] = useState('All')
  const [showFilterTabs, setShowFilterTabs] = useState(false)
  // console.log(availableTests, "availableTests")

  // TODO: moditfy this such that both tabs and this filter work together
  // Modify the tests to show attempted tests last
  useEffect(() => {
    const results = userData?.results
    if (results && results.length > 0) {
      const testIds = results.map(result => Number(result.testId))
      const attemptedTests = availableTests.filter(test => testIds.includes(test.id))
      const remainingTests = availableTests.filter(test => !testIds.includes(test.id))
      setAvailableTests([...remainingTests, ...attemptedTests])
    }
  }, [userData])

  // To show filter tabs only if there are tests other than 'Easy'
  useEffect(() => {
    const hasNonEasyTests = availableTests.some(test => test.difficulty !== 'Easy')
    setShowFilterTabs(hasNonEasyTests)
  }, [availableTests])

  const handleFilter = (tab) => {
    if (tab === 'All') {
      setAvailableTests(availabeTestsCopy)
      setActiveTab('All')
    } 
    if (tab === 'Easy') {
      setAvailableTests([...availabeTestsCopy].filter(test => test.difficulty === 'Easy'))
      setActiveTab('Easy')
    }
    if (tab === 'Moderate') {
      setAvailableTests([...availabeTestsCopy].filter(test => test.difficulty === 'Moderate'))
      setActiveTab('Moderate')
    }
  }

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
              <div className='flex gap-6'>
                <h3 className='text-xl font-bold'>Available Tests</h3>
                <div className='flex space-x-2'>
                  <button
                    className={clsx(
                      'px-4 py-1 text-sm bg-transparent rounded-3xl',
                      activeTab === 'All' ? 'cta-gradient text-white' : 'text-black'
                    )}
                    onClick={() => handleFilter('All')}
                  >
                    All
                  </button>
                  <button
                    className={clsx(
                      'px-4 py-1 text-sm bg-transparent rounded-3xl',
                      activeTab === 'Easy' ? 'cta-gradient text-white' : 'text-black'
                    )}
                    onClick={() => handleFilter('Easy')}
                  >
                    Easy
                  </button>
                  <button
                    className={clsx(
                      'px-4 py-1 text-sm bg-transparent rounded-3xl',
                      activeTab === 'Moderate' ? 'cta-gradient text-white' : 'text-black'
                    )}
                    onClick={() => handleFilter('Moderate')}
                  >
                    Medium
                  </button>
                </div>
              </div>

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