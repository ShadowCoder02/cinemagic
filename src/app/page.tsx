
import HeroSection from '@/components/sections/HeroSection';
import FeaturedWork from '@/components/sections/FeaturedWork';
import FeaturedFilms from '@/components/sections/FeaturedFilms';
import AboutPreview from '@/components/sections/AboutPreview';
import ContactCTA from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Light Mode Premium Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50/50 via-white to-primary-100/30 opacity-100 dark:opacity-0 pointer-events-none transition-opacity duration-300"></div>
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary-200/20 blur-3xl pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
      
      {/* Cosmic Background Effects (Dark Mode only) */}
      <div className="fixed inset-0 bg-star-field opacity-0 dark:opacity-5 pointer-events-none transition-opacity duration-300"></div>
      <div className="fixed inset-0 bg-nebula opacity-0 dark:opacity-3 pointer-events-none transition-opacity duration-300"></div>
      <div className="fixed inset-0 bg-galaxy opacity-0 dark:opacity-2 pointer-events-none transition-opacity duration-300"></div>
      

      <HeroSection />
      <FeaturedWork />
  <FeaturedFilms />
      <AboutPreview />
      <ContactCTA />

    </main>
  );
}