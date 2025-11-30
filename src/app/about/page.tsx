import AboutIntroSection from '@/components/home/AboutIntroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';

/**
 * About Us Page
 * Displays information about NU PAL platform with university image and features carousel
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutIntroSection />
      <FeaturesSection />
    </div>
  );
}
