"use client";
import React, { useState } from "react";
import DeveloperCard from "@/components/DeveloperCard";
import OceanModel from "@/components/ocean/ocean-model";
import { Button } from "@/components/ui/button";

const AboutUsPage = () => {
  const developers = [
    {
      id: 1,
      name: "Deepak Melkani",
      role: "Full Stack Developer",
      image: "/assets/deepakTq.png",
      description:
        "Expert in node.js and React, creating seamless user experiences and matching algorithms.",
      socialLinks: [
        { platform: "github" as const, url: "https://github.com/Deepak-Melkani" },
        {
          platform: "linkedin" as const,
          url: "https://www.linkedin.com/in/deepakmelkani/",
        },
        { platform: "twitter" as const, url: "https://x.com/Deepak19138166" },
        { platform: "portfolio" as const, url: "https://www.linkedin.com/in/deepakmelkani/" },
      ],
    },
    {
      id: 2,
      name: "Satrasala Hari priya",
      role: "Lead Frontend Developer",
      image: "/assets/hari-priya.png",
      description:
        "Expert in Next.js and React, creating seamless user experiences for meaningful connections.",
      socialLinks: [
        { platform: "github" as const, url: "https://github.com/shp576" },
        {
          platform: "linkedin" as const,
          url: "https://www.linkedin.com/in/haripriya-satrasala/",
        },
        { platform: "twitter" as const, url: "https://twitter.com/haripriya" },
        { platform: "portfolio" as const, url: "https://haripriya.dev" },
      ],
    },
    {
      id: 3,
      name: "Sumit Singh Bora",
      role: "Backend Engineer & API Architect",
      image: "/assets/sumit.jpg",
      description:
        "Specializes in scalable architecture and secure matching algorithms for the dating platform.",
      socialLinks: [
        { platform: "github" as const, url: "https://github.com/SumitSingh69" },
        {
          platform: "linkedin" as const,
          url: "https://www.linkedin.com/in/sumit-bora/",
        },
        { platform: "twitter" as const, url: "https://twitter.com/sumitbora" },
        { platform: "portfolio" as const, url: "https://sumitbora.dev" },
      ],
    },
    {
      id: 4,
      name: "Mukesh Singh Rawat",
      role: "UX/UI Designer",
      image: "/assets/mukesh-bhai.png",
      description:
        "Creates intuitive interfaces that make finding love feel natural and effortless.",
      socialLinks: [
        {
          platform: "github" as const,
          url: "https://github.com/MukeshRawat07",
        },
        {
          platform: "linkedin" as const,
          url: "https://www.linkedin.com/in/mukesh-singh-rawat-988a9a2b7/",
        },
        {
          platform: "twitter" as const,
          url: "https://twitter.com/mukeshrawat",
        },
        { platform: "portfolio" as const, url: "https://mukeshrawat.design" },
      ],
    },
    {
      id: 5,
      name: "Pawan Dasila",
      role: "Full Stack Developer & WebSocket Engineer",
      image: "/assets/pawan-bhai.png",
      description:
        "Develops real-time chat systems and matching algorithms that bring hearts together.",
      socialLinks: [
        { platform: "github" as const, url: "https://github.com/Pawandasila" },
        {
          platform: "linkedin" as const,
          url: "https://www.linkedin.com/in/pawan-dasila-92483b251/",
        },
        {
          platform: "twitter" as const,
          url: "https://twitter.com/pawandasila",
        },
        {
          platform: "portfolio" as const,
          url: "https://portfolio-sandy-seven-32.vercel.app/",
        },
      ],
    },
  ];
  const [showOceanModal, setShowOceanModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}  
      <section className="bg-primary-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary-900 mb-6 font-playfair">
            About Soulara
          </h1>
          <p className="text-xl text-primary-700 leading-relaxed font-sans">
            A soul-focused dating platform where meaningful connections bloom
            through personality compatibility and spiritual alignment
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-800 mb-6 font-playfair">
                Our Story
              </h2>
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                Soulara was born from a vision to revolutionize online dating by
                focusing on what truly matters—the soul. In a world of
                superficial swipes and endless matches, we believe that lasting
                love comes from deeper compatibility, shared values, and
                spiritual connection.
              </p>
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                Our advanced OCEAN personality assessment, combined with
                cutting-edge matching algorithms, helps you find someone who
                truly understands you. We&apos;re not just another dating
                app—we&apos;re a platform for souls seeking their perfect match
                through scientific compatibility and meaningful conversation.
              </p>
              <div className="bg-primary-100 p-6 rounded-lg border border-primary-200">
                <h3 className="text-xl font-semibold text-primary-800 mb-3">
                  Our Mission
                </h3>
                <p className="text-primary-700">
                  To create authentic connections through personality
                  compatibility, spiritual alignment, and soul-level matching,
                  helping people find lasting love that transcends the
                  superficial.
                </p>
              </div>
            </div>
            <div className="bg-primary-200 rounded-2xl p-8 text-center">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-300">
                  <h4 className="text-2xl font-bold text-primary-600">50K+</h4>
                  <p className="text-primary-700 text-sm">Active Users</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-300">
                  <h4 className="text-2xl font-bold text-primary-600">12K+</h4>
                  <p className="text-primary-700 text-sm">Success Stories</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-300">
                  <h4 className="text-2xl font-bold text-primary-600">95%</h4>
                  <p className="text-primary-700 text-sm">Compatibility Rate</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-300">
                  <h4 className="text-2xl font-bold text-primary-600">24/7</h4>
                  <p className="text-primary-700 text-sm">Live Chat Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-12 font-playfair">
            What Makes Soulara Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary-200">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4 text-center">
                OCEAN Personality Matching
              </h3>
              <p className="text-center text-foreground leading-relaxed">
                Our scientifically-backed personality assessment analyzes 5 key
                traits to find your most compatible matches based on
                psychological compatibility.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary-200">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4 text-center">
                Real-Time Chat System
              </h3>
              <p className="text-center text-foreground leading-relaxed">
                Connect instantly with your matches through our
                WebSocket-powered live chat, complete with typing indicators and
                message status updates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary-200">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4 text-center">
                Advanced Matching Algorithm
              </h3>
              <p className="text-center text-foreground leading-relaxed">
                Our smart algorithm considers personality traits, spiritual
                alignment, and lifestyle preferences to suggest truly compatible
                soul connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-12 font-playfair">
            Cutting-Edge Dating Technology
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-primary-800 mb-2">
                Progressive Web App
              </h4>
              <p className="text-sm text-muted-foreground">
                Native app experience right in your browser
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-primary-800 mb-2">
                Real-Time Updates
              </h4>
              <p className="text-sm text-muted-foreground">
                Instant notifications for matches and messages
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-primary-800 mb-2">
                Profile Verification
              </h4>
              <p className="text-sm text-muted-foreground">
                Verified profiles for authentic connections
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-primary-800 mb-2">
                Smart Search
              </h4>
              <p className="text-sm text-muted-foreground">
                AI-powered search with advanced filtering
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-cream py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-4 font-playfair">
            Meet Our Development Team
          </h2>
          <p className="text-xl text-center text-foreground mb-16 max-w-3xl mx-auto">
            The passionate developers behind Soulara&apos;s advanced matching
            technology and beautiful user experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10 place-items-center">
            {developers.map((developer) => (  
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-12 font-playfair">
            Why Choose Soulara?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                Scientific Matching
              </h3>
              <p className="text-foreground">
                OCEAN personality assessment with 95% compatibility accuracy for
                meaningful connections.
              </p>
            </div>

            <div className="text-center p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors">
              <div className="text-3xl mb-4">💕</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                Soul-Level Connections
              </h3>
              <p className="text-foreground">
                Beyond surface-level attraction—find someone who truly
                understands your soul.
              </p>
            </div>

            <div className="text-center p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                Safe & Secure
              </h3>
              <p className="text-foreground">
                Advanced verification, privacy controls, and secure messaging
                for peace of mind.
              </p>
            </div>

            <div className="text-center p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                Real-Time Experience
              </h3>
              <p className="text-foreground">
                Instant matches, live chat, and immediate notifications keep you
                connected.
              </p>
            </div>

            <div className="text-center p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                Quality Over Quantity
              </h3>
              <p className="text-foreground">
                Curated matches based on deep compatibility, not endless
                swiping.
              </p>
            </div>

            <div className="text-center p-6 border border-primary-200 rounded-lg hover:border-primary-400 transition-colors">
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">
                Success Stories
              </h3>
              <p className="text-foreground">
                Over 12,000 couples have found lasting love through
                Soulara&apos;s platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-primary-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-800 mb-12 font-playfair">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary-200">
              <h3 className="text-2xl font-semibold text-primary-700 mb-4">
                Authentic Connection
              </h3>
              <p className="text-foreground leading-relaxed">
                We believe in genuine relationships built on true compatibility,
                shared values, and emotional depth—not just physical attraction.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary-200">
              <h3 className="text-2xl font-semibold text-primary-700 mb-4">
                Scientific Approach
              </h3>
              <p className="text-foreground leading-relaxed">
                Our matching algorithms are based on proven psychological
                research and personality science for the most accurate
                compatibility scores.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary-200">
              <h3 className="text-2xl font-semibold text-primary-700 mb-4">
                Privacy & Safety
              </h3>
              <p className="text-foreground leading-relaxed">
                Your personal data, conversations, and profile information are
                protected with enterprise-grade security and strict privacy
                controls.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary-200">
              <h3 className="text-2xl font-semibold text-primary-700 mb-4">
                Inclusive Community
              </h3>
              <p className="text-foreground leading-relaxed">
                Love transcends boundaries—we welcome all individuals seeking
                meaningful relationships regardless of background, orientation,
                or beliefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-playfair">
            Ready to Find Your Soul Connection?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who discovered lasting love through
            Soulara&apos;s advanced matching technology. Your perfect match is
            waiting.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={() => setShowOceanModal(true)}
              className="bg-white text-primary-600 px-8 py-8 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors duration-200 shadow-lg w-full sm:w-auto"
            >
              Take Personality Test
            </Button>
            <Button onClick={() => alert('View Success Stories')} className="border-2 border-white text-white px-8 py-[30px] rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 w-full sm:w-auto">
              View Success Stories
            </Button>
          </div>
        </div>
      </section>

      <OceanModel
        isOpen={showOceanModal}
        onClose={() => setShowOceanModal(false)}
      />
    </div>
  );
};

export default AboutUsPage;
