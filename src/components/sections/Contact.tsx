import { Suspense, lazy } from "react";

import { SectionWrapper } from "../../hoc";
import { useConsultation } from "../../hooks/useConsultation";
import SectionIntro from "./SectionIntro";

const EarthCanvas = lazy(() => import("../canvas/Earth"));

const PHONES = [
  { label: "Phone", display: "+91 99437 11466", href: "tel:+919943711466" },
  { label: "Additional Contact", display: "+91 88383 58916", href: "tel:+918838358916" },
];

const WHATSAPP_URL = `https://wa.me/919943711466?text=${encodeURIComponent(
  "Hello HD NEXORA WEBTEC, I'd like to discuss digital marketing for my business."
)}`;

const Contact = () => {
  const openConsultation = useConsultation();

  return (
    <div className="contact-layout">
      <div>
        <SectionIntro eyebrow="Contact Us" title="Let's Talk About Your Business" />

        <div className="surface-card contact-card">
          <div>
            <p className="contact-card-title">HD NEXORA WEBTEC</p>
            <p className="contact-card-text">Coimbatore, Tamil Nadu, India</p>
          </div>

          <dl className="contact-details">
            {PHONES.map((phone) => (
              <div key={phone.href}>
                <dt>{phone.label}</dt>
                <dd>
                  <a href={phone.href}>{phone.display}</a>
                </dd>
              </div>
            ))}
            <div>
              <dt>WhatsApp</dt>
              <dd>Contact us using either of the verified business numbers.</dd>
            </div>
          </dl>

          <div className="contact-actions">
            <a className="agency-button-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Contact Us on WhatsApp
            </a>
            <button type="button" className="agency-button-secondary" onClick={() => openConsultation()}>
              Request a Consultation
            </button>
          </div>
        </div>
      </div>

      <div className="contact-globe" aria-hidden="true">
        <Suspense fallback={null}>
          <EarthCanvas />
        </Suspense>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
