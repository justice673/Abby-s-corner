import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoriesSection from "./components/Categories";
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
        <NewArrivalsSection />
        <DiscountSection />
        <StoreSection />
        <AvailableSection />
        <BlogSection />
      </main>
    </div>
  );
}
