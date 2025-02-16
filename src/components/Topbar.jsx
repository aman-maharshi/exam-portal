import React from 'react'

const Topbar = ({ userData }) => {
  return (
    <div className='flex flex-row justify-between items-center pl-12 lg:pl-0'>
      <h1 className='font-bold text-lg sm:text-xl lg:text-3xl'>Welcome, {userData?.username} 👋</h1>
      <div className='flex items-center gap-2'>
        <div className='text-base font-bold'>
          {userData?.grade} Class
        </div>
      </div>
    </div>
  )
}

export default Topbar