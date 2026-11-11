import { SectionWrapper } from "../../hoc";
import { reasons } from "../../constants/content";
import Icon from "../Icon";
import SectionIntro from "./SectionIntro";

const WhyChooseUs = () => (
  <>
    <SectionIntro eyebrow="Why Choose Us?" title="More Than a Marketing Agency" />

    <div className="card-grid card-grid-4">
      {reasons.map((reason) => (
        <article key={reason.title} className="info-card">
          <span className="info-card-icon">
            <Icon name={reason.icon} className="h-6 w-6" />
          </span>
          <h3>{reason.title}</h3>
          <p>{reason.description}</p>
        </article>
      ))}
    </div>
  </>
);

export default SectionWrapper(WhyChooseUs, "why-us");
