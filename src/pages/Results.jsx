import { useEffect, useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"
import Sidebar from '../components/Sidebar'
import CircleCheckIcon from "../assets/check-circle.svg?react"
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import Topbar from '../components/Topbar'
import InfoCard from '../components/InfoCard'

const Results = () => {
  const { userData, setUserData } = useContext(GlobalContext)

  // console.log(userData?.results, "results")

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-4 sm:p-6 flex'>

        <div className='flex gap-4 sm:gap-6 flex-1'>
          <Sidebar />

          <div className='flex-1 rounded-xl'>
            <Topbar userData={userData} />

            <InfoCard
              text="Here you can review your attempted test results, view your test score, and access the corresponding solutions."
              image="/study-female.svg"
            />

            <div className='mt-6'>
              <h3 className='text-xl font-bold'>Available Results</h3>

              {userData?.results?.map((result, index) => {
                const resultPercentage = parseInt((result?.totalMarks / result?.totalQuestions) * 100)
                let textColor = resultPercentage >= 75 ? 'text-green-600' : resultPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'

                return (
                  <div key={index} className='bg-white border p-4 rounded-xl my-4 flex flex-col md:flex-row justify-between md:items-center gap-4'>
                    <div className='flex items-center gap-3 lg:gap-4 sm:w-[350px]'>
                      <CircleCheckIcon className="h-5 w-5 text-slate-700 flex-shrink-0" />
                      <div className='font-medium text-base lg:text-lg'>
                        {result?.topic}
                      </div>
                      <div className={clsx(
                        'text-sm px-3 py-0.5 rounded-full',
                        result?.difficulty === 'Easy' && 'bg-green-100 text-green-600',
                        result?.difficulty === 'Moderate' && 'bg-yellow-100 text-yellow-600',
                      )}>
                        {result?.difficulty}
                      </div>
                    </div>

                    <Link
                      to={`/solution/${result?.testId}`}
                      className='cta-gradient py-1 px-2 text-white text-center rounded-lg text-sm'
                    >
                      View Solutions
                    </Link>

                    <div className='flex items-end justify-end gap-4'>
                      <span className='text-sm text-gray-500'>you scored</span>
                      <div className='font-bold text-4xl'>
                        <span className={textColor}>{result?.totalMarks}</span>
                        <span className='text-2xl text-black'> / {result?.totalQuestions}</span>
                      </div>
                      <div className='text-gray-600 text-base pb-0.5 font-medium'>{resultPercentage}%</div>
                    </div>
                  </div>
                )
              })}

              {userData?.results.length === 0 && (
                <div>
                  <div className='text-center text-gray-500 mt-8'>
                    <p className='text-xl'>No results available</p>
                    <p className='text-base'>You haven't attempted any tests yet</p>
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

export default Results