import React from 'react'
import Modal from 'react-modal';
import CloseIcon from "../../assets/close.svg?react"

const LogoutModal = ({ isModalOpen, setIsModalOpen, handleLogout }) => {

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
      <div className='w-[250px] md:w-[450px] relative'>
        <CloseIcon
          onClick={() => setIsModalOpen(false)}
          className="size-6 absolute right-0 -top-1 cursor-pointer"
        />

        <h2 className='font-medium text-lg'>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-1.5 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 cta-gradient text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default LogoutModal