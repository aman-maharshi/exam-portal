import React from 'react'
import { useNavigate } from 'react-router-dom'
import CircleIcon from "../assets/circle.svg?react"
import CircleCheckIcon from "../assets/check-circle.svg?react"
import clsx from 'clsx'

const AvailableTestRow = ({ test, userData }) => {
  const navigate = useNavigate()
  // console.log(test, "test data")
  
  const testAttempted = userData?.results.find(item => item.testId == test?.id)
  // console.log(testAttempted, "testAttempted")

  return (
    <div className='bg-white border p-4 rounded-xl my-4 flex justify-between items-center gap-4'>
      <div className='flex items-center gap-3 lg:gap-4'>
        {testAttempted ? <CircleCheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" /> : <CircleIcon className="h-5 w-5 flex-shrink-0" />}
        <div className='font-medium text-base lg:text-lg'>
          {test?.topic}
        </div>
        <div className={clsx(
          'text-sm px-3 py-0.5 rounded-full',
            test?.difficulty === 'Easy' && 'bg-green-100 text-green-600',
            test?.difficulty === 'Moderate' && 'bg-yellow-100 text-yellow-600', 
        )}>
          {test?.difficulty}
        </div>
      </div>
      <button
        onClick={() => navigate(`/instructions/${test?.id}`)}
        className='card-gradient text-white font-bold py-2 px-4 lg:px-8 rounded-lg'
      >
        Take Test
      </button>
    </div>
  )
}

export default AvailableTestRow