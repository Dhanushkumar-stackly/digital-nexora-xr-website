import { SectionWrapper } from "../../hoc";
import SectionIntro from "./SectionIntro";

const Pricing = () => (
  <SectionIntro
    eyebrow="Our Digital Growth Packages"
    title="Choose the Right Package for Your Business"
    lead="Our monthly packages are designed to support businesses at different stages of digital growth."
  />
);

export default SectionWrapper(Pricing, "pricing");
