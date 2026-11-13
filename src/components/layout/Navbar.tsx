import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { navLinks } from "../../constants";
import * as Assets from "../../assets";
import { useConsultation } from "../../hooks/useConsultation";
import { useSectionNav } from "../../hooks/useSectionNav";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const goToSection = useSectionNav();
  const openConsultation = useConsultation();

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    goToSection(id);
    setActive(id);
    setMenuOpen(false);
  };

  const handleConsultation = () => {
    setMenuOpen(false);
    openConsultation();
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);

      let current = "";
      document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => {
        const top = section.getBoundingClientRect().top - section.offsetHeight * 0.2;
        if (top < 0 && top + section.offsetHeight > 0) current = section.id;
      });
      setActive(window.scrollY > 100 ? current : "");
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <nav className={`site-nav fixed top-0 z-30 w-full px-5 py-3 sm:px-6 ${scrolled || menuOpen ? "is-scrolled" : ""}`}>
      {/* Phones (<640px): menu button first, logo right after it. Tablet/desktop keep logo left, menu right. */}
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 max-sm:justify-start max-sm:gap-3">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo(0, 0);
          }}
        >
          <img src={Assets.dnxLogo} alt="" className="h-11 w-11 shrink-0 object-contain" />
          <span className="font-display truncate text-[15px] font-bold tracking-[0.04em] text-white sm:text-[17px]">
            HD NEXORA WEBTEC
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-7 max-sm:order-first">
          <ul className="hidden list-none items-center gap-7 xl:flex">
            {navLinks.map((nav) => (
              <li key={nav.id}>
                <a
                  href={`/#${nav.id}`}
                  onClick={(e) => handleNavClick(e, nav.id)}
                  className={`site-nav-link ${active === nav.id ? "is-active" : ""}`}
                  aria-current={active === nav.id ? "true" : undefined}
                >
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>

          <button type="button" onClick={handleConsultation} className="agency-button-primary site-nav-cta hidden sm:inline-flex">
            Book a Free Consultation
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="site-nav-toggle xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <img src={menuOpen ? Assets.close : Assets.menu} alt="" className="h-5 w-5 object-contain" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="site-nav-menu xl:hidden">
          <ul className="flex list-none flex-col">
            {navLinks.map((nav) => (
              <li key={nav.id}>
                <a
                  href={`/#${nav.id}`}
                  onClick={(e) => handleNavClick(e, nav.id)}
                  className={`site-nav-menu-link ${active === nav.id ? "is-active" : ""}`}
                >
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleConsultation} className="agency-button-primary mt-4 w-full">
            Book a Free Consultation
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
