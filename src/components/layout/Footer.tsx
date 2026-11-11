import { Link } from "react-router-dom";

import * as Assets from "../../assets";
import { useSectionNav } from "../../hooks/useSectionNav";

const QUICK_LINKS = [
  { id: "home", title: "Home" },
  { id: "about", title: "About Us" },
  { id: "services", title: "Services" },
  { id: "pricing", title: "Pricing" },
  { id: "work", title: "Our Work" },
  { id: "contact", title: "Contact" },
];

const SERVICES = [
  "SEO",
  "Local SEO",
  "Social Media Marketing",
  "Google Ads",
  "Meta Ads",
  "Website Development",
];

const PHONES = [
  { display: "+91 99437 11466", href: "tel:+919943711466" },
  { display: "+91 88383 58916", href: "tel:+918838358916" },
];

const Footer = () => {
  const goToSection = useSectionNav();

  return (
    <footer className="site-footer">
      <div className="site-container site-footer-grid">
        <div className="site-footer-brand">
          <div className="flex items-center gap-3">
            <img src={Assets.dnxLogo} alt="" className="h-11 w-11 object-contain" />
            <span className="font-display text-[17px] font-bold tracking-[0.04em] text-white">HD NEXORA WEBTEC</span>
          </div>
          <p className="site-footer-tagline">Build Your Digital Presence. Grow Your Business.</p>
          <p className="site-footer-text">
            Strategic digital marketing, SEO, social media and website solutions designed to help businesses
            strengthen their online presence and grow.
          </p>
        </div>

        <nav aria-label="Quick links">
          <h2 className="site-footer-heading">Quick Links</h2>
          <ul className="site-footer-list">
            {QUICK_LINKS.map((link) => (
              <li key={link.id}>
                <button type="button" className="site-footer-link" onClick={() => goToSection(link.id)}>
                  {link.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="site-footer-heading">Our Services</h2>
          <ul className="site-footer-list">
            {SERVICES.map((service) => (
              <li key={service}>
                <button type="button" className="site-footer-link" onClick={() => goToSection("services")}>
                  {service}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="site-footer-heading">Get in Touch</h2>
          <ul className="site-footer-list">
            {PHONES.map((phone) => (
              <li key={phone.href}>
                <a className="site-footer-link" href={phone.href}>
                  {phone.display}
                </a>
              </li>
            ))}
            <li className="site-footer-text">Coimbatore, Tamil Nadu, India</li>
          </ul>
        </div>
      </div>

      <div className="site-container site-footer-bottom">
        <p>© {new Date().getFullYear()} HD NEXORA WEBTEC. All Rights Reserved.</p>
        <ul className="flex list-none gap-6">
          <li>
            <Link className="site-footer-link" to="/privacy-policy">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link className="site-footer-link" to="/terms-and-conditions">
              Terms &amp; Conditions
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
