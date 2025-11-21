'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { services } from '@/data/services';
import { features } from '@/data/features';

/**
 * Home Page Component
 * Displays hero section with background image and services section with interactive tabs and accordion
 */
export default function Home() {
  const [activeService, setActiveService] = useState(services[0].id);
  const [openService, setOpenService] = useState<string | null>(services[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open services accordion when scrolling to services section from navbar
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#services') {
        // Ensure first service is open
        setActiveService(services[0].id);
        setOpenService(services[0].id);
        
        // Smooth scroll to services section
        setTimeout(() => {
          const servicesSection = document.getElementById('services');
          if (servicesSection) {
            const offset = 100; // Account for navbar height
            const elementPosition = servicesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else if (!window.location.hash) {
        // If no hash, scroll to top and close services
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Only listen to hash changes, don't trigger on mount
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  /**
   * Handles service tab change - updates active service and triggers transition
   */
  const handleServiceChange = (serviceId: string) => {
    if (serviceId === activeService || isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveService(serviceId);
    setOpenService(serviceId);
    setTimeout(() => setIsTransitioning(false), 50);
  };

  /**
   * Handles accordion toggle for service details
   */
  const handleServiceToggle = (serviceId: string) => {
    if (isTransitioning) return;
    
    if (openService === serviceId) {
      setOpenService(null);
    } else {
      setActiveService(serviceId);
      setOpenService(serviceId);
    }
  };

  /**
   * Handles form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
      // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Thank you for contacting us! Our academic advisors will get back to you soon.');
      setFormData({
        studentName: '',
        studentEmail: '',
        studentId: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      {/* Hero Section */}
      <main className="relative isolate w-full overflow-hidden px-20 py-20 sm:px-20">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[0.05px]"
          style={{
            backgroundImage: "url('/nile%202.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/30" />

        <section className="relative z-10 flex min-h-[70vh] w-full flex-col justify-center gap-10 py-10">
          <div className="max-w-3xl space-y-8 text-left">
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your Academic Journey,{" "}
              <span className="text-blue-600">
                Simplified
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-700 lg:text-xl">
              AI-powered academic advising platform that helps you plan your courses, track your progress, and achieve
              your educational goals with confidence.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-lg bg-blue-600 px-10 py-3 text-base font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-700">
                GET STARTED
              </button>
              <button className="rounded-2xl border-2 border-blue-600 bg-white/80 px-10 py-3 text-base font-semibold text-blue-600 backdrop-blur transition-colors duration-200 hover:bg-blue-50">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Services Section */}
      <section id="services" className="bg-white pb-16">
        {/* Tab Navigation - Centered (Not Sticky) */}
        <div className="border-b border-blue-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-wrap justify-center gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceChange(service.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold uppercase transition-all duration-200 ${
                    activeService === service.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content with Accordion */}
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
            {/* Left Side - Accordion */}
            <div className="space-y-0 border-r border-blue-200 pr-8">
              {services.map((service) => {
                const isOpen = openService === service.id;
                return (
                  <div key={service.id} className="border-b border-blue-200">
                    <button
                      onClick={() => handleServiceToggle(service.id)}
                      className="flex w-full items-center justify-between py-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-1 w-1 rounded-full transition-all duration-300 ${
                          isOpen ? 'h-12 w-1 bg-blue-600' : 'bg-blue-300'
                        }`} />
                        <h3 className="text-xl font-bold text-slate-900">
                          {service.title}
                        </h3>
                      </div>
                      <svg
                        className={`h-5 w-5 text-slate-600 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pb-6 pl-5">
                        <p className="mb-4 text-base leading-relaxed text-slate-600">
                          {service.description}
                        </p>
                        <a
                          href="#"
                          className="text-sm font-semibold text-indigo-600 underline hover:text-indigo-700"
                        >
                          Take a guided tour
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side - Image with Transition from Right */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ml-8 shadow-xl" style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 25%, #e0e7ff 50%, #ddd6fe 75%, #f3e8ff 100%)',
              backgroundSize: '400% 400%',
              animation: 'gradient 20s ease infinite'
            }}>
              {services.map((service) => {
                const isActive = activeService === service.id;
                const serviceIndex = services.findIndex(s => s.id === service.id);
                const activeIndex = services.findIndex(s => s.id === activeService);
                
                // Calculate z-index: active is highest, previous images stay visible underneath
                let zIndex = 0;
                if (isActive) {
                  zIndex = 30;
                } else if (serviceIndex < activeIndex) {
                  zIndex = 10; // Previous images stay visible underneath
                } else {
                  zIndex = 20; // Next images come from right
                }

                // Calculate transform: active is center, previous stay visible, next come from right
                let translateX = '100%'; // Default: off screen right
                if (isActive) {
                  translateX = '0%'; // Active image is centered
                } else if (serviceIndex < activeIndex) {
                  translateX = '0%'; // Previous images stay in place (visible underneath)
                }

                return (
                  <div
                    key={service.id}
                    className="absolute inset-0 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(${translateX})`,
                      zIndex: zIndex,
                    }}
                  >
                    <div 
                      className="absolute inset-0 bg-white/98 backdrop-blur-sm rounded-2xl p-[15px] shadow-xl"
                      style={{
                        background: 'linear-gradient(to bottom, #dbeafe 0%, #2563eb 100%)',
                      }}
                    >
                      <div className="h-full w-full bg-white/98 backdrop-blur-sm overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Carousel Section */}
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

          {/* Auto-scrolling Carousel with Hover Pause */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-6"
              style={{
                animation: 'scroll 30s linear infinite',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = 'paused';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = 'running';
              }}
            >
              {/* First set of features */}
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
              {/* Duplicate set for seamless loop */}
              {features.map((feature) => (
                <div
                  key={`duplicate-${feature.id}`}
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
          </div>


        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative bg-white py-24 overflow-hidden">
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

      {/* Contact Section */}
      <section id="contact" className="bg-white py-20 relative overflow-hidden">
        {/* Nile Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 h-[700px] overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 1440 700"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* First Wave Layer */}
            <path
              d="M0,200L60,190C120,180,240,160,360,150C480,140,600,140,720,155C840,170,960,200,1080,210C1200,220,1320,210,1380,205L1440,200L1440,700L1380,700C1320,700,1200,700,1080,700C960,700,840,700,720,700C600,700,480,700,360,700C240,700,120,700,60,700L0,700Z"
              fill="url(#gradient1-home)"
            />
            {/* Second Wave Layer */}
            <path
              d="M0,250L40,245C80,240,160,230,240,225C320,220,400,220,480,230C560,240,640,260,720,270C800,280,880,280,960,275C1040,270,1120,260,1200,255C1280,250,1360,250,1400,250L1440,250L1440,700L1400,700C1360,700,1280,700,1200,700C1120,700,1040,700,960,700C880,700,800,700,720,700C640,700,560,700,480,700C400,700,320,700,240,700C160,700,80,700,40,700L0,700Z"
              fill="url(#gradient2-home)"
            />
            {/* Third Wave Layer */}
            <path
              d="M0,300L50,295C100,290,200,280,300,275C400,270,500,270,600,280C700,290,800,310,900,320C1000,330,1100,330,1200,325C1300,320,1400,310,1450,305L1500,300L1500,700L1450,700C1400,700,1300,700,1200,700C1100,700,1000,700,900,700C800,700,700,700,600,700C500,700,400,700,300,700C200,700,100,700,50,700L0,700Z"
              fill="url(#gradient3-home)"
            />
            {/* Fourth Wave Layer */}
            <path
              d="M0,350L30,348C60,346,120,342,180,340C240,338,300,338,360,342C420,346,480,354,540,358C600,362,660,362,720,360C780,358,840,354,900,352C960,350,1020,350,1080,352C1140,354,1200,358,1260,360C1320,362,1380,362,1410,362L1440,362L1440,700L1410,700C1380,700,1320,700,1260,700C1200,700,1140,700,1080,700C1020,700,960,700,900,700C840,700,780,700,720,700C660,700,600,700,540,700C480,700,420,700,360,700C300,700,240,700,180,700C120,700,60,700,30,700L0,700Z"
              fill="url(#gradient4-home)"
            />
            <defs>
              <linearGradient id="gradient1-home" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id="gradient2-home" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gradient3-home" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="gradient4-home" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <div className="rounded-2xl bg-white p-8 shadow-xl sm:p-12">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                Contact Us
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Have questions about your academic journey? Need help with course planning or academic advising? Fill out the form below 
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Student Name */}
                <div>
                  <label htmlFor="studentName" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-900">
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Student Email */}
                <div>
                  <label htmlFor="studentEmail" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-900">
                    Student Email
                  </label>
                  <input
                    type="email"
                    id="studentEmail"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="student@university.edu"
                  />
                </div>

                {/* Student ID */}
                <div>
                  <label htmlFor="studentId" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-900">
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your student ID"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Tell us about your question or how we can help you with your academic journey..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SEND MESSAGE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
