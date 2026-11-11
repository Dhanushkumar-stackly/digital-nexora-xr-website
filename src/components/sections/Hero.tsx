import { Suspense, lazy, useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { useConsultation } from "../../hooks/useConsultation";

const HeroNetworkCanvas = lazy(() => import("../canvas/HeroNetwork"));

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const Hero = () => {
  const openConsultation = useConsultation();
  // Render the WebGL globe only after hydration so the prerendered HTML and first client render match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <section id="home" className="agency-hero">
        <div className="agency-hero-inner">
          <div className="agency-hero-copy">
            <motion.p className="agency-hero-label" {...fadeIn(0)}>
              DIGITAL GROWTH PARTNER
            </motion.p>

            <motion.h1 className="agency-hero-title" {...fadeIn(0.08)}>
              <span>Build Your Digital Presence.</span>
              <span>Grow Your Business.</span>
            </motion.h1>

            <motion.div className="agency-hero-description" {...fadeIn(0.16)}>
              <p>
                We help businesses strengthen their online presence through strategic digital marketing, SEO, social
                media management, paid advertising and professional website development.
              </p>
              <p>
                From building brand awareness to generating quality enquiries, we create digital solutions aligned with
                your business goals.
              </p>
            </motion.div>

            <motion.div className="agency-hero-actions" {...fadeIn(0.24)}>
              <button
                type="button"
                onClick={() => openConsultation()}
                className="agency-button-primary"
              >
                Book a Free Consultation <span aria-hidden="true">→</span>
              </button>
              <a className="agency-button-secondary" href="#services">
                Explore Our Services
              </a>
            </motion.div>

            <motion.p className="agency-hero-process" {...fadeIn(0.32)}>
              Discover. Analyse. Strategize. Execute. Optimise.
            </motion.p>
          </div>

          <motion.div
            className="agency-hero-art"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          >
            {mounted && (
              <Suspense fallback={null}>
                <HeroNetworkCanvas />
              </Suspense>
            )}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Hero;
