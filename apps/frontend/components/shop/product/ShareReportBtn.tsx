'use client'
import { Flag, Share2 } from 'lucide-react';
import React from 'react'


const ShareReportBtn = () => {

    const onShare = () => {
        console.log('share item')
    }
    
    const onReport = () => {
        console.log('report item')
    }
  return (
    <div className="flex items-center space-x-2">
          <button
            onClick={onShare}
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={onReport}
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>
  )
}

export default ShareReportBtn
