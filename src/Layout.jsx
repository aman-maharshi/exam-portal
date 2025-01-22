import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className='w-full min-h-screen bg-gradient'>
      {children}
    </div>
  )
}

export default Layout