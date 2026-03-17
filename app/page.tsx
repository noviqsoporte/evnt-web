import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import QueHacemosSection from '@/components/QueHacemosSection';
import PorQueSection from '@/components/PorQueSection';
import MetodoSection from '@/components/MetodoSection';
import RestaurantesSection from '@/components/RestaurantesSection';
import CTAFinalSection from '@/components/CTAFinalSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { getConfiguracion, getRestaurantes } from '@/lib/airtable';

export const revalidate = 60;

export default async function Home() {
  const config = await getConfiguracion();
  const restaurantes = await getRestaurantes();

  return (
    <>
      <main className="min-h-screen bg-bg">
        <Navbar />
        <HeroSection config={config} />

        <QueHacemosSection />
        <PorQueSection />
        <MetodoSection config={config} />
        <RestaurantesSection restaurantes={restaurantes} />
        <CTAFinalSection config={config} />
      </main>

      <Footer config={config} />
      <FloatingButtons config={config} />
    </>
  );
}
