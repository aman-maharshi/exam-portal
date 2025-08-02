import React, { useState } from "react"
import CopyIcon from "../assets/copy.svg?react"
import DownArrowIcon from "../assets/down-arrow.svg?react"
import CheckIcon from "../assets/check.svg?react"

const DemoCredentials = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="mt-4 !bg-white backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">View Demo Credentials</span>
          <DownArrowIcon
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {/* Minimal Credentials Display */}
      {isExpanded && (
        <div className="mt-2 p-3 !bg-white rounded-lg border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Email:</span>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-white px-2 py-1 rounded border font-mono">demo@examportal.com</code>
                <button
                  onClick={() => handleCopy("demo@examportal.com", "email")}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Copy email"
                >
                  {copiedField === "email" ? (
                    <CheckIcon className="w-3 h-3 text-green-500" />
                  ) : (
                    <CopyIcon className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Password:</span>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-white px-2 py-1 rounded border font-mono">test879@</code>
                <button
                  onClick={() => handleCopy("test879@", "password")}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Copy password"
                >
                  {copiedField === "password" ? (
                    <CheckIcon className="w-3 h-3 text-green-500" />
                  ) : (
                    <CopyIcon className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoCredentials
