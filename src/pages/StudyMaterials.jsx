import React, { useContext, useState } from 'react'
import GlobalContext from '../GlobalContext'
import Layout from '../Layout'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import InfoCard from '../components/InfoCard'
import { studyMaterialsData } from "../dataStudy"
import FilePreviewModal from '../components/modals/FilePreviewModal'
import OpenFileIcon from "../assets/open-file.svg?react"
import DownloadIcon from "../assets/download.svg?react"

const StudyMaterials = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  console.log(userData, "userData")
  console.log(studyMaterialsData, "studyMaterialsData")

  const filteredData = studyMaterialsData?.filter(item => item.class === userData.grade)
  const [studyMaterials, setStudyMaterials] = useState(filteredData || [])
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState({ fileName: "", filePath: "" })

  const handleFileDownload = (file) => {
    const link = document.createElement('a')
    link.href = `/study-materials/${file}`
    link.setAttribute('download', file)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenFilePreviewModal = (title, file) => {
    setSelectedFile({ fileName: title, filePath: `/study-materials/${file}` })
    setShowFilePreviewModal(true)
  }

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
              {studyMaterials?.length > 0 ? (
                studyMaterials.map((item) => {
                  const { id, title, file } = item
                  return (
                    <div key={item?.id}>
                      <div className='border p-4 rounded-xl my-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white'>
                        <div className='flex items-center gap-3 lg:gap-4'>
                          <div className='font-medium text-base lg:text-lg'>
                            {title}
                          </div>
                        </div>
                        <div className='flex gap-4'>
                          <button
                            onClick={() => handleOpenFilePreviewModal(title, file)}
                            className='cta-gradient flex-1 sm:flex-auto text-white font-bold p-2 md:px-4 rounded-lg flex gap-3 justify-center items-center outline-none'
                          >
                            <OpenFileIcon className="size-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleFileDownload(file)}
                            className='cta-gradient flex-1 sm:flex-auto text-white font-bold p-2 md:px-4 rounded-lg flex gap-3 justify-center items-center outline-none'
                          >
                            <DownloadIcon className="size-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div>
                  <div className='text-center text-gray-500 mt-8'>
                    <p className='text-xl'>No study materials available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFilePreviewModal && (
        <FilePreviewModal
          isModalOpen={showFilePreviewModal}
          setIsModalOpen={setShowFilePreviewModal}
          fileName={selectedFile.fileName}
          filePath={selectedFile.filePath}
        />
      )}
    </Layout>
  )
}

export default StudyMaterials