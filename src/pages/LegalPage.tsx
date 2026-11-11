import { Link } from "react-router-dom";

type Section = { title: string; blocks: (string | string[])[] };

const LegalPage = ({ title, intro, sections }: { title: string; intro?: string; sections?: Section[] }) => (
  <div className="site-section min-h-[70vh] pt-36">
    <div className="site-container max-w-3xl">
      <p className="agency-about-eyebrow">Legal</p>
      <h1 className="section-title mt-3">{title}</h1>
      {sections ? (
        <>
          {intro && <p className="section-lead mt-6">{intro}</p>}
          <ol className="mt-10 space-y-10">
            {sections.map((section, i) => (
              <li key={section.title}>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  {i + 1}. {section.title}
                </h2>
                <div className="mt-3 space-y-3 leading-relaxed text-[var(--color-text-muted)]">
                  {section.blocks.map((block, j) =>
                    Array.isArray(block) ? (
                      <ul key={j} className="list-disc space-y-2 pl-6">
                        {block.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j}>{block}</p>
                    ),
                  )}
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="section-lead mt-6">This page is being prepared and will be published before launch.</p>
      )}
      <Link to="/" className="agency-button-secondary mt-10">
        Back to Home
      </Link>
    </div>
  </div>
);

export default LegalPage;
