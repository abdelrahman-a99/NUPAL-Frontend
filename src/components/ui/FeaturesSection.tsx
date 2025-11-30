'use client';
import { features } from '@/data/features';

export default function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Platform Features</h2>
          <p className="text-lg text-slate-600">Discover the powerful tools that help you succeed</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-6" style={{ animation: 'scroll 30s linear infinite' }}>
            {features.concat(features).map((feature, idx) => (
              <div key={`${feature.id}-${idx}`} className="flex-shrink-0 w-[320px] rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-4xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-base leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

