// src/app/page.tsx
'use client';

import Link from 'next/link';
import { BookOpenIcon, SparklesIcon, AcademicCapIcon, LanguageIcon, StarIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function Home() {
  // Animation states
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    setAnimateHero(true);
    
    // Optional: Parallax effect on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const speed = Number(element.dataset.speed || 0.3);
        element.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-hidden font-['Montserrat']"> 
      {/* Artistic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-600 z-0">
          <div className="absolute inset-0 mix-blend-soft-light opacity-30">
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
                </pattern>
                <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="500" cy="500" r="300" fill="url(#gradA)" className="parallax" data-speed="-0.2" />
              <path d="M600,200 Q900,400 600,800 T300,500" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" className="parallax" data-speed="0.3" />
            </svg>
          </div>
          
          {/* Eiffel Tower silhouette - abstract hint */}
          <svg className="absolute right-0 bottom-0 h-full opacity-10" viewBox="0 0 300 800" preserveAspectRatio="xMinYMax meet">
            <path d="M150,0 L200,600 L250,600 L230,700 L170,700 L150,800 L130,700 L70,700 L50,600 L100,600 Z" fill="white" />
            <rect x="120" y="200" width="60" height="10" fill="white" opacity="0.5" />
            <rect x="110" y="400" width="80" height="15" fill="white" opacity="0.5" />
            <rect x="90" y="600" width="120" height="20" fill="white" opacity="0.7" />
          </svg>
        </div>

        {/* Content container */}
        <div className={`relative max-w-7xl mx-auto px-6 py-32 text-center z-10 transition-all duration-1000 ease-out transform ${animateHero ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="relative inline-block">
            <span className="absolute -inset-1 rounded-lg bg-white/30 blur-xl"></span>
            <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white">
              <span className="text-blue-200">Mon</span> Chemin <span className="text-red-300">Français</span>
            </h1>
          </div>
          
          {/* Abstract text underline */}
          <div className="relative h-2 w-48 md:w-80 mx-auto my-8">
            <div className="absolute inset-0 bg-blue-300 rounded-full transform -skew-x-12"></div>
            <div className="absolute inset-0 left-24 bg-white rounded-full transform skew-x-12"></div>
            <div className="absolute inset-0 left-48 bg-red-300 rounded-full transform -skew-x-12"></div>
          </div>
          
          <p className="mt-8 text-xl leading-8 text-blue-100 max-w-3xl mx-auto font-light">
            <span className="font-semibold text-white">Discover</span> your unique journey through the language of 
            <span className="italic font-medium"> Liberté, Égalité, Fraternité</span>. 
            A learning experience as <span className="font-semibold text-white">distinctive</span> as you are.
          </p>
          
          <div className="mt-14 flex items-center justify-center gap-x-8 flex-wrap">
            <Link
              href="/vocabulary"
              className="group relative px-8 py-4 rounded-none overflow-hidden border-2 border-white text-white font-medium transition-all hover:text-blue-900 hover:border-transparent"
            >
              <span className="absolute inset-0 bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              <span className="relative">Commencer Votre Voyage</span>
            </Link>
            <Link
              href="/flashcards"
              className="group relative px-5 py-3 text-white hover:text-blue-200 transition-colors duration-300 flex items-center"
            >
              <span>Discover Flashcards</span>
              <div className="ml-2 group-hover:translate-x-2 transition-transform duration-300">
                <svg width="20" height="10" viewBox="0 0 20 10" className="stroke-current">
                  <path d="M15 1l5 4-5 4M0 5h19" fill="none" strokeWidth="1.5" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full border-4 border-white/20 animate-float-slow parallax" data-speed="-0.1"></div>
          <div className="absolute top-3/4 right-1/3 w-16 h-16 rounded-full bg-red-400/20 animate-float-medium parallax" data-speed="0.2"></div>
          <div className="absolute top-2/3 left-1/5 w-32 h-8 bg-blue-300/20 transform rotate-45 animate-float-fast parallax" data-speed="-0.15"></div>
        </div>
      </section>

      {/* Artistic Feature Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full" preserveAspectRatio="none">
            <pattern id="circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#1e40af" opacity="0.3" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circles)" />
          </svg>
          
          {/* Abstract lines suggesting a language path */}
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,30 Q25,10 50,30 T100,30" stroke="#1e40af" strokeWidth="0.1" fill="none" />
            <path d="M0,50 Q25,30 50,50 T100,50" stroke="#1e40af" strokeWidth="0.1" fill="none" />
            <path d="M0,70 Q25,50 50,70 T100,70" stroke="#1e40af" strokeWidth="0.1" fill="none" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-24">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-800 mb-6">
              <StarIcon className="h-4 w-4 mr-2" />
              <span>Learning Modules</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Artfully Crafted <span className="text-blue-700">Learning Experience</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Navigate through our elegantly designed learning modules, each one a stepping stone on your path to French fluency.
            </p>
          </div>

          {/* Feature Cards - Abstract design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {/* Vocabulary Module */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative p-8 bg-white rounded-lg backdrop-blur-sm shadow-md overflow-hidden">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <BookOpenIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="mt-8 text-2xl font-bold text-gray-900 tracking-tight">Le Lexique</h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  A curated collection of essential French vocabulary, arranged in thematic constellations for intuitive acquisition.
                </p>
                
                <div className="mt-6 h-0.5 w-full bg-gradient-to-r from-blue-100 to-transparent"></div>
                
                <Link
                  href="/vocabulary"
                  className="mt-6 inline-flex items-center text-blue-700 font-medium group-hover:text-blue-500 transition-colors"
                >
                  <span>Explore Words</span>
                  <span className="relative ml-2 overflow-hidden inline-block h-5 w-5">
                    <span className="absolute inset-0 transition-transform duration-300 transform translate-x-0 group-hover:translate-x-full">→</span>
                    <span className="absolute inset-0 transition-transform duration-300 transform -translate-x-full group-hover:translate-x-0">→</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Flashcards Module */}
            <div className="group relative mt-10 md:mt-16">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-100 to-purple-50 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative p-8 bg-white rounded-lg backdrop-blur-sm shadow-md overflow-hidden">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center transform rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="mt-8 text-2xl font-bold text-gray-900 tracking-tight">Mémoire Adaptive</h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Intelligent flashcard system that adapts to your learning rhythm, reinforcing neural pathways through algorithmic repetition.
                </p>
                
                <div className="mt-6 h-0.5 w-full bg-gradient-to-r from-indigo-100 to-transparent"></div>
                
                <Link
                  href="/flashcards"
                  className="mt-6 inline-flex items-center text-indigo-700 font-medium group-hover:text-indigo-500 transition-colors"
                >
                  <span>Train Memory</span>
                  <span className="relative ml-2 overflow-hidden inline-block h-5 w-5">
                    <span className="absolute inset-0 transition-transform duration-300 transform translate-x-0 group-hover:translate-x-full">→</span>
                    <span className="absolute inset-0 transition-transform duration-300 transform -translate-x-full group-hover:translate-x-0">→</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* Grammar Module */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative p-8 bg-white rounded-lg backdrop-blur-sm shadow-md overflow-hidden">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-red-500 to-amber-400 flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="mt-8 text-2xl font-bold text-gray-900 tracking-tight">La Structure</h3>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Decode the architectural elegance of French grammar through visual frameworks and conceptual patterns.
                </p>
                
                <div className="mt-6 h-0.5 w-full bg-gradient-to-r from-red-100 to-transparent"></div>
                
                <Link
                  href="/grammar"
                  className="mt-6 inline-flex items-center text-red-600 font-medium group-hover:text-red-500 transition-colors"
                >
                  <span>Master Form</span>
                  <span className="relative ml-2 overflow-hidden inline-block h-5 w-5">
                    <span className="absolute inset-0 transition-transform duration-300 transform translate-x-0 group-hover:translate-x-full">→</span>
                    <span className="absolute inset-0 transition-transform duration-300 transform -translate-x-full group-hover:translate-x-0">→</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artistic CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900">
          {/* Abstract bézier curves suggesting speech/sound waves */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <path d="M0,100 C150,180 350,0 500,100 C650,200 850,60 1000,100" stroke="white" strokeWidth="2" fill="none" opacity="0.07" />
            <path d="M0,150 C150,80 350,200 500,150 C650,100 850,240 1000,150" stroke="white" strokeWidth="3" fill="none" opacity="0.05" />
            <path d="M0,200 C150,280 350,100 500,200 C650,300 850,160 1000,200" stroke="white" strokeWidth="2" fill="none" opacity="0.03" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto py-20 md:py-28 lg:py-36 px-6 lg:px-8 lg:flex lg:items-center lg:justify-between z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready for linguistic transformation?</span>
              <span className="block text-blue-200 mt-1 italic">C'est le moment de commencer.</span>
            </h2>
            <p className="mt-6 text-lg text-blue-100 max-w-xl">
              Embark on a journey designed not just to teach French, but to cultivate a profound connection with its cultural essence and poetic structure.
            </p>
          </div>
          
          <div className="mt-10 lg:mt-0 lg:flex-shrink-0">
            <Link
              href="/vocabulary"
              className="group relative inline-flex"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-pink-500 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-semibold text-blue-700 hover:bg-blue-50 transition-colors duration-300"
              >
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
