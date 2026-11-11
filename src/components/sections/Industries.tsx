import { SectionWrapper } from "../../hoc";
import { industries } from "../../constants/content";
import SectionIntro from "./SectionIntro";

const Industries = () => (
  <>
    <SectionIntro eyebrow="Industries We Serve" title="Digital Growth for Diverse Businesses" />

    <ul className="industry-grid">
      {industries.map((industry) => (
        <li key={industry} className="industry-tile">
          {industry}
        </li>
      ))}
    </ul>

    <p className="section-lead mt-10">
      We tailor digital strategies according to each industry&apos;s audience, competition and business objectives.
    </p>
  </>
);

export default SectionWrapper(Industries, "industries");
