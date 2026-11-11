import { AboutUs, Hero, Contact } from "../components";
import Services from "../components/sections/Services";
import Pricing from "../components/sections/Pricing";
import AdditionalServices from "../components/sections/AdditionalServices";
import Process from "../components/sections/Process";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import Industries from "../components/sections/Industries";
import OurWork from "../components/sections/OurWork";
import FinalCta from "../components/sections/FinalCta";

const Home = () => (
  <>
    <Hero />
    <AboutUs />
    <Services />
    <Pricing />
    <AdditionalServices />
    <Process />
    <WhyChooseUs />
    <Industries />
    <OurWork />
    <FinalCta />
    <Contact />
  </>
);

export default Home;
