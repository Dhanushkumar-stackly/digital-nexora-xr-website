import { Suspense, lazy, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import ConsultationModal from "../ConsultationModal";

const HeroNetworkCanvas = lazy(() => import("../canvas/HeroNetwork"));

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const Hero = () => {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
      <section className="agency-hero">
        <div className="agency-hero-inner">
          <div className="agency-hero-copy">
            <motion.p className="agency-hero-label" {...fadeIn(0)}>
              DIGITAL GROWTH PARTNER
            </motion.p>

            <motion.h1 className="agency-hero-title" {...fadeIn(0.08)}>
              <span>Build Your Digital Presence.</span>
              <span>Grow Your Business.</span>
            </motion.h1>

            <motion.p className="agency-hero-description" {...fadeIn(0.16)}>
              Strategic digital marketing, SEO, social media and website solutions designed to help
              businesses strengthen their online presence and grow.
            </motion.p>

            <motion.div className="agency-hero-actions" {...fadeIn(0.24)}>
              <button
                onClick={() => setConsultationOpen(true)}
                className="agency-button-primary"
              >
                Book a Free Consultation <span aria-hidden="true">→</span>
              </button>
              <a className="agency-button-secondary" href="#digitalmarketing">
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
            <Suspense fallback={null}>
              <HeroNetworkCanvas />
            </Suspense>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Hero;
