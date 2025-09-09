/**
 * Utility functions for handling bio text truncation and character counting
 */

export const getBioCharCount = (text: string): number => {
  if (!text) return 0
  return text.length
}

export const truncateBio = (text: string, charLimit: number = 140): string => {
  if (!text) return ''
  
  if (text.length <= charLimit) return text
  
  return text.slice(0, charLimit)
}

export const shouldShowReadMore = (text: string, charLimit: number = 140): boolean => {
  return getBioCharCount(text) > charLimit
}

export interface BioDisplayProps {
  text: string
  charLimit?: number
  className?: string
  showReadMore?: boolean
}

/**
 * Hook for managing bio truncation state
 */
import { useState } from 'react'

export const useBioTruncation = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const toggleExpanded = () => setIsExpanded(!isExpanded)
  
  const reset = () => setIsExpanded(false)
  
  return {
    isExpanded,
    toggleExpanded,
    reset,
    setIsExpanded
  }
}
