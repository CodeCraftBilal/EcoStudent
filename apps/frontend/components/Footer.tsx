'use client'
import { Leaf } from 'lucide-react'
import React from 'react'
const Fotter = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-green-400" />
              <span className="text-xl font-bold">EcoStudent</span>
            </div>
            <div className="text-gray-400">
              &copy; {year} EcoStudent. Making education sustainable.
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Fotter
