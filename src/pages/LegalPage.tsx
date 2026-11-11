import { Link } from "react-router-dom";

const LegalPage = ({ title }: { title: string }) => (
  <main className="site-section min-h-[70vh] pt-36">
    <div className="site-container max-w-3xl">
      <p className="agency-about-eyebrow">Legal</p>
      <h1 className="section-title mt-3">{title}</h1>
      <p className="section-lead mt-6">This page is being prepared and will be published before launch.</p>
      <Link to="/" className="agency-button-secondary mt-10">
        Back to Home
      </Link>
    </div>
  </main>
);

export default LegalPage;
