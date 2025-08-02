import { useEffect, useContext, useState } from "react"
import GlobalContext from "../GlobalContext"

import { useNavigate } from "react-router-dom"
import { data } from "../data"
import clsx from "clsx"

// COMPONENTS
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

const Home = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  // console.log(userData, "userData")
  // console.log(data, "data")

  const filteredData = data.filter(item => item.class === userData?.selectedClass)
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
    setAvailabeTestsCopy(filteredData)
  }, [userData?.selectedClass])

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
      <div className="min-h-screen modern-bg w-full flex">
        <div className="flex flex-1 min-w-0">
          <Sidebar />

          <div className="flex-1 rounded-xl p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto min-w-0">
            <Topbar userData={userData} />
            <div className="mt-6">
              <div className="flex justify-between sm:justify-start gap-4 md:gap-6 mb-4">
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

              {availableTests.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Table Container with Horizontal Scroll */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px] w-full">
                      {/* Table Header */}
                      <div className="bg-gray-50 border-b rounded-t-lg border-gray-200 px-4 py-3">
                        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                          <div className="col-span-4">Topic</div>
                          <div className="col-span-2">Difficulty</div>
                          <div className="col-span-2">Class</div>
                          <div className="col-span-4">Actions</div>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-gray-200">
                        {availableTests.map((test, index) => {
                          const testAttempted = userData?.results?.find(item => item.testId == test?.id)

                          return (
                            <div
                              key={index}
                              className={clsx(
                                "px-4 py-4 hover:bg-gray-50 transition-colors",
                                testAttempted && "bg-neutral-100"
                              )}
                            >
                              <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Topic */}
                                <div className="col-span-4">
                                  <div className="font-medium text-gray-900 truncate">{test?.topic}</div>
                                </div>

                                {/* Difficulty */}
                                <div className="col-span-2">
                                  <div
                                    className={clsx(
                                      "text-sm px-3 py-1 rounded-full w-fit",
                                      test?.difficulty === "Easy" && "bg-green-100 text-green-600",
                                      test?.difficulty === "Moderate" && "bg-yellow-100 text-yellow-600",
                                      test?.difficulty === "Hard" && "bg-red-100 text-red-600"
                                    )}
                                  >
                                    {test?.difficulty}
                                  </div>
                                </div>

                                {/* Class */}
                                <div className="col-span-2">
                                  {test?.class ? (
                                    <div className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full w-fit">
                                      {test.class}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-4">
                                  <button
                                    onClick={() => navigate(`/instructions/${test?.id}`)}
                                    className="cta-gradient text-white font-bold py-2 px-3 rounded-lg text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                                  >
                                    {testAttempted ? "Retake Test" : "Take Test"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {availableTests.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="text-gray-500">
                    <p className="text-xl mb-2">No tests available</p>
                    <p className="text-base">No tests are available for your selected class</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
