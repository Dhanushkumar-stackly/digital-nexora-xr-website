import { SectionWrapper } from "../../hoc";
import { packageNotes, packages } from "../../constants/content";
import { useConsultation } from "../../hooks/useConsultation";
import Icon from "../Icon";
import SectionIntro from "./SectionIntro";

const Pricing = () => {
  const openConsultation = useConsultation();

  return (
    <>
      <SectionIntro
        eyebrow="Our Digital Growth Packages"
        title="Choose the Right Package for Your Business"
        lead="Our monthly packages are designed to support businesses at different stages of digital growth."
      />

      <div className="pricing-grid">
        {packages.map((pkg) => (
          <article key={pkg.name} className="pricing-card">
            <h3 className="pricing-name">{pkg.name}</h3>
            <p className="pricing-price">
              {pkg.price}
              <span> / month</span>
            </p>
            <p className="pricing-summary">{pkg.summary}</p>
            <ul className="check-list pricing-features">
              {pkg.features.map((feature) => (
                <li key={feature}>
                  <Icon name="check" className="check-list-icon" />
                  {feature}
                </li>
              ))}
            </ul>
            <button type="button" className="agency-button-primary w-full" onClick={() => openConsultation(`the ${pkg.name}`)}>
              {pkg.cta}
            </button>
          </article>
        ))}
      </div>

      <div className="pricing-notes">
        <h3>Package Notes</h3>
        <ul>
          {packageNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SectionWrapper(Pricing, "pricing");
