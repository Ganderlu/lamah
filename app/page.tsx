import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import NewArrivals from "@/components/sections/NewArrivals";
import CollectionBanner from "@/components/sections/CollectionBanner";
import PremiumFeatures from "@/components/sections/PremiumFeatures";
import BestSellers from "@/components/sections/BestSellers";
import CustomerReviews from "@/components/sections/CustomerReviews";
import InstagramGallery from "@/components/sections/InstagramGallery";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <Categories />
        <NewArrivals />
        <CollectionBanner />
        <PremiumFeatures />
        <BestSellers />
        <CustomerReviews />
        <InstagramGallery />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
