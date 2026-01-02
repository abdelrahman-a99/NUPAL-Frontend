'use client';
import Image from 'next/image';

export default function AboutIntroSection() {
  return (
    <section id="about" className="relative bg-white py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="mb-20">
          <div className="inline-block mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">About Us</span>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-blue-400 to-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-2xl lg:text-3xl max-w-3xl leading-tight">NUPal empowers everyone to build their academic success</h2>
        </div>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="relative overflow-hidden">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-600 to-purple-600 rounded-full" />
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl group shadow-2xl">
                  <Image src="/nile4.jpg" alt="Nile University Campus" width={800} height={600} className="w-full h-auto object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105" style={{ minHeight: '400px', maxHeight: '600px' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none rounded-3xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                <p className="text-lg leading-relaxed text-slate-700">NUPal is a cutting-edge academic advising platform that leverages artificial intelligence to transform how students navigate their educational journey. </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <p className="text-lg leading-relaxed text-slate-600">We empower students to make confident, informed decisions about their academic path. Through intelligent course recommendations, comprehensive progress tracking, and intuitive semester planning tools, NU PAL eliminates the complexity and uncertainty from academic planning.</p>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3"><div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-blue-400 text-[10px] font-bold">AI</span></div><span className="text-[12px] font-bold text-slate-700 whitespace-nowrap">AI-Powered</span></div>
                <div className="flex items-center gap-3"><div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center"><span className="text-indigo-600 text-[10px] font-bold">P</span></div><span className="text-[12px] font-bold text-slate-700 whitespace-nowrap">Personalized</span></div>
                <div className="flex items-center gap-3"><div className="w-8 h-8 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center"><span className="text-purple-600 text-[10px] font-bold">C</span></div><span className="text-[12px] font-bold text-slate-700 whitespace-nowrap">Comprehensive</span></div>
                <div className="flex items-center gap-3"><div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-blue-400 text-[10px] font-bold">I</span></div><span className="text-[12px] font-bold text-slate-700 whitespace-nowrap">Intuitive</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
