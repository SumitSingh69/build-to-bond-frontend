"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src="/assets/not-found.jpg"
                alt="Lost in space - astronaut and rocket illustration"
                width={400}
                height={320}
                className="w-full h-auto rounded-3xl shadow-2xl object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="space-y-8">
              <div className="relative inline-block">
                <h1 className="font-playfair text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent leading-none drop-shadow-sm">
                  404
                </h1>
              </div>

              <div className="space-y-4">
                <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  Oops! Lost in Space
                </h2>

                <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                  Your soulmate page has drifted into the cosmos
                </p>
              </div>

              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Don&apos;t worry, even astronauts get lost sometimes! Let&apos;s
                guide you back to finding meaningful connections on your journey
                to love.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 min-w-[180px]">
                    <Home className="w-5 h-5" />
                    Return Home
                  </Button>
                </Link>

                <Button
                  onClick={() => window.history.back()}
                  className="bg-background border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary-600 hover:text-white px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 flex items-center gap-3 justify-center min-w-[180px] hover:border-transparent"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
