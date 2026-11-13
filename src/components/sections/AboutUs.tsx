import { SectionWrapper } from "../../hoc";
import { approach } from "../../constants/content";
import Icon from "../Icon";
import SectionIntro from "./SectionIntro";

const team = [
  {
    name: "S. Dhanush Kumar",
    role: "B.E. (Electronics & Instrumentation Engineering) | AI & Machine Learning Engineer | Website Development Manager",
  },
  {
    name: "M. Hariharasudhan",
    role: "BBA CA | Finance & Marketing Expert | Logistics & Transport Specialist",
  },
];

const AboutUs = () => (
  <div className="about-grid">
    <div>
      <SectionIntro eyebrow="About Us" title="Your Strategic Digital Growth Partner" />
      <div className="about-team">
        {team.map((m) => (
          <figure key={m.name} className="team-card">
            <figcaption>
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="about-copy">
        <p>
          HD NEXORA WEBTEC is a digital marketing and website solutions agency based in Coimbatore, Tamil Nadu.
        </p>
        <p>
          We help businesses build a stronger digital presence through strategic planning, creative execution and
          business-focused digital solutions.
        </p>
        <p>
          Our approach focuses on understanding your business, identifying opportunities, reaching the right audience
          and continuously improving your online performance.
        </p>
      </div>
    </div>

    <div className="about-cards">
      <article className="info-card">
        <h3>Our Mission</h3>
        <p>
          To help businesses establish a strong digital presence through practical, strategic and result-focused
          digital solutions.
        </p>
      </article>
      <article className="info-card">
        <h3>Our Vision</h3>
        <p>
          To become a trusted digital growth partner for businesses by delivering quality, transparency and continuous
          improvement.
        </p>
      </article>
      <article className="info-card">
        <h3>Our Approach</h3>
        <ul className="check-list">
          {approach.map((item) => (
            <li key={item}>
              <Icon name="check" className="check-list-icon" />
              {item}
            </li>
          ))}
        </ul>
      </article>
    </div>
  </div>
);

export default SectionWrapper(AboutUs, "about");
