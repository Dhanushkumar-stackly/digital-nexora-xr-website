import React from "react";
import FloatingTitle from "./ui/FloatingTitle";
import SeoSceneCanvas from "../canvas/SeoScene";

const SERVICES = [
  {
    number: "01",
    label: "SEO",
    title: "Search. Visibility. Growth.",
    description: "Strategic SEO that puts your brand in front of the right audience.",
  },
  {
    number: "02",
    label: "SMM",
    title: "Social. Influence. Growth.",
    description: "Strategic social media that turns attention into lasting brand value.",
  },
  {
    number: "03",
    label: "Website Development",
    title: "Design. Experience. Conversion.",
    description: "High-performance websites built around your brand and business goals.",
  },
];

const DigitalMarketing: React.FC = () => {
  return (
    <section id="services" className="site-section">
      <div className="site-container">
        <FloatingTitle subtitle="Digital Solutions" title="Digital Marketing." />

        <p className="section-lead mb-12">
          Comprehensive digital marketing services combining AI-driven strategies with cutting-edge web technologies. From SEO
          optimization and social media management to content marketing and analytics, we deliver data-driven campaigns that
          drive engagement and conversions.
        </p>

        <div className="agency-services-layout">
          <div>
            <h3 className="agency-services-heading">Our Service</h3>

            <ol className="agency-services">
              {SERVICES.map((service) => (
                <li key={service.number} className="agency-service">
                  <p className="agency-service-label">
                    {service.number} — {service.label}
                  </p>
                  <h3 className="agency-service-title">{service.title}</h3>
                  <p className="agency-service-text">{service.description}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="agency-services-art" aria-hidden="true">
            <SeoSceneCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalMarketing;
