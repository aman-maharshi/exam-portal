import React from 'react'

const Question = ({ index, question, setAnswersList }) => {
  const { questionText, questionImage, imageWidth, options, answer, solution } = question

  const handleOptionChange = (e) => {
    const value = e.target.value
    setAnswersList(prevState => {
      const updatedAnswers = [...prevState]
      updatedAnswers[index].selectedAnswer = value
      return updatedAnswers
    })
  }

  return (
    <div className="mb-8">
      {index + 1}. {questionText}

      {questionImage && (
        <div className={`w-[${imageWidth}]`}>
          <img
            src={`/questions/${questionImage}`}
            alt={questionImage}
            className='h-full w-full object-contain'
          />
        </div>
      )}

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