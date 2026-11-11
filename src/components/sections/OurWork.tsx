import { SectionWrapper } from "../../hoc";
import SectionIntro from "./SectionIntro";

const OurWork = () => (
  <SectionIntro
    eyebrow="Our Work"
    title="Our Selected Work & Creative Projects"
    lead="Explore our website design concepts, creative campaigns and selected project work."
  />
);

export default SectionWrapper(OurWork, "work");
