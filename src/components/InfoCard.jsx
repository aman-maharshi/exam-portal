import React from "react"

const InfoCard = ({ text, image }) => {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const currentDate = new Date().toLocaleDateString(undefined, options)

  return (
    <div className="relative overflow-hidden p-4 lg:p-6 mt-6 rounded-2xl bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 text-neutral-100 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-500/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-neutral-500/30 rounded-full translate-y-12 -translate-x-12"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-neutral-600/25 rounded-full -translate-y-8 -translate-x-8"></div>

      <div className="relative z-10 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 space-y-3">
          <div className="inline-flex items-center px-2 py-1 bg-neutral-600/30 rounded-full text-xs font-medium text-neutral-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
            {currentDate}
          </div>

          <div className="space-y-2">
            <h3 className="text-base lg:text-lg font-semibold leading-tight text-neutral-50">Welcome back!</h3>
            <p className="text-sm leading-relaxed text-neutral-300 max-w-2xl">{text}</p>
          </div>
        </div>

        <div className="flex-shrink-0 hidden md:flex">
          <div className="relative">
            <div className="absolute inset-0 bg-neutral-600/20 rounded-full blur-md"></div>
            <img
              src={image}
              alt="student"
              className="relative h-16 w-16 lg:h-20 lg:w-20 bg-white rounded-full object-cover shadow-md border-2 border-neutral-600/30"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoCard
