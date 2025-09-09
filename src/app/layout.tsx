import type { Metadata } from "next";
import { Roboto, Playfair_Display, Plus_Jakarta_Sans, Lora, IBM_Plex_Mono, Marcellus, Montserrat, Homemade_Apple } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { TokenManager } from "@/components/TokenManager";
import { Toaster } from "@/components/ui/sonner"

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const homemadeApple = Homemade_Apple({
  variable: "--font-homemade-apple",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Soulara - Find Your Perfect Match | Dating App for Meaningful Connections",
    template: "%s | Soulara"
  },
  description: "Join Soulara, the premium dating app where authentic connections bloom. Find your soulmate through meaningful conversations and shared values. Safe, secure, and designed for lasting relationships.",
  keywords: [
    "dating app",
    "relationships",
    "soulmate",
    "meaningful connections",
    "online dating",
    "love",
    "romance",
    "authentic dating",
    "serious relationships",
    "match",
    "dating platform",
    "singles"
  ],
  authors: [{ name: "Soulara Team" }],
  creator: "Soulara",
  publisher: "Soulara",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://soulara.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soulara - Find Your Perfect Match",
    description: "Join Soulara, the premium dating app where authentic connections bloom. Find your soulmate through meaningful conversations and shared values.",
    url: "https://soulara.com",
    siteName: "Soulara",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Soulara - Find Your Perfect Match",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soulara - Find Your Perfect Match",
    description: "Join Soulara, the premium dating app where authentic connections bloom. Find your soulmate through meaningful conversations and shared values.",
    images: ["/twitter-image.jpg"],
    creator: "@SoularaApp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code",
  },
  category: "technology",
  classification: "Dating App",
  referrer: "origin-when-cross-origin",
  applicationName: "Soulara",
  appleWebApp: {
    title: "Soulara",
    statusBarStyle: "default",
    capable: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#da532c",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${roboto.variable} ${playfairDisplay.variable} ${plusJakartaSans.variable} ${lora.variable} ${ibmPlexMono.variable} ${marcellus.variable} ${montserrat.variable} ${homemadeApple.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TokenManager />
            <div id="app-root" className="min-h-screen">
              {children}
              <Toaster richColors/>
            </div>
          </AuthProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Soulara",
              "description": "Premium dating app where authentic connections bloom. Find your soulmate through meaningful conversations and shared values.",
              "url": "https://soulara.com",
              "applicationCategory": "Social",
              "operatingSystem": "Web, iOS, Android",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "12847"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
