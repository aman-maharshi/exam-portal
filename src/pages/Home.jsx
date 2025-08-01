import { useEffect, useContext, useState } from "react"
import GlobalContext from "../GlobalContext"

import { useNavigate } from "react-router-dom"
import { data } from "../data"
import clsx from "clsx"

// COMPONENTS
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import AvailableTestRow from "../components/AvailableTestRow"
import Topbar from "../components/Topbar"
import InfoCard from "../components/InfoCard"

const Home = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  // console.log(userData, "userData")
  // console.log(data, "data")

  const filteredData = data.filter(item => item.class === userData?.grade)
  const [availableTests, setAvailableTests] = useState(filteredData)
  const [availabeTestsCopy, setAvailabeTestsCopy] = useState(filteredData)
  const [activeTab, setActiveTab] = useState("All")
  const [showFilterTabs, setShowFilterTabs] = useState(false)
  // console.log(availableTests, "availableTests")

  // To show filter tabs only if there are tests other than 'Easy'
  useEffect(() => {
    const hasNonEasyTests = availableTests.some(test => test.difficulty !== "Easy")
    setShowFilterTabs(hasNonEasyTests)
  }, [availableTests])

  // Ensure attempted tests are moved to the end on initial load
  useEffect(() => {
    setAvailableTests(putAttemptedTestsEnd(filteredData))
  }, [])

  const handleFilter = tab => {
    if (tab === "All") {
      const tests = availabeTestsCopy
      setAvailableTests(putAttemptedTestsEnd(tests))
      setActiveTab("All")
    }
    if (tab === "Easy") {
      const tests = [...availabeTestsCopy].filter(test => test.difficulty === "Easy")
      setAvailableTests(putAttemptedTestsEnd(tests))
      setActiveTab("Easy")
    }
    if (tab === "Moderate") {
      const tests = [...availabeTestsCopy].filter(test => test.difficulty === "Moderate")
      setAvailableTests(putAttemptedTestsEnd(tests))
      setActiveTab("Moderate")
    }
  }

  const putAttemptedTestsEnd = tests => {
    const results = userData?.results
    if (results && results.length > 0) {
      const testIds = results.map(result => Number(result.testId))
      const attemptedTests = tests.filter(test => testIds.includes(test.id))
      const remainingTests = tests.filter(test => !testIds.includes(test.id))
      return [...remainingTests, ...attemptedTests]
    } else {
      return tests
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-100 w-full flex">
        <div className="flex flex-1">
          <Sidebar />

          <div className="flex-1 rounded-xl p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto">
            <Topbar userData={userData} />
            <InfoCard
              header="Ready to learn?"
              text="Explore available tests and challenge your knowledge with interactive quizzes."
              image="/study-male.svg"
            />
            <div className="mt-6">
              <div className="flex justify-between sm:justify-start gap-4 md:gap-6">
                <h3 className="text-lg md:text-xl font-bold">Available Tests</h3>
                <div className="flex space-x-2">
                  <button
                    className={clsx(
                      "px-2 md:px-4 py-1 text-sm bg-transparent rounded-3xl",
                      activeTab === "All" ? "cta-gradient text-white" : "text-black"
                    )}
                    onClick={() => handleFilter("All")}
                  >
                    All
                  </button>
                  <button
                    className={clsx(
                      "px-4 py-1 text-sm bg-transparent rounded-3xl",
                      activeTab === "Easy" ? "cta-gradient text-white" : "text-black"
                    )}
                    onClick={() => handleFilter("Easy")}
                  >
                    Easy
                  </button>
                  <button
                    className={clsx(
                      "px-4 py-1 text-sm bg-transparent rounded-3xl",
                      activeTab === "Moderate" ? "cta-gradient text-white" : "text-black"
                    )}
                    onClick={() => handleFilter("Moderate")}
                  >
                    Moderate
                  </button>
                </div>
              </div>

              {availableTests.map((test, index) => (
                <AvailableTestRow key={index} test={test} userData={userData} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
