import { SectionWrapper } from "../../hoc";
import { useSectionNav } from "../../hooks/useSectionNav";
import SectionIntro from "./SectionIntro";

const OurWork = () => {
  const goToSection = useSectionNav();

  return (
    <>
      <SectionIntro
        eyebrow="Our Work"
        title="Our Selected Work & Creative Projects"
        lead="Explore our website design concepts, creative campaigns and selected project work."
      />

      <div className="work-note">
        <p>
          Our project showcase is being updated with recent client work and clearly labelled concept projects. Get in
          touch and we&apos;ll share examples relevant to your business.
        </p>
        <button type="button" className="agency-button-secondary" onClick={() => goToSection("contact")}>
          Contact Us
        </button>
      </div>
    </>
  );
};

export default SectionWrapper(OurWork, "work");
