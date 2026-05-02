import React from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";

const HomePage = ({ loggedIn, onSignOut }) => (
  <div className="min-h-screen flex flex-col">
    <Nav loggedIn={loggedIn} onSignOut={onSignOut} />
    <main className="flex-1">
      <Hero />
      <TrustBar />
      <FeaturesSection />
    </main>
    <Footer />
  </div>
);

export default HomePage;
