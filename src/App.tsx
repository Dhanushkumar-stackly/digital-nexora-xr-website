import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import { NOT_FOUND_TITLE, routeMeta } from "./constants/seo";
import { Navbar } from "./components";
import Footer from "./components/layout/Footer";
import ConsultationProvider from "./components/ConsultationProvider";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LegalPage from "./pages/LegalPage";
import { termsSections } from "./constants/content";

const BookProjectPage = lazy(() => import("./pages/BookProjectPage"));

// Router-agnostic so the same tree renders in the browser and in the build-time prerender.
const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = routeMeta[pathname]?.title ?? NOT_FOUND_TITLE;
  }, [pathname]);

  return (
    <ConsultationProvider>
      <div className="site-root relative z-0">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/book-project"
              element={
                <Suspense fallback={<div className="min-h-screen" />}>
                  <BookProjectPage />
                </Suspense>
              }
            />
            <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
            <Route
              path="/terms-and-conditions"
              element={
                <LegalPage
                  title="Terms & Conditions"
                  intro="These Terms & Conditions explain the service, payment and working arrangements between HD NEXORA WEBTEC and its clients."
                  sections={termsSections}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ConsultationProvider>
  );
};

export default App;
