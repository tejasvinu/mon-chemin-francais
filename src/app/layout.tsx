import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'
import { Montserrat } from 'next/font/google'
import NextAuthSessionProvider from './providers/SessionProvider'
import AuthHeader from './components/AuthHeader'
import { TTSProvider } from './components/TTSProvider'

// Initialize Montserrat font with subsets and display settings
const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'Mon Chemin Français',
  description: 'Your personalized journey to French fluency',
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NextAuthSessionProvider>
          <TTSProvider>
            <div className="min-h-screen flex flex-col">
              <AuthHeader />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </TTSProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string, children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <NavLink href="/vocabulary">Vocabulary</NavLink>
            <NavLink href="/flashcards">Flashcards</NavLink>
            <NavLink href="/grammar">Grammar</NavLink>
            <NavLink href="/stories">Stories</NavLink>
            <NavLink href="/explore/fun-stuff">Fun Stuff</NavLink>
          </div>
          <div className="mt-8 md:mt-0 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Mon Chemin Français. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}