import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { navLinks } from "../../constants";
import * as Assets from "../../assets";

const Navbar = () => {
  const [active, setActive] = useState<string | null>();
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (navId: string) => {
    if (navId === "book-project") {
      navigate("/book-project");
      window.scrollTo(0, 0);
    } else {
      // If not on home page, navigate to home first
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation then scroll to section
        setTimeout(() => {
          const element = document.getElementById(navId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);
      } else {
        // Already on home page, just scroll
        const element = document.getElementById(navId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setActive(navId);
    setToggle(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setActive("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    const navbarHighlighter = () => {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((current) => {
        const sectionId = current.getAttribute("id");
        const sectionHeight = (current as HTMLElement).offsetHeight;
        const sectionTop =
          current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (sectionTop < 0 && sectionTop + sectionHeight > 0) {
          setActive(sectionId);
        }
      });
    };

    window.addEventListener("scroll", navbarHighlighter);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", navbarHighlighter);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 z-20 flex w-full items-center py-5 px-6 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* Logo and Hamburger Menu Container */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={Assets.dnxLogo ?? ""}
              alt="DNX Logo"
              className="h-[60px] w-[66px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <p className="flex cursor-pointer text-[18px] font-bold text-white transition-all duration-300 group-hover:tracking-wider">
              Digital Nexora XR
            </p>
          </Link>

          {/* Hamburger Menu Button - Only visible on mobile, right next to logo */}
          <button
            onClick={() => setToggle(!toggle)}
            className="cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-white/10 lg:hidden"
            aria-label={toggle ? "Close menu" : "Open menu"}
            type="button"
          >
            <img
              src={toggle ? Assets.close ?? "" : Assets.menu ?? ""}
              alt=""
              className="h-[28px] w-[28px] object-contain transition-all duration-200"
            />
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden list-none flex-row gap-10 lg:flex">
          {navLinks.map((nav) => (
            <li key={nav.id}>
              <button
                className={`${
                  active === nav.id ? "text-white" : "text-secondary"
                } cursor-pointer text-[18px] font-medium hover:text-white transition-colors duration-200`}
                onClick={() => handleNavClick(nav.id)}
                type="button"
              >
                {nav.title}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Dropdown */}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } black-gradient absolute right-0 top-20 z-10 mx-4 my-2 min-w-[140px] rounded-xl p-6 lg:hidden`}
        >
          <ul className="flex flex-1 list-none flex-col items-start justify-end gap-4">
            {navLinks.map((nav) => (
              <li key={nav.id}>
                <button
                  className={`font-poppins cursor-pointer text-[16px] font-medium ${
                    active === nav.id ? "text-white" : "text-secondary"
                  } hover:text-white transition-colors duration-200`}
                  onClick={() => handleNavClick(nav.id)}
                  type="button"
                >
                  {nav.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
