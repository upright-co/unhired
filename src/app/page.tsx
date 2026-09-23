import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { WhatIsAiEmployee } from "@/components/sections/WhatIsAiEmployee";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { Comparison } from "@/components/sections/Comparison";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Companies } from "@/components/sections/Companies";
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
        <WhatIsAiEmployee />
        <Problem />
        <Solution />
        <Comparison />
        <HowItWorks />
        <Companies />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
