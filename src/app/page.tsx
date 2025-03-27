// src/app/page.tsx
'use client';

import Link from 'next/link';
// Suggestion: Use an icon library like Heroicons for cleaner icons
import { BookOpenIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/24/outline'; // Example using Heroicons (install @heroicons/react)

export default function Home() {
  return (
    <div className="overflow-hidden"> {/* Prevents horizontal scroll from animations */}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-24 sm:py-32 lg:py-40">
        {/* Subtle background elements (optional) */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-blue-200/30 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-blue-50/20">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-blue-900 sm:text-6xl lg:text-7xl">
            Mon Chemin Français
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700 sm:text-xl max-w-3xl mx-auto">
            Your personalized and engaging path to mastering the French language. Build vocabulary, understand grammar, and retain knowledge effectively.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/vocabulary"
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors duration-300"
            >
              Start Building Vocabulary
            </Link>
            <Link
              href="/flashcards"
              className="text-base font-semibold leading-6 text-blue-800 hover:text-blue-600 transition-colors duration-300"
            >
              Review Flashcards <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-base font-semibold leading-7 text-blue-600">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tools Designed for Fluency
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Leverage proven techniques and track your progress seamlessly.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 max-w-none mx-auto">
            {/* Feature 1: Vocabulary Builder */}
            <div className="group relative flex flex-col items-center text-center p-8 bg-gray-50 rounded-xl shadow-sm border border-gray-200/50 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
               <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-5 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                 <BookOpenIcon className="h-7 w-7" aria-hidden="true" />
               </div>
               <h3 className="text-xl font-semibold leading-7 text-gray-900">Vocabulary Builder</h3>
               <p className="mt-2 text-base leading-7 text-gray-600">
                 Create and manage personalized French vocabulary lists with definitions and example sentences.
               </p>
               <Link href="/vocabulary" className="mt-4 text-sm font-semibold text-blue-600 stretched-link group-hover:text-blue-800 transition-colors">
                 Explore Vocabulary <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
               </Link>
            </div>

            {/* Feature 2: Spaced Repetition */}
            <div className="group relative flex flex-col items-center text-center p-8 bg-gray-50 rounded-xl shadow-sm border border-gray-200/50 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-5 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <SparklesIcon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-gray-900">Smart Flashcards</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Master words efficiently using a spaced repetition system (SRS) scientifically proven to enhance memory retention.
              </p>
              <Link href="/flashcards" className="mt-4 text-sm font-semibold text-blue-600 stretched-link group-hover:text-blue-800 transition-colors">
                Practice Flashcards <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Feature 3: Grammar Notes */}
            <div className="group relative flex flex-col items-center text-center p-8 bg-gray-50 rounded-xl shadow-sm border border-gray-200/50 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-5 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <AcademicCapIcon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold leading-7 text-gray-900">Grammar Guide</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Understand French grammar concepts with clear explanations, practical examples, and easy organization.
              </p>
              <Link href="/grammar" className="mt-4 text-sm font-semibold text-blue-600 stretched-link group-hover:text-blue-800 transition-colors">
                Learn Grammar <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-6 sm:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to accelerate your French learning?</span>
            <span className="block text-blue-200 mt-1">Start your journey with Mon Chemin Français today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/vocabulary"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-semibold text-blue-700 hover:bg-blue-50 transition-colors duration-300"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
