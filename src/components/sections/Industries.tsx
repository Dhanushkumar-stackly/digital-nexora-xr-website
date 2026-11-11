import { SectionWrapper } from "../../hoc";
import SectionIntro from "./SectionIntro";

const Industries = () => (
  <SectionIntro
    eyebrow="Industries We Serve"
    title="Digital Growth for Diverse Businesses"
    lead="We tailor digital strategies according to each industry's audience, competition and business objectives."
  />
);

export default SectionWrapper(Industries, "industries");
