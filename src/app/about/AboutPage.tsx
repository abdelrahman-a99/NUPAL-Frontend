'use client';

import { useState } from 'react';
import { features } from '@/data/features';

export function AboutPageContent() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollAmount = e.deltaY;
    container.scrollLeft += scrollAmount;
    setScrollPosition(container.scrollLeft);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* About Section */}
      <section className="relative bg-white py-24 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          {/* Header */}
          <div className="mb-20">
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                About Us
              </span>
              <div className="mt-2 h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl max-w-3xl leading-tight">
              NU PAL empowers everyone to build their academic success
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left Panel - University Image */}
            <div className="relative">
              <div className="relative overflow-hidden">
                {/* Gradient accent line */}
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 rounded-full" />
                
                <div className="relative ml-8">
                  <div className="relative overflow-hidden rounded-3xl">
                    <img
                      src="/nile4.jpg"
                      alt="Nile University Campus"
                      className="w-full h-auto object-cover rounded-3xl"
                      style={{ maxHeight: '600px' }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none rounded-3xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Text Content */}
            <div className="space-y-8">
              {/* First Paragraph */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <p className="text-lg leading-relaxed text-slate-700">
                    NU PAL is a cutting-edge academic advising platform that leverages artificial intelligence to transform how students navigate their educational journey. Our platform combines advanced machine learning algorithms with proven academic advising principles to deliver personalized, data-driven guidance that adapts to each student's unique goals and circumstances.
                  </p>
                </div>
              </div>

              {/* Second Paragraph */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  <p className="text-lg leading-relaxed text-slate-600">
                    We empower students to make confident, informed decisions about their academic path. Through intelligent course recommendations, comprehensive progress tracking, and intuitive semester planning tools, NU PAL eliminates the complexity and uncertainty from academic planning.
                  </p>
                </div>
              </div>

              {/* Feature highlights - Minimal style */}
              <div className="pt-8 border-t-2 border-slate-100">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">AI</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 text-sm font-bold">P</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Personalized</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-bold">C</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Comprehensive</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">I</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Intuitive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel Section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-slate-600">
              Discover the powerful tools that help you succeed
            </p>
          </div>

          {/* Scrollable Carousel */}
          <div
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
            onWheel={handleScroll}
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex-shrink-0 w-[320px] rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-4xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="mt-6 flex justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-300" />
            <div className="h-2 w-2 rounded-full bg-blue-300" />
            <div className="h-2 w-2 rounded-full bg-blue-300" />
          </div>
        </div>
      </section>
    </div>
  );
}

