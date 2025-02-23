import React from 'react'
import Modal from 'react-modal';
import CloseIcon from "../../assets/close.svg?react"

const FilePreviewModal = ({ isModalOpen, setIsModalOpen, fileName, filePath }) => {

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
    }
  }

  Modal.setAppElement('#root')

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      style={customStyles}
    >
      <div className='w-[90vw] h-[90vh] lg:w-[65vw] lg:h-[90vh] relative'>
        <CloseIcon
          onClick={() => setIsModalOpen(false)}
          className="size-7 absolute right-0 top-0 cursor-pointer"
        />

        <h2 className='font-medium text-lg mb-4'>{fileName}</h2>

        <object
          data={filePath}
          type="application/pdf"
          width="100%"
          height="100%"
        >
          <p>It appears you don't have a PDF plugin for this browser. Please download the file instead</p>
        </object>
      </div>
    </Modal>
  )
}

export default FilePreviewModal