import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Mon Chemin Français',
  description: 'Your personalized journey to French fluency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                </svg>
                Mon Chemin Français
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <NavLink href="/vocabulary">Vocabulary</NavLink>
              <NavLink href="/flashcards">Flashcards</NavLink>
              <NavLink href="/grammar">Grammar</NavLink>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <MobileMenuButton />
          </div>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ href, children }: { href: string, children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-700 transition-colors"
    >
      {children}
    </Link>
  )
}

function MobileMenuButton() {
  return (
    <button 
      type="button"
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      aria-controls="mobile-menu"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <Link href="/vocabulary" className="text-sm text-gray-500 hover:text-blue-600">
              Vocabulary
            </Link>
            <Link href="/flashcards" className="text-sm text-gray-500 hover:text-blue-600">
              Flashcards
            </Link>
            <Link href="/grammar" className="text-sm text-gray-500 hover:text-blue-600">
              Grammar
            </Link>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Mon Chemin Français
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
