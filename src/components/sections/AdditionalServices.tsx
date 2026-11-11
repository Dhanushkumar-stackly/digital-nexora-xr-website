import { SectionWrapper } from "../../hoc";
import { additionalServices } from "../../constants/content";
import { useConsultation } from "../../hooks/useConsultation";
import SectionIntro from "./SectionIntro";

const AdditionalServices = () => {
  const openConsultation = useConsultation();

  return (
    <>
      <SectionIntro eyebrow="Additional Digital Services" title="Services Beyond Monthly Packages" />

      <div className="card-grid card-grid-4">
        {additionalServices.map((service) => (
          <article key={service.title} className="info-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="agency-button-secondary mt-10"
        onClick={() => openConsultation("a custom quote")}
      >
        Request a Custom Quote
      </button>
    </>
  );
};

export default SectionWrapper(AdditionalServices, "additional-services");
