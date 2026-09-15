import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import About from "../../components/landing/About";
import Stats from "../../components/landing/Stats";
import Testimonials from "../../components/landing/Testimonials";
import FAQ from "../../components/landing/FAQ";
import Contact from "../../components/landing/Contact";
import Footer from "../../components/layout/Footer";

function LandingPage() {
  return (
    <div
      id="home"
      className="bg-slate-950 scroll-smooth"
    >
      <Navbar />

      <Hero />

      <Features />

      <About />

      <Stats />

      <Testimonials />

      <FAQ />

      <Contact />

      <Footer />
    </div>
  );
}

export default LandingPage;