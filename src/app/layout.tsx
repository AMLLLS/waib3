import { Inter, Space_Grotesk, Poppins } from 'next/font/google'
import { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import localFont from 'next/font/local'
import { LoaderProvider } from '@/components/providers/LoaderProvider'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

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

const serathine = localFont({
  src: [
    {
      path: '../../public/fonts/Sanikata.otf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-serathine',
  display: 'block',
  preload: true,
  fallback: ['system-ui', 'arial']
})

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
  title: 'WAIB 3.0',
  description: 'Plateforme de formation WAIB',
  keywords: ['web design', 'formation', 'design', 'apprentissage', 'UI/UX', 'digital'],
  authors: [{ name: 'WAIB' }],
  creator: 'WAIB',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'WAIB 3.0',
    description: 'Plateforme de formation WAIB',
    url: 'http://localhost:3000',
    siteName: 'WAIB 3.0',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    title: 'WAIB 3.0',
    description: 'Plateforme de formation WAIB',
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${aeonik.variable} ${poppins.variable} ${serathine.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-dark text-white antialiased font-aeonik">
        <Providers>
          <LoaderProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1F2937',
                  color: '#fff',
                  borderRadius: '0.75rem',
                },
              }}
            />
          </LoaderProvider>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
} 