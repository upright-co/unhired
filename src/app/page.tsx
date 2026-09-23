import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Reframe } from "@/components/sections/Reframe";
import { HiddenCosts } from "@/components/sections/HiddenCosts";
import { Roles } from "@/components/sections/Roles";
import { Comparison } from "@/components/sections/Comparison";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AssessmentSection } from "@/components/sections/AssessmentSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Reframe />
        <HiddenCosts />
        <Roles />
        <Comparison />
        <HowItWorks />
        <AssessmentSection />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
