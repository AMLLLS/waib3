import { Inter, Space_Grotesk, Poppins } from 'next/font/google'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'
import { ScrollProvider } from '@/components/providers/ScrollProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GridBackground from '@/components/effects/GridBackground'
import localFont from 'next/font/local'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap'
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap'
})

// Configuration corrigée des polices Aeonik
const aeonik = localFont({
  src: [
    {
      path: '../../public/fonts/Aeonik_Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik_Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik_Black.ttf',
      weight: '900',
      style: 'normal',
    }
  ],
  variable: '--font-aeonik'
})

export const metadata: Metadata = {
  title: 'DesignMaster | Plateforme d\'apprentissage immersive pour le Web Design',
  description: 'Découvrez l\'art du web design à travers une expérience d\'apprentissage unique et immersive.',
  keywords: ['web design', 'formation', 'design', 'apprentissage', 'UI/UX', 'digital'],
  authors: [{ name: 'DesignMaster' }],
  creator: 'DesignMaster',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://designmaster.com',
    title: 'DesignMaster | Plateforme d\'apprentissage immersive pour le Web Design',
    description: 'Découvrez l\'art du web design à travers une expérience d\'apprentissage unique et immersive.',
    siteName: 'DesignMaster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DesignMaster | Plateforme d\'apprentissage immersive pour le Web Design',
    description: 'Découvrez l\'art du web design à travers une expérience d\'apprentissage unique et immersive.',
    creator: '@designmaster',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#000000'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${aeonik.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-dark text-white antialiased font-aeonik">
        <ScrollProvider>
          <GridBackground />
          <Navbar />
          <main className="relative">
            {children}
          </main>
          <Footer />
        </ScrollProvider>
      </body>
    </html>
  )
} 