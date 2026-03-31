import React from "react"
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/Hero";
import ServiceCards from "../components/sections/ServiceCards";
import FeaturedDestinations from "../components/sections/FeaturedDestinations";
import OffersPreview from "../components/sections/OffersPreview";
import WhyChooseUs from "../components/WhyChooseUs";
import CtaSection from "../components/sections/CtaSection";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Hero />
        <FeaturedDestinations />
        <ServiceCards />        
        <OffersPreview />
        <WhyChooseUs />
        <CtaSection />
        <WhatsAppButton />
      </main>
      <Footer />
    </>
  );
}
