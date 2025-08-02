import React, { useContext, useState } from "react"
import GlobalContext from "../GlobalContext"
import Layout from "../Layout"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { studyMaterialsData } from "../dataStudy"
import FilePreviewModal from "../components/modals/FilePreviewModal"
import OpenFileIcon from "../assets/open-file.svg?react"
import DownloadIcon from "../assets/download.svg?react"

const StudyMaterials = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  // console.log(userData, "userData")
  // console.log(studyMaterialsData, "studyMaterialsData")

  const filteredData = studyMaterialsData?.filter(item => item.class === userData.selectedClass)
  const [studyMaterials, setStudyMaterials] = useState(filteredData || [])
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState({ fileName: "", filePath: "" })

  const handleFileDownload = file => {
    const link = document.createElement("a")
    link.href = `/study-materials/${file}`
    link.setAttribute("download", file)
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
      <div className="min-h-screen modern-bg w-full flex">
        <div className="flex flex-1 min-w-0">
          <Sidebar />

          <div className="flex-1 rounded-lg p-4 sm:p-6 h-auto lg:h-screen overflow-y-auto min-w-0">
            <Topbar userData={userData} />

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Study Materials</h3>

              {studyMaterials?.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Table Container with Horizontal Scroll */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px] w-full">
                      {/* Table Header */}
                      <div className="bg-gray-50 rounded-t-lg border-b border-gray-200 px-4 py-3">
                        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                          <div className="col-span-4 sm:col-span-6">Material Title</div>
                          <div className="col-span-4 sm:col-span-3">Class</div>
                          <div className="col-span-4 sm:col-span-3">Actions</div>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-gray-200">
                        {studyMaterials.map((item, index) => {
                          const { id, title, file, class: materialClass } = item
                          return (
                            <div key={index} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Material Title */}
                                <div className="col-span-4 sm:col-span-6">
                                  <div className="font-medium text-gray-900 truncate">{title}</div>
                                </div>

                                {/* Class */}
                                <div className="col-span-4 sm:col-span-3">
                                  <div className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded-full w-fit">
                                    {materialClass}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="col-span-4 sm:col-span-3">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleOpenFilePreviewModal(title, file)}
                                      className="cta-gradient text-white font-bold py-2 px-3 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                      <OpenFileIcon className="size-4" />
                                      View
                                    </button>
                                    <button
                                      onClick={() => handleFileDownload(file)}
                                      className="cta-gradient text-white font-bold py-2 px-3 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                      <DownloadIcon className="size-4" />
                                      Download
                                    </button>
                                  </div>
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

              {studyMaterials?.length === 0 && (
                <div className="bg-white rounded-lg p-8 text-center">
                  <div className="text-gray-500">
                    <p className="text-xl mb-2">No study materials available</p>
                    <p className="text-base">No study materials are available for your selected class</p>
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
