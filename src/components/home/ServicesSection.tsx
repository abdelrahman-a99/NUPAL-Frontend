'use client';
import { useState } from 'react';
import Image from 'next/image';
import { services } from '@/data/services';

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(services[0].id);
  const [openService, setOpenService] = useState<string | null>(services[0].id);

  const handleServiceChange = (serviceId: string) => {
    setActiveService(serviceId);
    setOpenService(serviceId);
  };
  const handleServiceToggle = (serviceId: string) => {
    setOpenService(openService === serviceId ? null : serviceId);
    setActiveService(serviceId);
  };

  return (
    <section id="services" className="bg-white pb-16">
      <div className="border-b border-blue-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap justify-center gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceChange(service.id)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold uppercase transition-all duration-200 ${activeService === service.id
                    ? 'bg-blue-400 text-white shadow-md shadow-blue-500/30'
                    : 'bg-blue-50 text-blue-400 hover:bg-blue-100'
                  }`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
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
                      <div className={`h-1 w-1 rounded-full transition-all duration-300 ${isOpen ? 'h-12 w-1 bg-blue-400' : 'bg-blue-300'
                        }`} />
                      <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                    </div>
                    <svg className={`h-5 w-5 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pb-6 pl-5">
                      <p className="mb-4 text-base leading-relaxed text-slate-600">{service.description}</p>
                      <a href="#" className="text-sm font-semibold text-indigo-600 underline hover:text-blue-500">Take a guided tour</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ml-8 shadow-xl" style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 25%, #e0e7ff 50%, #ddd6fe 75%, #f3e8ff 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient 20s ease infinite'
          }}>
            {services.map((service) => {
              const isActive = activeService === service.id;
              const serviceIndex = services.findIndex(s => s.id === service.id);
              const activeIndex = services.findIndex(s => s.id === activeService);
              let zIndex = 0;
              if (isActive) zIndex = 30; else if (serviceIndex < activeIndex) zIndex = 10; else zIndex = 20;
              let translateX = '100%';
              if (isActive) translateX = '0%'; else if (serviceIndex < activeIndex) translateX = '0%';
              return (
                <div key={service.id} className="absolute inset-0 transition-transform duration-700 ease-in-out" style={{ transform: `translateX(${translateX})`, zIndex }}>
                  <div className="absolute inset-0 bg-white/98 backdrop-blur-sm rounded-2xl p-[15px] shadow-xl" style={{ background: 'linear-gradient(to bottom, #dbeafe 0%, #2563eb 100%)' }}>
                    <div className="h-full w-full bg-white/98 backdrop-blur-sm overflow-hidden">
                      <Image src={service.image} alt={service.title} width={600} height={400} className="h-full w-full object-cover" />
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
  );
}

