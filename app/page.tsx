"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import NewArrivals from "@/components/sections/NewArrivals";
import FeatureBanner from "@/components/sections/FeatureBanner";
import BestSellers from "@/components/sections/BestSellers";
import { motion, useScroll, useSpring } from "framer-motion";
import { Box } from "@mui/material";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <Navbar />
      <motion.div
        style={{
          scaleX,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "#39FF14",
          transformOrigin: "0%",
          zIndex: 9999,
          boxShadow: "0 0 12px rgba(57,255,20,0.5)",
        }}
      />
      <main style={{ flex: 1, overflow: "hidden" }}>
        <Hero />
        <Box id="categories-section">
          <Categories />
        </Box>
        <NewArrivals />
        <BestSellers />
        <FeatureBanner />
      </main>
      <Footer />
    </>
  );
}
