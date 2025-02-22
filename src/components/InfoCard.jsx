import React from 'react'

const InfoCard = ({ text, image }) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const currentDate = new Date().toLocaleDateString(undefined, options)

  return (
    <div className='p-4 lg:p-6 mt-4 rounded-xl cta-gradient text-gray-200 shadow-md flex flex-col-reverse sm:flex-row justify-between gap-4'>
      <div>
        <p className='font-bold lg:text-lg'>{currentDate}</p>
        <div className='max-w-xl mt-2 lg:mt-4 text-sm sm:text-base'>
          {text}
        </div>
      </div>
      <div className='hidden sm:block'>
        <img src={image} alt="student" className='h-20 w-20 min-w-20 lg:h-24 lg:w-24 lg:min-w-24 bg-white rounded-full' />
      </div>
    </div>
  )
}

export default InfoCard