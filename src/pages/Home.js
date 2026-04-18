import React from "react";
import Footer from "../components/Footer";
import FeaturesSection from "../components/FeaturesSection";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import TrustBar from "../components/TrustBar";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
