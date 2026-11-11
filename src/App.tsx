import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { config } from "./constants/config";
import { Navbar } from "./components";
import Footer from "./components/layout/Footer";
import ConsultationProvider from "./components/ConsultationProvider";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LegalPage from "./pages/LegalPage";

const BookProjectPage = lazy(() => import("./pages/BookProjectPage"));

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  return (
    <BrowserRouter>
      <ConsultationProvider>
        <div className="site-root relative z-0">
          <Navbar />
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
            <Route path="/terms-and-conditions" element={<LegalPage title="Terms & Conditions" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </ConsultationProvider>
    </BrowserRouter>
  );
};

export default App;
