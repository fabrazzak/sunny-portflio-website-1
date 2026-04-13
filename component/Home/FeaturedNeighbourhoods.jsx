"use client";

import Link from "next/link";
import { useState } from "react";

const neighborhoods = [
  {
    title: "SHAUGHNESSY",
    image: "/slider-1.jpg",
    link: "/communities/shaughnessy/"
  },
  {
    title: "PORT MOODY AREA",
    image: "/slider-2.jpg",
    link: "/communities/port-moody-area"
  },
  {
    title: "WEST VANCOUVER AREA",
    image: "/slider-3.jpg",
    link: "/communities/west-vancouver-area/"
  },
  {
    title: "BURNABY",
    image: "/slider-4.jpg",
    link: "/communities/kitsilano/"
  }
];

export default function FeaturedNeighbourhoods() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? neighborhoods.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= neighborhoods.length - 3 ? 0 : prev + 1));
  };

  // Get the three visible cards based on current index
  const visibleCards = [
    neighborhoods[currentIndex],
    neighborhoods[currentIndex + 1] || neighborhoods[0],
    neighborhoods[currentIndex + 2] || neighborhoods[1],
  ];

  // Staggered margin classes
  const staggerClasses = ["md:mt-32", "md:mt-16", "md:mt-0"];

  return (
    <section className="w-full bg-white py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Title Section */}
        <div className="flex items-start gap-4 mb-8 md:-mb-16">
          <div className="w-1 h-20 md:h-32 bg-black shrink-0"></div>
          <div>
            <p className="text-sm md:text-md tracking-widest text-black mb-1">FEATURED</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">NEIGHBOURHOODS</h2>
          </div>
        </div>

        {/* Cards Grid Container */}
        <div className="relative">
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="relative h-100 overflow-hidden">
              {neighborhoods.map((neighborhood, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="relative w-full h-full overflow-hidden shadow-lg">
                    <img
                      src={neighborhood.image}
                      alt={neighborhood.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Bottom overlay - always visible on mobile */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white py-4 px-4 text-center">
                      <h3 className="text-xl font-semibold tracking-widest">
                        {neighborhood.title}
                      </h3>
                      <Link 
                        href={neighborhood.link}
                        className="mt-2 text-white text-xs font-semibold tracking-widest inline-block hover:underline"
                      >
                        VIEW
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile Navigation Buttons */}
            <div className="flex justify-center items-center gap-8 mt-6">
              <button
                onClick={handlePrev}
                className="w-12 h-12 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                aria-label="Previous neighborhood"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              
              <div className="flex gap-2">
                {neighborhoods.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? 'bg-black' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="w-12 h-12 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                aria-label="Next neighborhood"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Cards Grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8 md:pr-16">
            {visibleCards.map((neighborhood, index) => (
              <div
                key={`${neighborhood.title}-${currentIndex}-${index}`}
                className={`relative md:h-[500px] ${staggerClasses[index]} transition-all duration-700 ease-in-out group`}
              >
                <div className="relative w-full h-full overflow-hidden shadow-2xl">
                  <img
                    src={neighborhood.image}
                    alt={neighborhood.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Default overlay - bottom */}
                  <div className="absolute bottom-6 left-0 right-0 bg-opacity-70 text-white py-5 text-center transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="text-2xl font-semibold tracking-widest">
                      {neighborhood.title}
                    </h3>
                  </div>

                  {/* Hover overlay - full card */}
                  <div className="absolute inset-0 bg-[#000000b4] bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between py-20 items-center text-center px-8">
                    <h3 className="text-white text-2xl font-bold tracking-wide mb-8">
                      {neighborhood.title}
                    </h3>
                    
                    <Link 
                      href={neighborhood.link}
                      className="text-white text-xs font-semibold tracking-widest cursor-pointer transition-all duration-300 hover:underline"
                    >
                      VIEW 
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Right Side Controls */}
          <div className="hidden md:block absolute right-0 top-20 flex flex-col items-center justify-between h-full">
            {/* Navigation Buttons */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handlePrev}
                className="w-10 h-10 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                aria-label="Previous neighborhood"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 cursor-pointer rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300"
                aria-label="Next neighborhood"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Vertical Line */}
            <div className="absolute left-1/2 h-[460px] top-30 bottom-0 w-px bg-black -ml-px"></div>
          </div>

          {/* View More Link */}
          <div className="mt-8 md:mt-0 md:absolute bottom-0 right-20 text-center md:text-right">
            <Link
              href="#"
              className="text-xs tracking-widest hover:underline font-bold transition-all duration-300"
            >
              VIEW MORE COMMUNITIES +
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}