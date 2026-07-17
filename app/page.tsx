import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import NewArrivals from "@/components/sections/NewArrivals";
import BestSellers from "@/components/sections/BestSellers";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <Categories />
        <NewArrivals />
        <BestSellers />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
