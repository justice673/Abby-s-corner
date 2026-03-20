import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoriesSection from "./components/Categories";
import FrenchPerfumeSection from "./components/FrenchPerfumeSection";
import EnglishPerfumeSection from "./components/EnglishPerfumeSection";
import ArabicPerfumeSection from "./components/ArabicPerfumeSection";
import FragranceBarSection from "./components/FragranceBarSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import DiscountSection from "./components/DiscountSection";
import StoreSection from "./components/StoreSection";
import AvailableSection from "./components/AvailableSection";
import BlogSection from "./components/BlogSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-(--brand-light) text-(--brand-primary)">
      <Navbar />
      <main>
        <Hero />
        <CategoriesSection />
        <FrenchPerfumeSection />
        <EnglishPerfumeSection />
        <ArabicPerfumeSection />
        <FragranceBarSection />
        <NewArrivalsSection />
        <DiscountSection />
        <StoreSection />
        <AvailableSection />
        <BlogSection />
      </main>
    </div>
  );
}
