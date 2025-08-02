import React from "react"

// ICONS
import GraduationHat from "../../assets/graduation-hat.svg?react"
import TrophyIcon from "../../assets/trophy.svg?react"
import GraphIcon from "../../assets/graph.svg?react"
import CheckIcon from "../../assets/check.svg?react"

const Hero = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 cta-gradient p-8 lg:p-12 flex-col justify-center">
      <div className="max-w-md mx-auto text-white">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 shadow-lg">
            <GraduationHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Exam Portal</h1>
          <p className="text-xl text-purple-100">Your gateway to academic excellence</p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Interactive Tests</h3>
                <p className="text-purple-100 text-sm">
                  Take timed assessments with instant results and detailed solutions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <GraphIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Progress Tracking</h3>
                <p className="text-purple-100 text-sm">
                  Monitor your performance with detailed analytics and progress charts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Class-Specific Content</h3>
                <p className="text-purple-100 text-sm">Content tailored for 7th, 8th, and 9th grade students.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Built by */}
        <div className="text-center mt-auto pt-8">
          <p className="text-neutral-500 text-sm opacity-80">
            Built by{" "}
            <a
              href="https://amanmaharshi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-200 transition-colors duration-200"
            >
              Aman Maharshi
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero
