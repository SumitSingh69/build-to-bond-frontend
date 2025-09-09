import { User } from '@/types/auth.types'

// Re-export the User type for profile usage
export type ProfileUser = User

// Additional stats interface for profile display
export interface ProfileStats {
  crushes: number
  swipes: number
  matches: number
  views: number
}

// Extended User type with computed stats for profile display
export interface ProfileData extends User {
  stats?: ProfileStats
  // Computed fields for display
  name?: string // firstName + lastName
  age?: number // computed from dob
  preference?: string // mapped from genderPreference
}

export interface NotificationItem {
  id: string
  type: 'system' | 'crush' | 'chat' | 'offers'
  title: string
  message: string
  timestamp: Date
  read: boolean
  avatar?: string
}

export type NotificationTab = 'system' | 'crush' | 'chat' | 'offers'
