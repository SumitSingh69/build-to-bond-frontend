"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const faqItems: FAQItem[] = [
    {
      question: "How does soul compatibility matching work?",
      answer:
        "Our proprietary algorithm combines personality assessments, spiritual values, life goals, and astrological compatibility to create a unique soul profile. We then match you with people who have complementary energy patterns and shared spiritual perspectives, increasing the likelihood of deep, meaningful connections.",
    },
    {
      question: "What makes Soulara different from other dating apps?",
      answer:
        "Unlike traditional dating apps that focus on appearance or basic preferences, Soulara prioritizes spiritual and emotional compatibility. We verify all profiles, offer relationship coaching, include aura reading features, and focus on long-term partnerships rather than casual dating. Our community is built for people seeking authentic, soulmate-level connections.",
    },
    {
      question: "How do you verify profiles?",
      answer:
        "Every profile goes through a multi-step verification process including photo verification, social media cross-referencing, and identity confirmation. Premium members receive enhanced verification badges. This ensures you're connecting with real people who are genuinely seeking meaningful relationships.",
    },
    {
      question: "Can I use Soulara for free?",
      answer:
        "Yes! Our free plan includes basic profile creation, 5 daily matches, standard messaging, and basic compatibility insights. You can explore the platform and start making connections without any cost. Premium plans unlock advanced features like unlimited messaging, detailed aura readings, and relationship coaching.",
    },
    {
      question: "What is aura compatibility and how accurate is it?",
      answer:
        "Aura compatibility analyzes your energy patterns, emotional frequencies, and spiritual alignment through our assessment questionnaire. While we can't scientifically measure auras, our algorithm translates your responses into energy profiles that help predict emotional and spiritual compatibility. Many users report highly accurate matches using this feature.",
    },
    {
      question: "Do you offer relationship coaching?",
      answer:
        "Yes! Premium Soul and Cosmic Connection members get access to certified relationship coaches who specialize in spiritual partnerships. They provide guidance on communication, conflict resolution, spiritual growth together, and preparing for long-term commitment. Cosmic members receive personalized one-on-one coaching sessions.",
    },
    {
      question: "Is Soulara available worldwide?",
      answer:
        "Soulara is available in over 50 countries and supports multiple languages. Our global community allows you to connect with soulmates anywhere in the world. We also offer location-based preferences if you prefer to meet someone locally.",
    },
    {
      question: "How private and secure is my information?",
      answer:
        "Your privacy is our top priority. We use bank-level encryption, never sell your data, and give you complete control over your privacy settings. You can choose who sees your profile, control message permissions, and even browse in incognito mode. All payment information is processed through secure, encrypted channels.",
    },
    {
      question: "What if I don't find my soulmate?",
      answer:
        "We offer a 30-day money-back guarantee for premium subscriptions. Additionally, our success team works with members who aren't finding quality matches to optimize their profiles and matching preferences. Remember, finding your soulmate is a journey - we're here to support you every step of the way.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription anytime through your account settings or by contacting our support team. There are no cancellation fees, and you'll continue to have access to premium features until the end of your billing period. We also offer pause options if you need a temporary break.",
    },
    {
      question: "Can I connect my social media accounts?",
      answer:
        "You can optionally connect select social media accounts for enhanced profile verification and to showcase more of your personality. This is completely optional and helps other users get a better sense of your authentic self. You control exactly what information is shared.",
    },
    {
      question: "What age groups use Soulara?",
      answer:
        "Soulara is designed for adults 18+ who are serious about finding meaningful relationships. Our largest user groups are ages 25-45, but we welcome anyone seeking authentic spiritual connections regardless of age. Our compatibility matching works across all age preferences you set.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-background"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 lg:mb-20">
          <h2
            id="faq-heading"
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about finding your soulmate on Soulara.
            Can&apos;t find what you&apos;re looking for? Contact our support
            team.
          </p>
        </header>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <span className="font-semibold text-foreground text-lg pr-4">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
            <h3 className="font-playfair text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Our support team is here to help you on your journey to finding
              your soulmate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@soulara.com"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="bg-background border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
