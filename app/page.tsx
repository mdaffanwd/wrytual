import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

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
