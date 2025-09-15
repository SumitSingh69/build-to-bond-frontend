import React from "react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary-200 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 p-4 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-colors">
          <div className="w-8 h-8 text-primary">{icon}</div>
        </div>
        <h3 className="font-playfair text-xl md:text-2xl font-bold text-foreground mb-4">
          {title}
        </h3>
        <p className="font-sans text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7L12 2z" />
        </svg>
      ),
      title: "Soul Compatibility",
      description:
        "Our unique algorithm analyzes your spiritual values, energy, and aura to find truly compatible souls for meaningful connections.",
    },
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 1L9 9H1l6 6-2 8 7-5 7 5-2-8 6-6h-8L12 1z" />
        </svg>
      ),
      title: "Verified Profiles",
      description:
        "Every profile is manually verified to ensure authenticity. Connect with real people who are serious about finding genuine relationships.",
    },
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
      title: "Global Connections",
      description:
        "Connect with like-minded souls from around the world. Our platform breaks geographical barriers to help you find your perfect match.",
    },
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 16H6V10h12v12zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
        </svg>
      ),
      title: "Privacy & Security",
      description:
        "Your privacy is our priority. Advanced encryption, secure messaging, and complete control over your visibility and data.",
    },
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      title: "Smart Matching",
      description:
        "AI-powered matching considers your personality, interests, lifestyle, and spiritual alignment to suggest the most compatible partners.",
    },
    {
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 18.5c-3.31 0-6-2.69-6-6 0-.34.04-.67.09-1h2.91v2h2v-2h2v2h2V9.59c.05.33.09.66.09 1 0 3.31-2.69 6-6 6z" />
        </svg>
      ),
      title: "Relationship Coaching",
      description:
        "Get personalized advice from our relationship experts. Free resources, tips, and guidance to help you build lasting connections.",
    },
  ];

  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-background"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 lg:mb-20">
          <h2
            id="features-heading"
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Why Choose Soulara?
          </h2>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience a new dimension of online dating with features designed
            to help you find authentic, meaningful connections that align with
            your soul.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="text-center mt-16 lg:mt-20">
          <div className="inline-flex items-center gap-3 text-primary font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>Join 100,000+ people finding meaningful connections</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
