import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-20 px-4 py-10">
      <Hero />
      <HowItWorks />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}
