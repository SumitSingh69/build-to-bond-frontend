import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Success Stories", href: "/success-stories" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Safety Tips", href: "/safety" },
        { name: "Contact Us", href: "/contact" },
        { name: "Community Guidelines", href: "/community" },
        { name: "Report Issues", href: "/report" },
        { name: "Account Settings", href: "/settings" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Data Protection", href: "/data-protection" },
        { name: "Refund Policy", href: "/refunds" },
        { name: "Accessibility", href: "/accessibility" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/soulara",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/soulara",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.017 0C8.396 0 7.929.01 7.519.048 4.57.264 2.25 2.584 2.034 5.533.996 6.905.983 7.462.983 12.017s.013 5.112 1.051 6.484c.216 2.949 2.536 5.269 5.485 5.485 1.372 1.038 1.929 1.051 6.484 1.051s5.112-.013 6.484-1.051c2.949-.216 5.269-2.536 5.485-5.485 1.038-1.372 1.051-1.929 1.051-6.484s-.013-5.112-1.051-6.484C21.756 2.584 19.436.264 16.487.048 15.115.996 14.558.983 12.017.983L12.017 0zm-.117 5.4c-3.71 0-6.7 3.006-6.7 6.7s2.99 6.7 6.7 6.7 6.7-3.006 6.7-6.7-2.99-6.7-6.7-6.7zm0 11.1c-2.43 0-4.4-1.97-4.4-4.4s1.97-4.4 4.4-4.4 4.4 1.97 4.4 4.4-1.97 4.4-4.4 4.4zm8.6-11.4c-.87 0-1.6-.73-1.6-1.6s.73-1.6 1.6-1.6 1.6.73 1.6 1.6-.73 1.6-1.6 1.6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/soulara",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/soulara",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className="bg-gradient-to-b from-background to-primary-50 border-t border-border"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">
                  <span className="font-playfair text-primary">Soul</span>
                  <span className="font-marcellus text-foreground">ara</span>
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Find Your Soul Connection
                </p>
              </div>

              <p className="font-sans text-muted-foreground leading-relaxed mb-6 max-w-md">
                Where souls meet and auras align. Join thousands of people who
                have found meaningful relationships through authentic
                connections on Soulara.
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Stay Connected
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                    aria-label="Email address for newsletter subscription"
                  />
                  <Button
                    className="bg-primary hover:bg-primary-600 text-white px-6 rounded-lg font-medium transition-colors"
                    aria-label="Subscribe to newsletter"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get dating tips, success stories, and updates delivered to
                  your inbox.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary-50"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-foreground mb-4 text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              <p>&copy; {currentYear} Soulara. All rights reserved.</p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="/accessibility"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>100% Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Trusted by 100K+ Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-10 w-2 h-2 bg-primary-300 rounded-full opacity-30 animate-pulse"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-16 w-3 h-3 bg-cream rounded-full opacity-40 animate-pulse delay-1000"
        aria-hidden="true"
      />
    </footer>
  );
};

export default Footer;
