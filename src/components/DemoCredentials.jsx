import React from "react"
import CopyIcon from "../assets/copy.svg?react"

const DemoCredentials = () => {
  return (
    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg border border-blue-200/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm text-black">Try the platform with demo credentials</p>
      </div>

      <div className="space-y-3">
        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Email:</span>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">demo@examportal.com</code>
              <button
                onClick={() => navigator.clipboard.writeText("demo@examportal.com")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Copy email"
              >
                <CopyIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Password:</span>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">test879@</code>
              <button
                onClick={() => navigator.clipboard.writeText("test879@")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Copy password"
              >
                <CopyIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoCredentials
