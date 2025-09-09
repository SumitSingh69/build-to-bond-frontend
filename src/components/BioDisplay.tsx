'use client'

import React from 'react'
import { truncateBio, shouldShowReadMore, useBioTruncation } from '@/lib/bio-utils'

interface BioDisplayProps {
  text: string | null | undefined
  charLimit?: number
  className?: string
  showReadMore?: boolean
  readMoreClassName?: string
}

export const BioDisplay: React.FC<BioDisplayProps> = ({
  text,
  charLimit = 100,
  className = 'text-gray-700 text-sm leading-relaxed',
  showReadMore = true,
  readMoreClassName = 'text-primary-500 hover:text-primary-600 text-xs font-medium mt-1 underline'
}) => {
  const { isExpanded, toggleExpanded } = useBioTruncation()
  
  if (!text || text.trim() === '') {
    return <p className={className}>No bio added yet...</p>
  }

  const showToggle = showReadMore && shouldShowReadMore(text, charLimit)

  return (
    <div className={className}>
      <p>
        {isExpanded || !showToggle 
          ? text 
          : `${truncateBio(text, charLimit)}...`
        }
      </p>
      {showToggle && (
        <button
          onClick={toggleExpanded}
          className={readMoreClassName}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

export default BioDisplay
