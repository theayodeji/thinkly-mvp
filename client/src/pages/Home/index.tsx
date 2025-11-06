import React, { Suspense, lazy } from "react";

// Lazy load all section components
const HeroSection = lazy(() => import("../../components/home/HeroSection"));
const FeaturesSection = lazy(
  () => import("../../components/home/FeaturesSection")
);
const HowItWorksSection = lazy(
  () => import("../../components/home/HowItWorksSection")
);
const GamificationSection = lazy(
  () => import("../../components/home/GamificationSection")
);
const TestimonialsSection = lazy(
  () => import("../../components/home/TestimonialsSection")
);
const CTASection = lazy(() => import("../../components/home/CTASection"));
const Footer = lazy(() => import("../../components/home/Footer"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

const Home = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-bg group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <GamificationSection />
            <TestimonialsSection />
            <CTASection />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
