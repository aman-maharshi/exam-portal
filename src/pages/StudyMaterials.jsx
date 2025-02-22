import React, { useContext, useState } from 'react'
import GlobalContext from '../GlobalContext'
import Layout from '../Layout'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import InfoCard from '../components/InfoCard'

const StudyMaterials = () => {
  const { userData, setUserData } = useContext(GlobalContext)

  return (
    <Layout>
      <div className='min-h-screen bg-[#ecf2f9] w-full p-4 sm:p-6 flex'>

        <div className='flex gap-4 sm:gap-6 flex-1'>
          <Sidebar />

          <div className='flex-1 rounded-xl'>
            <Topbar userData={userData} />

            <InfoCard
              text="Here you can explore a variety of study materials, including notes, guides, and practice resources, to help you prepare effectively and enhance your understanding of key concepts."
              image="/study-female.svg"
            />

            <div className='mt-6'>
              <h3 className='text-xl font-bold'>Study Materials</h3>

              <div>
                <div className='text-center text-gray-500 mt-8'>
                  <p className='text-xl'>No study materials available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StudyMaterials