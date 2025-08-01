import React from "react"

const InfoCard = ({ text, image, header }) => {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const currentDate = new Date().toLocaleDateString(undefined, options)

  return (
    <div className="relative overflow-hidden p-4 lg:p-5 mt-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
            {currentDate}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg lg:text-xl font-semibold leading-tight text-gray-900">
              {header || "Welcome back!"}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 max-w-3xl">{text}</p>
          </div>
        </div>

        <div className="flex-shrink-0 hidden md:flex">
          <div className="relative h-full">
            <img
              src={image}
              alt="student"
              className="w-24 h-24 bg-gray-50 rounded-xl object-cover shadow-sm border border-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoCard
