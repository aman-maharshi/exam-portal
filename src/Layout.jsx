import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className='w-full min-h-screen bg-gradient text-[#1b1b1b]'>
      {children}
    </div>
  )
}

export default Layout