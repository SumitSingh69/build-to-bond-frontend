"use client"

import React from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

interface ProfileDropdownProps {
  name: string
  email: string
  src?: string | { url: string; [key: string]: unknown }
  isOnline?: boolean
  className?: string
}

const ProfileDropdown = ({ name, email, src, isOnline = false, className }: ProfileDropdownProps) => {
  const { logout } = useAuth();

  // Helper function to get avatar URL with Dicebear fallback
  const getAvatarUrl = (avatar?: string | { url: string; [key: string]: unknown }): string => {
    // Check for direct string URL
    if (typeof avatar === 'string' && avatar.trim()) {
      return avatar;
    }
    
    // Check for object with url property
    if (avatar && typeof avatar === 'object' && 'url' in avatar && avatar.url && avatar.url.trim()) {
      return avatar.url;
    }
    
    // Fallback to Dicebear avatar using email as seed
    const seed = email || name.replace(/\s+/g, '-').toLowerCase() || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  const avatarUrl = getAvatarUrl(src);
  
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={cn(
            "relative group transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full",
            className
          )}
        >
          <div className="relative">
            <Avatar className="w-8 h-8 border-2 border-primary-200 group-hover:border-primary-400 transition-colors">
              <AvatarImage 
                src={avatarUrl} 
                alt={name}
                onError={(e) => {
                  // If image fails to load, fallback to Dicebear
                  const target = e.target as HTMLImageElement;
                  const seed = email || name.replace(/\s+/g, '-').toLowerCase() || 'user';
                  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
                }}
              />
              <AvatarFallback className="bg-primary-100 text-primary-800 text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Online Status Indicator */}
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 p-0 bg-background border border-border shadow-lg" align="end">
        {/* Profile Header */}
        <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-primary-300">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary-200 text-primary-800 text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{name}</p>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
              <div className="flex items-center mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  isOnline ? "bg-green-500" : "bg-gray-400"
                )}></div>
                <span className="text-xs text-muted-foreground">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <Link href="/profile">
            <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent focus:bg-accent">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Profile</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/profile?tab=account">
            <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent focus:bg-accent">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Account Settings</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/profile?tab=subscription">
            <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent focus:bg-accent">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium">Subscription</span>
              <div className="ml-auto">
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Pro</span>
              </div>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem 
            className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
