import React from "react"
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
