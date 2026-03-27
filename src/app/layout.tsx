import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Cine Magic Creations - Premium Wedding Photography & Films | Jaffna, Sri Lanka",
  description: "Professional wedding photography and cinematography services in Jaffna, Sri Lanka. Capturing love, stories, and moments with artistic excellence. Book your consultation today!",
  keywords: "wedding photography, wedding films, cinematography, Jaffna, Sri Lanka, wedding photographer, graduation photography, engagement photography",
  authors: [{ name: "Cine Magic Creations" }],
  creator: "Cine Magic Creations",
  publisher: "Cine Magic Creations",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cinemagiccreations.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Cine Magic Creations - Premium Wedding Photography & Films",
    description: "Professional wedding photography and cinematography services in Jaffna, Sri Lanka. Capturing love, stories, and moments with artistic excellence.",
    url: 'https://cinemagiccreations.com',
    siteName: 'Cine Magic Creations',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cine Magic Creations - Wedding Photography',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cine Magic Creations - Premium Wedding Photography & Films",
    description: "Professional wedding photography and cinematography services in Jaffna, Sri Lanka.",
    images: ['/images/og-image.jpg'],
    creator: '@cine_magic_creations',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ED4001" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Cine Magic Creations",
              "description": "Professional wedding photography and cinematography services in Jaffna, Sri Lanka",
              "url": "https://cinemagiccreations.com",
              "telephone": "+94 77 621 6556",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jaffna",
                "addressCountry": "Sri Lanka"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "9.6615",
                "longitude": "80.0255"
              },
              "openingHours": "Mo-Su 09:00-18:00",
              "priceRange": "$$",
              "image": "https://cinemagiccreations.com/images/logo.jpg",
              "sameAs": [
                "https://instagram.com/cine_magic_creations"
              ],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": "9.6615",
                  "longitude": "80.0255"
                },
                "geoRadius": "100000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Wedding Photography Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Wedding Photography",
                      "description": "Professional wedding photography services"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Wedding Films",
                      "description": "Cinematic wedding videography services"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Graduation Photography",
                      "description": "Graduation ceremony photography services"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50 text-slate-900 dark:bg-cosmic-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <WhatsAppFloat />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}