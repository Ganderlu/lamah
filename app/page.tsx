import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import NewArrivals from "@/components/sections/NewArrivals";
import FeatureBanner from "@/components/sections/FeatureBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <Categories />
        <NewArrivals />
        <FeatureBanner />
      </main>
      <Footer />
    </>
  );
}
