'use client';

import { useState } from 'react';

export function ContactPageContent() {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentId: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen bg-white relative overflow-hidden">
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
            fill="url(#gradient1)"
            style={{ animation: 'waveFloat 9s ease-in-out infinite' }}
          />
          {/* Second Wave Layer */}
          <path
            d="M0,250L40,245C80,240,160,230,240,225C320,220,400,220,480,230C560,240,640,260,720,270C800,280,880,280,960,275C1040,270,1120,260,1200,255C1280,250,1360,250,1400,250L1440,250L1440,700L1400,700C1360,700,1280,700,1200,700,1120,700,1040,700,960,700,880,700,800,700,720,700,640,700,560,700,480,700,400,700,320,700,240,700,160,700,80,700,40,700L0,700Z"
            fill="url(#gradient2)"
            style={{ animation: 'waveFloat 11s ease-in-out infinite', animationDelay: '0.8s' }}
          />
          {/* Third Wave Layer */}
          <path
            d="M0,300L50,295C100,290,200,280,300,275C400,270,500,270,600,280C700,290,800,310,900,320C1000,330,1100,330,1200,325C1300,320,1400,310,1450,305L1500,300L1500,700L1450,700C1400,700,1300,700,1200,700,1100,700,1000,700,900,700,800,700,700,700,600,700,500,700,400,700,300,700,200,700,100,700,50,700L0,700Z"
            fill="url(#gradient3)"
            style={{ animation: 'waveFloat 13s ease-in-out infinite', animationDelay: '1.6s' }}
          />
          {/* Fourth Wave Layer */}
          <path
            d="M0,350L30,348C60,346,120,342,180,340C240,338,300,338,360,342C420,346,480,354,540,358C600,362,660,362,720,360C780,358,840,354,900,352C960,350,1020,350,1080,352C1140,354,1200,358,1260,360C1320,362,1380,362,1410,362L1440,362L1440,700L1410,700C1380,700,1320,700,1260,700,1200,700,1140,700,1080,700,1020,700,960,700,900,700,840,700,780,700,720,700,660,700,600,700,540,700,480,700,420,700,360,700,300,700,240,700,180,700,120,700,60,700,30,700L0,700Z"
            fill="url(#gradient4)"
            style={{ animation: 'waveFloat 15s ease-in-out infinite', animationDelay: '2.4s' }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Contact Section */}
      <section className="py-20 relative z-10">
        <div className="mx-auto max-w-4xl px-6">
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
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                  className="rounded-lg bg-blue-400 px-8 py-3 text-base font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

