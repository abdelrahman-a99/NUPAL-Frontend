export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white">
      <main className="relative isolate w-full overflow-hidden px-20 py-20 sm:px-20">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[0.5px]"
          style={{
            backgroundImage: "url('/nile%202.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/30" />

        <section className="relative z-10 flex min-h-[70vh] w-full flex-col justify-center gap-10 py-10">
          <div className="max-w-3xl space-y-8 text-left">
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your Academic Journey,{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-700 lg:text-xl">
              AI-powered academic advising platform that helps you plan your courses, track your progress, and achieve
              your educational goals with confidence.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-10 py-3 text-base font-semibold text-white shadow-xl shadow-indigo-500/30 transition-transform duration-200 hover:-translate-y-0.5">
                Get Started
              </button>
              <button className="rounded-2xl border border-slate-200/80 bg-white/80 px-10 py-3 text-base font-semibold text-slate-700 backdrop-blur transition-colors duration-200 hover:border-indigo-200 hover:bg-white">
                Learn More
              </button>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
