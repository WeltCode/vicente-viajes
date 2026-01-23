import React from "react"
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/Hero";
import FeaturedDestinations from "../components/sections/FeaturedDestinations";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Hero />
        <FeaturedDestinations />
      </main>
      <Footer />
    </>
  );
}
