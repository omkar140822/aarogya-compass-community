import Hero from "@/components/Hero";
import About from "@/components/About";
import EquipmentCategories from "@/components/EquipmentCategories";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <EquipmentCategories />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
