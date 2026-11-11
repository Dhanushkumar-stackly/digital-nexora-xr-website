interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
}

const SectionIntro = ({ eyebrow, title, lead }: Props) => (
  <div className="mb-10">
    <p className="agency-about-eyebrow">{eyebrow}</p>
    <h2 className="section-title mt-3">{title}</h2>
    {lead && <p className="section-lead mt-5">{lead}</p>}
  </div>
);

export default SectionIntro;
