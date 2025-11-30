'use client';

export default function Hero() {
  return (
    <main className="relative isolate w-full overflow-hidden px-20 py-20 sm:px-20">
      <div
        className="absolute inset-0 bg-cover bg-center blur-[0.05px]"
        style={{ backgroundImage: "url('/nile%202.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/30" />

      <section className="relative z-10 flex min-h-[70vh] w-full flex-col justify-center gap-10 py-10">
        <div className="max-w-3xl space-y-8 text-left">
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your Academic Journey, <span className="text-blue-400">Simplified</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-700 lg:text-xl">
            AI-powered academic advising platform that helps you plan your courses, track your progress, and achieve
            your educational goals with confidence.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-blue-400 px-10 py-3 text-base font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-500">
              GET STARTED
            </button>
            <button className="rounded-2xl border-2 border-blue-400 bg-white/80 px-10 py-3 text-base font-semibold text-blue-400 backdrop-blur transition-colors duration-200 hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

