import { SectionWrapper } from "../../hoc";
import { processSteps } from "../../constants/content";
import SectionIntro from "./SectionIntro";

const Process = () => (
  <>
    <SectionIntro eyebrow="Our Process" title="A Proven Process for Business Growth" />

    <ol className="process-steps">
      {processSteps.map((step, index) => (
        <li key={step.title} className="process-step">
          <span className="process-number">{String(index + 1).padStart(2, "0")}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  </>
);

export default SectionWrapper(Process, "process");
