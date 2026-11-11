import { useConsultation } from "../../hooks/useConsultation";

const FinalCta = () => {
  const openConsultation = useConsultation();

  return (
    <section id="get-started" className="site-section">
      <div className="site-container cta-banner">
        <h2 className="section-title">Let&apos;s Grow Your Business Together.</h2>
        <p className="cta-banner-subtitle">Ready to strengthen your digital presence?</p>
        <p className="section-lead mx-auto">
          Tell us about your business and goals. Our team will understand your requirements and get in touch to discuss
          a suitable digital growth strategy.
        </p>
        <button type="button" className="agency-button-primary mt-8" onClick={() => openConsultation()}>
          Book a Free Consultation <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
};

export default FinalCta;
