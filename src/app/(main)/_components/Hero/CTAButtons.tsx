'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const CTAButtons: React.FC = () => {
  const router = useRouter();
  return (
    <nav 
      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start"
      role="navigation"
      aria-label="Primary call-to-action buttons"
    >
      <Button 
        size="lg" 
        className="w-full sm:w-auto bg-primary hover:bg-primary-700 text-white font-sans shadow-sm px-8 py-4 text-lg font-semibold transition-all duration-300"
        aria-label="Start your journey to find meaningful connections"
        type="button"
        onClick={() => {
          router.push('/find-match');
        }}
      >
        Start Your Journey
      </Button>
      <Button 
        variant="outline" 
        size="lg"
        className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
        aria-label="Learn more about Soulara dating platform"
        type="button"
        onClick={() => router.push('/about')}
        
      >
        Learn More
      </Button>
    </nav>
  )
}

export default CTAButtons
