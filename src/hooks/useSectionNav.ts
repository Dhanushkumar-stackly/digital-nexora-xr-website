import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const scrollToSection = (id: string) => {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export const useSectionNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (id: string) => {
      if (pathname === "/") {
        scrollToSection(id);
        return;
      }
      navigate("/");
      // Give the home page a moment to render before scrolling.
      setTimeout(() => scrollToSection(id), 500);
    },
    [navigate, pathname]
  );
};
