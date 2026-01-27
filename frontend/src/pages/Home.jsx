import React from "react"
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/Hero";
import FeaturedDestinations from "../components/sections/FeaturedDestinations";
import WhyChooseUs from "../components/WhyChooseUs";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Hero />
        <FeaturedDestinations />
        <WhyChooseUs/>
        <WhatsAppButton />
      </main>
      <Footer />
    </>
  );
}
