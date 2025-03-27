'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-blue-900 sm:text-5xl md:text-6xl">
            Mon Chemin Français
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl">
            Your personalized journey to French fluency
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/vocabulary" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Start Learning
            </Link>
            <Link href="/flashcards" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10">
              Review Flashcards
            </Link>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to master French
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Vocabulary Feature */}
              <div className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="absolute -top-3 -left-3 bg-blue-100 rounded-full p-3">
                  <Image src="/file.svg" alt="Vocabulary" width={24} height={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 pt-2">Vocabulary Builder</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create and organize your personalized French vocabulary lists with examples.
                </p>
                <Link href="/vocabulary" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500">
                  Explore Vocabulary &rarr;
                </Link>
              </div>

              {/* Flashcards Feature */}
              <div className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="absolute -top-3 -left-3 bg-blue-100 rounded-full p-3">
                  <Image src="/window.svg" alt="Flashcards" width={24} height={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 pt-2">Spaced Repetition</h3>
                <p className="mt-2 text-base text-gray-500">
                  Review vocabulary with a scientifically proven spaced repetition system.
                </p>
                <Link href="/flashcards" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500">
                  Practice Flashcards &rarr;
                </Link>
              </div>

              {/* Grammar Feature */}
              <div className="relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="absolute -top-3 -left-3 bg-blue-100 rounded-full p-3">
                  <Image src="/globe.svg" alt="Grammar" width={24} height={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 pt-2">Grammar Notes</h3>
                <p className="mt-2 text-base text-gray-500">
                  Master French grammar with clear explanations and practical examples.
                </p>
                <Link href="/grammar" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500">
                  Learn Grammar &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to improve your French?</span>
            <span className="block text-blue-200">Start your learning journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/vocabulary" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
