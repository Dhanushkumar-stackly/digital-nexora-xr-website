import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="agency-hero relative mx-auto min-h-[760px] w-full overflow-hidden">
      <div className="agency-hero-grid" aria-hidden="true" />

      <div className="agency-hero-inner relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-center px-6 pb-24 pt-32 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16 lg:pt-28">
        <motion.div
          className="agency-hero-copy relative z-10"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <h1 className="agency-wordmark font-black uppercase">
            <span className="agency-word agency-word-accent">DIGITAL</span>
            <span className="agency-word agency-word-dark">NEXORA</span>
            <span className="agency-word agency-word-dark agency-word-last">XR WEBTECH</span>
          </h1>

          <motion.p
            className="agency-hero-tagline mt-6 max-w-xl text-xl font-medium leading-relaxed sm:text-2xl lg:mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            We build thoughtful websites and digital campaigns that help ambitious businesses grow.
          </motion.p>

          <div className="agency-hero-actions mt-8 flex flex-wrap items-center gap-4">
            <Link className="agency-button-primary" to="/book-project">
              Start a project
              <span aria-hidden="true">↗</span>
            </Link>
            <a className="agency-button-secondary" href="#digitalmarketing">
              Explore our services
            </a>
          </div>
        </motion.div>

        <motion.div
          className="agency-hero-art relative mx-auto mt-10 h-[300px] w-[300px] sm:h-[390px] sm:w-[390px] lg:mt-0 lg:h-[500px] lg:w-[500px]"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <div className="agency-orbit agency-orbit-outer" />
          <div className="agency-orbit agency-orbit-middle" />
          <div className="agency-orbit agency-orbit-inner" />
          <div className="agency-orbit-core" />
          <span className="agency-orbit-dot agency-orbit-dot-one" />
          <span className="agency-orbit-dot agency-orbit-dot-two" />
          <span className="agency-orbit-square" />
        </motion.div>
      </div>

      <a className="agency-scroll-cue" href="#about" aria-label="Scroll to about section">
        <span />
      </a>
    </section>
  );
};

export default Hero;
