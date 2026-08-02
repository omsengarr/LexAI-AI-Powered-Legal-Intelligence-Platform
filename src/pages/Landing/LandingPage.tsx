import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Stats from "../../components/landing/Stats";
import Testimonials from "../../components/landing/Testimonials";
import FAQ from "../../components/landing/FAQ";
import Footer from "../../components/layout/Footer";

function LandingPage() {
  return (
    <div className="bg-slate-950">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default LandingPage;