import React, { useContext, useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import GlobalContext from '../GlobalContext'
import Layout from '../Layout'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import InfoCard from '../components/InfoCard'

const YourProgress = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (userData?.results) {
      const updatedData = userData?.results.map((item) => {
        return ({
          ...item,
          percentage: Math.round((Number(item?.totalMarks) / Number(item?.totalQuestions)) * 100)
        })
      })
      setResults(updatedData)
    }
  }, [userData?.results])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md text-base">
          <p className="font-semibold">{`Topic: ${label}`}</p>
          <p className='text-[#4F46E5]'>{`Percentage: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-4 sm:p-6 flex'>

        <div className='flex gap-4 sm:gap-6 flex-1'>
          <Sidebar />

          <div className='flex-1 rounded-xl'>
            <Topbar userData={userData} />

            <InfoCard
              text="Here you can track your progress effortlessly with an interactive graph showcasing your past results at a glance."
              image="/study-female.svg"
            />

            <div className='mt-6'>
              <h3 className='text-xl font-bold'>Your Progress</h3>

              {results?.length > 1 ? (
                <div className="w-full max-w-2xl py-4 mt-10">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results}>
                      <XAxis dataKey="topic" tick={{ fontSize: 13 }} />
                      <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft', style: { fontSize: 13 } }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="percentage" fill="#4F46E5" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div>
                  <div className='text-center text-gray-500 mt-8'>
                    <p className='text-xl'>No progress data available</p>
                    <p className='text-base'>
                      You need to take at least 2 tests to view your progress graph
                    </p>
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

export default YourProgress