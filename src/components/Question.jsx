import React from 'react'

const Question = ({ index, question, setTotalMarks }) => {
  const { questionText, questionImage, options, answer, solution } = question

  const handleOptionChange = (e) => {
    const value = e.target.value
  }

  return (
    <div className="mb-8">
      {index + 1}. {questionText}

      <div className="my-4">
        {options.map((option, i) => (
          <div key={i} className='flex items-center gap-2 my-2'>
            <input
              type="radio"
              id={`option-${index}-${i}`}
              name={`question-${index}`}
              value={option}
              className='cursor-pointer h-4 w-4 outline-none'
              onChange={handleOptionChange}
            />
            <label htmlFor={`option-${index}-${i}`} className='cursor-pointer'>
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Question