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
    <section id="digitalmarketing" className="relative py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-[#05060b]/90 to-[#0b1220]/90 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <FloatingTitle subtitle="Digital Solutions" title="Digital Marketing." />

        <p className="text-indigo-200/80 max-w-3xl leading-relaxed mb-12">
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
