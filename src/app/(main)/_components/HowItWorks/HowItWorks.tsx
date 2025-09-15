import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface StepProps {
  stepNumber: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  isReversed?: boolean
}

const Step: React.FC<StepProps> = ({ 
  stepNumber, 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  isReversed = false 
}) => {
  return (
    <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}>
      {/* Content */}
      <div className="flex-1 text-center lg:text-left">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold mb-6 shadow-lg">
          {stepNumber}
        </div>
        <h3 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          {title}
        </h3>
        <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
          {description}
        </p>
      </div>
      
      {/* Image */}
      <div className="flex-1 max-w-md lg:max-w-lg">
        <div className="relative aspect-square rounded-2xl overflow-hidden group">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain transition-transform duration-500 rounded-xl "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          />
        </div>
      </div>
    </div>
  )
}

const HowItWorks: React.FC = () => {
  const router = useRouter();
  const steps = [
    {
      stepNumber: "1",
      title: "Create Account",
      description: "Register for free & create up your good looking Profile. Tell us about yourself, your interests, and what you&apos;re looking for in a meaningful connection.",
      imageSrc: "/assets/working/create_trans.png",
      imageAlt: "Create your dating profile - Step 1"
    },
    {
      stepNumber: "2", 
      title: "Find Matches",
      description: "Search & Connect with Matches which are perfect for you. Our intelligent algorithm considers your preferences, values, and compatibility factors.",
      imageSrc: "/assets/working/matches_trans.png",
      imageAlt: "Find compatible matches - Step 2"
    },
    {
      stepNumber: "3",
      title: "Start Dating",
      description: "Start doing conversations and date your best match. Build genuine connections through meaningful conversations and plan your perfect dates.",
      imageSrc: "/assets/working/date-02.png", 
      imageAlt: "Start dating and build relationships - Step 3"
    }
  ]

  return (
    <section 
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary-50"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="text-center mb-16 lg:mb-20">
          <h2 
            id="how-it-works-heading"
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            How Soulara Works
          </h2>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your journey to finding authentic love starts here. Follow these simple steps to discover your perfect match and build meaningful relationships.
          </p>
        </header>

        {/* Steps */}
        <div className="space-y-20 lg:space-y-32">
          {steps.map((step, index) => (
            <Step
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              imageSrc={step.imageSrc}
              imageAlt={step.imageAlt}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-3xl p-8 lg:p-12 border border-primary-200">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Find Your Soul Connection?
            </h3>
            <p className="font-sans text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of people who have found meaningful relationships through Soulara. Your perfect match is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => router.push('/find-match')}
                className="bg-primary hover:bg-primary-700 text-white font-sans shadow-sm px-10 py-4 text-lg font-semibold transition-all duration-300"
                aria-label="Get started with Soulara dating platform"
              >
                Get Started Now
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-sans px-10 py-4 text-lg font-semibold transition-all duration-300"
                aria-label="Learn more about how Soulara works"
                onClick={() => router.push('/about')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HowItWorks